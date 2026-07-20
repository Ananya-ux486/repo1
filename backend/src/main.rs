use axum::{
    extract::State,
    http::{header, HeaderMap, Method, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_extra::extract::CookieJar;
use axum_extra::extract::cookie::{Cookie, SameSite};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use chrono::Utc;
use cookie::time::Duration;
use hmac::{Hmac, Mac};
use rand::Rng;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    env,
    fs,
    path::PathBuf,
    sync::Arc,
};
use tower_http::cors::{Any, CorsLayer};

// ─── App State ──────────────────────────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    data_dir: PathBuf,
}

impl AppState {
    fn new() -> Self {
        // Prefer shared store next to the Next.js app so existing .data files keep working.
        let data_dir = env::var("DATA_DIR")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from("../frontend/.data"));
        fs::create_dir_all(&data_dir).ok();
        Self { data_dir }
    }

    fn file(&self, name: &str) -> PathBuf {
        self.data_dir.join(name)
    }
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

fn auth_secret() -> String {
    env::var("AUTH_SECRET")
        .or_else(|_| env::var("NEXTAUTH_SECRET"))
        .unwrap_or_else(|_| "tasmafive-dev-auth-secret-change-me".into())
}

const COOKIE_NAME: &str = "tf_projects_auth";
const MAX_AGE_SEC: i64 = 60 * 60 * 24 * 7; // 7 days

#[derive(Debug, Serialize, Deserialize, Clone)]
struct SessionPayload {
    #[serde(rename = "userId")]
    user_id: String,
    email: String,
    name: String,
    #[serde(rename = "projectsAccess")]
    projects_access: bool,
    exp: i64,
}

/// Encode: base64url(JSON) + "." + base64url(HMAC-SHA256)
fn encode_session(payload: &SessionPayload) -> String {
    let body = URL_SAFE_NO_PAD.encode(serde_json::to_string(payload).unwrap());
    let mut mac = Hmac::<Sha256>::new_from_slice(auth_secret().as_bytes()).unwrap();
    mac.update(body.as_bytes());
    let sig = URL_SAFE_NO_PAD.encode(mac.finalize().into_bytes());
    format!("{body}.{sig}")
}

/// Decode & verify token. Returns None if invalid/expired.
fn decode_session(token: &str) -> Option<SessionPayload> {
    let parts: Vec<&str> = token.splitn(2, '.').collect();
    if parts.len() != 2 {
        return None;
    }
    let (body, sig) = (parts[0], parts[1]);
    let mut mac = Hmac::<Sha256>::new_from_slice(auth_secret().as_bytes()).unwrap();
    mac.update(body.as_bytes());
    let expected = URL_SAFE_NO_PAD.encode(mac.finalize().into_bytes());
    // Timing-safe compare
    if sig.len() != expected.len() {
        return None;
    }
    let eq = sig
        .as_bytes()
        .iter()
        .zip(expected.as_bytes().iter())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b));
    if eq != 0 {
        return None;
    }
    let json_bytes = URL_SAFE_NO_PAD.decode(body).ok()?;
    let payload: SessionPayload = serde_json::from_slice(&json_bytes).ok()?;
    let now_ms = Utc::now().timestamp_millis();
    if payload.exp < now_ms {
        return None;
    }
    Some(payload)
}

fn create_session_token(
    user_id: &str,
    email: &str,
    name: &str,
    projects_access: bool,
) -> String {
    let exp = Utc::now().timestamp_millis() + MAX_AGE_SEC * 1000;
    let payload = SessionPayload {
        user_id: user_id.into(),
        email: email.into(),
        name: name.into(),
        projects_access,
        exp,
    };
    encode_session(&payload)
}

fn session_cookie(token: &str) -> Cookie<'static> {
    let is_prod = env::var("NODE_ENV").unwrap_or_default() == "production";
    Cookie::build((COOKIE_NAME, token.to_owned()))
        .http_only(true)
        .same_site(SameSite::Lax)
        .secure(is_prod)
        .path("/")
        .max_age(Duration::seconds(MAX_AGE_SEC))
        .build()
}

fn clear_cookie() -> Cookie<'static> {
    let is_prod = env::var("NODE_ENV").unwrap_or_default() == "production";
    Cookie::build((COOKIE_NAME, ""))
        .http_only(true)
        .same_site(SameSite::Lax)
        .secure(is_prod)
        .path("/")
        .max_age(Duration::seconds(0))
        .build()
}

fn get_session_from_jar(jar: &CookieJar) -> Option<SessionPayload> {
    let token = jar.get(COOKIE_NAME)?.value().to_owned();
    decode_session(&token)
}

// ─── Password: scrypt matching Node's defaults N=16384 r=8 p=1 ───────────────

fn hash_password(password: &str, salt_opt: Option<&str>) -> (String, String) {
    let salt = match salt_opt {
        Some(s) => s.to_owned(),
        None => {
            let bytes: [u8; 16] = rand::thread_rng().gen();
            hex::encode(bytes)
        }
    };
    let params = scrypt::Params::new(14, 8, 1, 64).unwrap(); // N=2^14=16384
    let mut hash = vec![0u8; 64];
    scrypt::scrypt(password.as_bytes(), salt.as_bytes(), &params, &mut hash).unwrap();
    (hex::encode(hash), salt)
}

fn verify_password(password: &str, hash: &str, salt: &str) -> bool {
    let (computed, _) = hash_password(password, Some(salt));
    if computed.len() != hash.len() {
        return false;
    }
    computed
        .as_bytes()
        .iter()
        .zip(hash.as_bytes().iter())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

// ─── OTP helpers ─────────────────────────────────────────────────────────────

fn hash_otp(code: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(code.as_bytes());
    hex::encode(hasher.finalize())
}

fn generate_otp() -> String {
    format!("{:06}", rand::thread_rng().gen_range(100000..1000000))
}

fn random_id(bytes: usize) -> String {
    let b: Vec<u8> = (0..bytes).map(|_| rand::thread_rng().gen::<u8>()).collect();
    hex::encode(b)
}

fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

// ─── Auth Store types ─────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone)]
struct AuthUser {
    id: String,
    name: String,
    email: String,
    phone: String,
    #[serde(rename = "passwordHash")]
    password_hash: String,
    #[serde(rename = "passwordSalt")]
    password_salt: String,
    #[serde(rename = "createdAt")]
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct OtpRecord {
    email: String,
    #[serde(rename = "codeHash")]
    code_hash: String,
    #[serde(rename = "expiresAt")]
    expires_at: i64,
    purpose: String,
    attempts: u32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct AuthStore {
    users: Vec<AuthUser>,
    otps: Vec<OtpRecord>,
}

fn read_auth_store(state: &AppState) -> AuthStore {
    let p = state.file("auth-store.json");
    if !p.exists() {
        return AuthStore::default();
    }
    let raw = fs::read_to_string(&p).unwrap_or_default();
    serde_json::from_str(&raw).unwrap_or_default()
}

fn write_auth_store(state: &AppState, store: &AuthStore) {
    let p = state.file("auth-store.json");
    fs::write(p, serde_json::to_string_pretty(store).unwrap()).ok();
}

// ─── Activity types ───────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone)]
struct LoginActivity {
    id: String,
    #[serde(rename = "type")]
    kind: String,
    name: String,
    email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    phone: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    ip: Option<String>,
    #[serde(rename = "userAgent", skip_serializing_if = "Option::is_none")]
    user_agent: Option<String>,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "notifiedAdmin")]
    notified_admin: bool,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct ActivityStore {
    events: Vec<LoginActivity>,
}

fn read_activity(state: &AppState) -> ActivityStore {
    let p = state.file("login-activity.json");
    if !p.exists() {
        return ActivityStore::default();
    }
    let raw = fs::read_to_string(&p).unwrap_or_default();
    serde_json::from_str(&raw).unwrap_or_default()
}

fn write_activity(state: &AppState, store: &ActivityStore) {
    let p = state.file("login-activity.json");
    fs::write(p, serde_json::to_string_pretty(store).unwrap()).ok();
}

fn log_activity(state: &AppState, kind: &str, name: &str, email: &str, phone: Option<&str>, ip: Option<&str>, ua: Option<&str>) -> LoginActivity {
    let mut store = read_activity(state);
    let event = LoginActivity {
        id: random_id(8),
        kind: kind.into(),
        name: name.into(),
        email: email.into(),
        phone: phone.map(|s| s.into()),
        ip: ip.map(|s| s.into()),
        user_agent: ua.map(|s| s.into()),
        created_at: Utc::now().to_rfc3339(),
        notified_admin: false,
    };
    store.events.insert(0, event.clone());
    store.events.truncate(500);
    write_activity(state, &store);
    event
}

fn mark_activity_notified(state: &AppState, id: &str) {
    let mut store = read_activity(state);
    if let Some(e) = store.events.iter_mut().find(|e| e.id == id) {
        e.notified_admin = true;
    }
    write_activity(state, &store);
}

// ─── Email helpers (Resend) ───────────────────────────────────────────────────

async fn send_otp_email(to: &str, name: &str, code: &str) -> bool {
    let api_key = match env::var("RESEND_API_KEY") {
        Ok(k) if !k.trim().is_empty() => k.trim().to_owned(),
        _ => {
            eprintln!("[auth-otp] Demo OTP for {to}: {code}");
            return false;
        }
    };
    let from = env::var("AUTH_FROM_EMAIL")
        .unwrap_or_else(|_| "TasmaFive <onboarding@resend.dev>".into());

    let html = format!(
        r#"<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
<h2 style="margin:0 0 12px;color:#ea580c">TasmaFive Solutions</h2>
<p style="margin:0 0 16px">Hi {name},</p>
<p style="margin:0 0 16px">Use this one-time password to unlock our private project portfolio:</p>
<p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:24px 0;color:#0f172a">{code}</p>
<p style="margin:0 0 8px;color:#64748b;font-size:14px">This code expires in 10 minutes. Do not share it with anyone.</p>
<p style="margin:24px 0 0;color:#94a3b8;font-size:12px">© TasmaFive Solutions</p>
</div>"#
    );

    let client = reqwest::Client::new();
    let res = client
        .post("https://api.resend.com/emails")
        .bearer_auth(&api_key)
        .json(&json!({
            "from": from,
            "to": [to],
            "subject": format!("{code} is your TasmaFive verification code"),
            "html": html,
        }))
        .send()
        .await;

    match res {
        Ok(r) if r.status().is_success() => true,
        Ok(r) => {
            eprintln!("[auth-otp] Resend failed {}", r.status());
            false
        }
        Err(e) => {
            eprintln!("[auth-otp] send error: {e}");
            false
        }
    }
}

async fn notify_admin(kind: &str, name: &str, email: &str, phone: Option<&str>, ip: Option<&str>, created_at: &str) -> bool {
    let api_key = match env::var("RESEND_API_KEY") {
        Ok(k) if !k.trim().is_empty() => k.trim().to_owned(),
        _ => return false,
    };
    let admin_to = env::var("PROJECTS_ADMIN_NOTIFY_EMAIL")
        .or_else(|_| env::var("PROJECTS_ADMIN_EMAIL"))
        .unwrap_or_else(|_| "admin@tasmafivesolutions.com".into());
    let from = env::var("AUTH_FROM_EMAIL")
        .unwrap_or_else(|_| "TasmaFive <onboarding@resend.dev>".into());

    let label = match kind {
        "signup" => "New signup",
        "otp_verified" => "Projects unlocked (OTP verified)",
        "admin_login" => "Admin login",
        _ => "Login activity",
    };

    let html = format!(
        r#"<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
<h2 style="margin:0 0 8px;color:#ea580c">Portfolio access alert</h2>
<p style="margin:0 0 16px;color:#64748b">{label}</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<tr><td style="padding:8px 0;color:#64748b">Name</td><td style="padding:8px 0;font-weight:600">{name}</td></tr>
<tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0;font-weight:600">{email}</td></tr>
<tr><td style="padding:8px 0;color:#64748b">Phone</td><td style="padding:8px 0;font-weight:600">{}</td></tr>
<tr><td style="padding:8px 0;color:#64748b">IP</td><td style="padding:8px 0;font-weight:600">{}</td></tr>
<tr><td style="padding:8px 0;color:#64748b">Time</td><td style="padding:8px 0;font-weight:600">{created_at}</td></tr>
</table>
</div>"#,
        phone.unwrap_or("—"),
        ip.unwrap_or("—"),
    );

    let client = reqwest::Client::new();
    let res = client
        .post("https://api.resend.com/emails")
        .bearer_auth(&api_key)
        .json(&json!({
            "from": from,
            "to": [admin_to],
            "subject": format!("[TasmaFive] {label}: {name}"),
            "html": html,
        }))
        .send()
        .await;

    match res {
        Ok(r) if r.status().is_success() => true,
        _ => false,
    }
}

// ─── Client meta ─────────────────────────────────────────────────────────────

fn client_ip(headers: &HeaderMap) -> Option<String> {
    headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.split(',').next().unwrap_or("").trim().to_owned())
        .or_else(|| {
            headers
                .get("x-real-ip")
                .and_then(|v| v.to_str().ok())
                .map(|s| s.to_owned())
        })
}

fn client_ua(headers: &HeaderMap) -> Option<String> {
    headers
        .get(header::USER_AGENT)
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_owned())
}

// ─── /api/contact ────────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct ContactBody {
    name: Option<String>,
    email: Option<String>,
    phone: Option<String>,
    reason: Option<String>,
    message: Option<String>,
}

async fn contact_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<ContactBody>,
) -> impl IntoResponse {
    let name = body.name.unwrap_or_default().trim().to_owned();
    let email = normalize_email(&body.email.unwrap_or_default());
    let phone = body.phone.unwrap_or_default().trim().to_owned();
    let reason = body.reason.unwrap_or_default().trim().to_owned();
    let message = body.message.unwrap_or_default().trim().to_owned();

    if name.is_empty() || email.is_empty() || reason.is_empty() || message.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "Name, email, reason, and message are required."}))).into_response();
    }

    let file = state.file("contact-messages.json");
    let mut list: Vec<Value> = if file.exists() {
        let raw = fs::read_to_string(&file).unwrap_or_default();
        serde_json::from_str(&raw).unwrap_or_default()
    } else {
        vec![]
    };

    let entry = json!({
        "id": random_id(8),
        "name": name,
        "email": email,
        "phone": phone,
        "reason": reason,
        "message": message,
        "createdAt": Utc::now().to_rfc3339(),
    });
    list.insert(0, entry);
    list.truncate(200);
    fs::write(&file, serde_json::to_string_pretty(&list).unwrap()).ok();

    (StatusCode::OK, Json(json!({"ok": true}))).into_response()
}

// ─── /api/quote ──────────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct QuoteBody {
    name: Option<String>,
    email: Option<String>,
    phone: Option<String>,
    #[serde(rename = "projectType")]
    project_type: Option<String>,
    budget: Option<String>,
    details: Option<String>,
}

async fn quote_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<QuoteBody>,
) -> impl IntoResponse {
    let name = body.name.unwrap_or_default().trim().to_owned();
    let email = normalize_email(&body.email.unwrap_or_default());
    let phone = body.phone.unwrap_or_default().trim().to_owned();
    let project_type = body.project_type.unwrap_or_default().trim().to_owned();
    let budget = body.budget.unwrap_or_default().trim().to_owned();
    let details = body.details.unwrap_or_default().trim().to_owned();

    if name.is_empty() || email.is_empty() || phone.is_empty() || project_type.is_empty() || budget.is_empty() || details.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "Please fill all required fields."}))).into_response();
    }

    let file = state.file("quote-requests.json");
    let mut list: Vec<Value> = if file.exists() {
        let raw = fs::read_to_string(&file).unwrap_or_default();
        serde_json::from_str(&raw).unwrap_or_default()
    } else {
        vec![]
    };

    list.insert(0, json!({
        "id": random_id(8),
        "name": name,
        "email": email,
        "phone": phone,
        "projectType": project_type,
        "budget": budget,
        "details": details,
        "createdAt": Utc::now().to_rfc3339(),
    }));
    list.truncate(200);
    fs::write(&file, serde_json::to_string_pretty(&list).unwrap()).ok();

    (StatusCode::OK, Json(json!({"ok": true}))).into_response()
}

// ─── /api/audit ──────────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct AuditBody {
    name: Option<String>,
    email: Option<String>,
    #[serde(rename = "countryCode")]
    country_code: Option<String>,
    phone: Option<String>,
    company: Option<String>,
    website: Option<String>,
    focus: Option<String>,
    message: Option<String>,
}

async fn audit_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<AuditBody>,
) -> impl IntoResponse {
    let name = body.name.unwrap_or_default().trim().to_owned();
    let email = normalize_email(&body.email.unwrap_or_default());
    let country_code = body.country_code.unwrap_or_default().trim().to_owned();
    let phone = body.phone.unwrap_or_default().trim().to_owned();
    let company = body.company.unwrap_or_default().trim().to_owned();
    let website = body.website.unwrap_or_default().trim().to_owned();
    let focus = body.focus.unwrap_or_default().trim().to_owned();
    let message = body.message.unwrap_or_default().trim().to_owned();

    if name.is_empty() || email.is_empty() || phone.is_empty() || country_code.is_empty() || focus.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "Name, email, phone with country code, and audit focus are required."}))).into_response();
    }

    let file = state.file("audit-requests.json");
    let mut list: Vec<Value> = if file.exists() {
        let raw = fs::read_to_string(&file).unwrap_or_default();
        serde_json::from_str(&raw).unwrap_or_default()
    } else {
        vec![]
    };

    list.insert(0, json!({
        "id": random_id(8),
        "name": name,
        "email": email,
        "countryCode": country_code,
        "phone": phone,
        "fullPhone": format!("{} {}", country_code, phone),
        "company": company,
        "website": website,
        "focus": focus,
        "message": message,
        "createdAt": Utc::now().to_rfc3339(),
    }));
    list.truncate(200);
    fs::write(&file, serde_json::to_string_pretty(&list).unwrap()).ok();

    (StatusCode::OK, Json(json!({"ok": true}))).into_response()
}

// ─── /api/instagram ──────────────────────────────────────────────────────────

async fn instagram_handler() -> impl IntoResponse {
    let token = env::var("INSTAGRAM_ACCESS_TOKEN").unwrap_or_default();
    let token = token.trim();

    if token.is_empty() {
        return (StatusCode::OK, Json(json!({
            "posts": [],
            "source": "fallback",
            "reason": "missing_token"
        }))).into_response();
    }

    let user_id = env::var("INSTAGRAM_USER_ID").unwrap_or_else(|_| "me".into());
    let user_id = user_id.trim();
    let fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

    let url = format!(
        "https://graph.instagram.com/v21.0/{}/media?fields={}&limit=12&access_token={}",
        percent_encoding::utf8_percent_encode(user_id, percent_encoding::NON_ALPHANUMERIC),
        fields,
        percent_encoding::utf8_percent_encode(token, percent_encoding::NON_ALPHANUMERIC),
    );

    let client = reqwest::Client::new();
    let res = client.get(&url).send().await;

    match res {
        Ok(r) if r.status().is_success() => {
            let data: Value = r.json().await.unwrap_or(json!({}));
            let posts = data["data"].as_array().cloned().unwrap_or_default();
            let mapped: Vec<Value> = posts
                .iter()
                .filter_map(|item| {
                    let image = item["media_url"]
                        .as_str()
                        .or_else(|| item["thumbnail_url"].as_str())?;
                    let media_type = item["media_type"].as_str().unwrap_or("IMAGE");
                    let normalized = match media_type {
                        "VIDEO" => "VIDEO",
                        "CAROUSEL_ALBUM" => "CAROUSEL_ALBUM",
                        _ => "IMAGE",
                    };
                    Some(json!({
                        "id": item["id"],
                        "image": image,
                        "permalink": item["permalink"].as_str().unwrap_or("https://www.instagram.com/tasmafivesolutions/"),
                        "caption": item["caption"].as_str().unwrap_or(""),
                        "likes": 0,
                        "comments": 0,
                        "timestamp": item["timestamp"],
                        "mediaType": normalized,
                    }))
                })
                .take(12)
                .collect();

            if mapped.is_empty() {
                return (StatusCode::OK, Json(json!({"posts":[],"source":"fallback","reason":"empty_feed"}))).into_response();
            }
            (StatusCode::OK, Json(json!({"posts": mapped, "source": "live"}))).into_response()
        }
        _ => (StatusCode::OK, Json(json!({"posts":[],"source":"fallback","reason":"fetch_error"}))).into_response(),
    }
}

// ─── /api/auth/login ─────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct LoginBody {
    email: Option<String>,
    password: Option<String>,
}

async fn auth_login_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    jar: CookieJar,
    Json(body): Json<LoginBody>,
) -> impl IntoResponse {
    let email = normalize_email(&body.email.unwrap_or_default());
    let password = body.password.unwrap_or_default();

    if email.is_empty() || password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            jar,
            Json(json!({"error": "Email and password are required."})),
        ).into_response();
    }

    let mut store = read_auth_store(&state);
    let user = match store.users.iter().find(|u| u.email == email).cloned() {
        Some(u) => u,
        None => return (StatusCode::UNAUTHORIZED, jar, Json(json!({"error": "Invalid email or password."}))).into_response(),
    };

    if !verify_password(&password, &user.password_hash, &user.password_salt) {
        return (StatusCode::UNAUTHORIZED, jar, Json(json!({"error": "Invalid email or password."}))).into_response();
    }

    // Create OTP
    let code = generate_otp();
    let normalized = normalize_email(&user.email);
    store.otps.retain(|o| o.email != normalized);
    store.otps.push(OtpRecord {
        email: normalized.clone(),
        code_hash: hash_otp(&code),
        expires_at: Utc::now().timestamp_millis() + 10 * 60 * 1000,
        purpose: "projects-access".into(),
        attempts: 0,
    });
    write_auth_store(&state, &store);

    let ip = client_ip(&headers);
    let ua = client_ua(&headers);
    let event = log_activity(&state, "login", &user.name, &user.email, Some(&user.phone), ip.as_deref(), ua.as_deref());
    let notified = notify_admin("login", &event.name, &event.email, event.phone.as_deref(), event.ip.as_deref(), &event.created_at).await;
    if notified { mark_activity_notified(&state, &event.id); }

    let token = create_session_token(&user.id, &user.email, &user.name, false);
    let delivered = send_otp_email(&user.email, &user.name, &code).await;
    let demo_otp = if !delivered { Some(code.clone()) } else { None };

    let new_jar = jar.add(session_cookie(&token));
    let mut resp = json!({
        "ok": true,
        "user": {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone},
        "otpRequired": true,
        "message": if delivered { "OTP sent to your email." } else { "Enter the OTP to unlock projects." },
    });
    if let Some(otp) = demo_otp {
        resp["demoOtp"] = json!(otp);
    }

    (StatusCode::OK, new_jar, Json(resp)).into_response()
}

// ─── /api/auth/signup ────────────────────────────────────────────────────────

#[derive(Deserialize)]
struct SignupBody {
    name: Option<String>,
    email: Option<String>,
    phone: Option<String>,
    password: Option<String>,
}

async fn auth_signup_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    jar: CookieJar,
    Json(body): Json<SignupBody>,
) -> impl IntoResponse {
    let name = body.name.unwrap_or_default().trim().to_owned();
    let email = normalize_email(&body.email.unwrap_or_default());
    let phone = body.phone.unwrap_or_default().trim().to_owned();
    let password = body.password.unwrap_or_default();

    if name.len() < 2 {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Please enter your full name."}))).into_response();
    }
    let email_re = regex::Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap();
    if !email_re.is_match(&email) {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Please enter a valid email address."}))).into_response();
    }
    let phone_re = regex::Regex::new(r"^[+\d][\d\s\-]{8,15}$").unwrap();
    if !phone_re.is_match(&phone) {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Please enter a valid phone number."}))).into_response();
    }
    if password.len() < 6 {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Password must be at least 6 characters."}))).into_response();
    }

    let mut store = read_auth_store(&state);
    if store.users.iter().any(|u| u.email == email) {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "An account with this email already exists. Please log in."}))).into_response();
    }

    let (hash, salt) = hash_password(&password, None);
    let user = AuthUser {
        id: random_id(12),
        name: name.clone(),
        email: email.clone(),
        phone: phone.clone(),
        password_hash: hash,
        password_salt: salt,
        created_at: Utc::now().to_rfc3339(),
    };
    store.users.push(user.clone());

    let code = generate_otp();
    store.otps.retain(|o| o.email != email);
    store.otps.push(OtpRecord {
        email: email.clone(),
        code_hash: hash_otp(&code),
        expires_at: Utc::now().timestamp_millis() + 10 * 60 * 1000,
        purpose: "projects-access".into(),
        attempts: 0,
    });
    write_auth_store(&state, &store);

    let ip = client_ip(&headers);
    let ua = client_ua(&headers);
    let event = log_activity(&state, "signup", &user.name, &user.email, Some(&user.phone), ip.as_deref(), ua.as_deref());
    let notified = notify_admin("signup", &event.name, &event.email, event.phone.as_deref(), event.ip.as_deref(), &event.created_at).await;
    if notified { mark_activity_notified(&state, &event.id); }

    let token = create_session_token(&user.id, &user.email, &user.name, false);
    let delivered = send_otp_email(&user.email, &user.name, &code).await;
    let demo_otp = if !delivered { Some(code.clone()) } else { None };

    let new_jar = jar.add(session_cookie(&token));
    let mut resp = json!({
        "ok": true,
        "user": {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone},
        "otpRequired": true,
        "message": if delivered { "Account created. OTP sent to your email." } else { "Account created. Enter the OTP to unlock projects." },
    });
    if let Some(otp) = demo_otp {
        resp["demoOtp"] = json!(otp);
    }

    (StatusCode::OK, new_jar, Json(resp)).into_response()
}

// ─── /api/auth/logout ────────────────────────────────────────────────────────

async fn auth_logout_handler(jar: CookieJar) -> impl IntoResponse {
    let new_jar = jar.add(clear_cookie());
    (StatusCode::OK, new_jar, Json(json!({"ok": true}))).into_response()
}

// ─── /api/auth/session ───────────────────────────────────────────────────────

async fn auth_session_handler(jar: CookieJar) -> impl IntoResponse {
    match get_session_from_jar(&jar) {
        None => Json(json!({"authenticated": false, "projectsAccess": false})).into_response(),
        Some(s) => Json(json!({
            "authenticated": true,
            "projectsAccess": s.projects_access,
            "user": {"id": s.user_id, "name": s.name, "email": s.email},
        })).into_response(),
    }
}

// ─── /api/auth/team-unlock ───────────────────────────────────────────────────

#[derive(Deserialize)]
struct TeamUnlockBody {
    passcode: Option<String>,
}

async fn auth_team_unlock_handler(
    jar: CookieJar,
    Json(body): Json<TeamUnlockBody>,
) -> impl IntoResponse {
    let expected = env::var("PROJECTS_TEAM_CODE").unwrap_or_else(|_| "tasmafive".into());
    let given = body.passcode.unwrap_or_default().trim().to_owned();

    if given.is_empty() || given != expected.trim() {
        return (StatusCode::UNAUTHORIZED, jar, Json(json!({"error": "Invalid team access code."}))).into_response();
    }

    let token = create_session_token("team-admin", "team@tasmafivesolutions.com", "TasmaFive Team", true);
    let new_jar = jar.add(session_cookie(&token));
    (StatusCode::OK, new_jar, Json(json!({
        "ok": true,
        "access": true,
        "user": {"id": "team-admin", "name": "TasmaFive Team", "email": "team@tasmafivesolutions.com"},
        "message": "Team access unlocked.",
    }))).into_response()
}

// ─── /api/auth/admin-login ───────────────────────────────────────────────────

#[derive(Deserialize)]
struct AdminLoginBody {
    email: Option<String>,
    password: Option<String>,
}

async fn auth_admin_login_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    jar: CookieJar,
    Json(body): Json<AdminLoginBody>,
) -> impl IntoResponse {
    let expected_email = env::var("PROJECTS_ADMIN_EMAIL")
        .unwrap_or_else(|_| "admin@tasmafivesolutions.com".into())
        .trim()
        .to_lowercase();
    let expected_password = env::var("PROJECTS_ADMIN_PASSWORD")
        .unwrap_or_else(|_| "Admin@TasmaFive".into())
        .trim()
        .to_owned();

    let email = normalize_email(&body.email.unwrap_or_default());
    let password = body.password.unwrap_or_default().trim().to_owned();

    if email.is_empty() || password.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            jar,
            Json(json!({"error": "Admin email and password are required."})),
        )
            .into_response();
    }

    if email != expected_email || password != expected_password {
        return (
            StatusCode::UNAUTHORIZED,
            jar,
            Json(json!({"error": "Invalid admin credentials."})),
        )
            .into_response();
    }

    let token = create_session_token("team-admin", &expected_email, "Admin", true);
    let new_jar = jar.add(session_cookie(&token));

    let ip = client_ip(&headers);
    let ua = client_ua(&headers);
    let event = log_activity(
        &state,
        "admin_login",
        "Admin",
        &expected_email,
        None,
        ip.as_deref(),
        ua.as_deref(),
    );
    let notified = notify_admin(
        "admin_login",
        &event.name,
        &event.email,
        None,
        event.ip.as_deref(),
        &event.created_at,
    )
    .await;
    if notified {
        mark_activity_notified(&state, &event.id);
    }

    (
        StatusCode::OK,
        new_jar,
        Json(json!({
            "ok": true,
            "access": true,
            "user": {"id": "team-admin", "name": "Admin", "email": expected_email},
            "message": "Admin access granted.",
        })),
    )
        .into_response()
}

// ─── /api/auth/otp/send ──────────────────────────────────────────────────────

#[derive(Deserialize)]
struct OtpSendBody {
    email: Option<String>,
}

async fn auth_otp_send_handler(
    State(state): State<Arc<AppState>>,
    jar: CookieJar,
    Json(body): Json<OtpSendBody>,
) -> impl IntoResponse {
    let session_email = get_session_from_jar(&jar).map(|s| s.email);
    let email = normalize_email(
        &body.email
            .or(session_email)
            .unwrap_or_default(),
    );

    if email.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "Email is required."}))).into_response();
    }

    let mut store = read_auth_store(&state);
    let user = match store.users.iter().find(|u| u.email == email).cloned() {
        Some(u) => u,
        None => return (StatusCode::NOT_FOUND, Json(json!({"error": "No account found for this email."}))).into_response(),
    };

    let code = generate_otp();
    store.otps.retain(|o| o.email != email);
    store.otps.push(OtpRecord {
        email: email.clone(),
        code_hash: hash_otp(&code),
        expires_at: Utc::now().timestamp_millis() + 10 * 60 * 1000,
        purpose: "projects-access".into(),
        attempts: 0,
    });
    write_auth_store(&state, &store);

    let delivered = send_otp_email(&user.email, &user.name, &code).await;
    let demo_otp = if !delivered { Some(code.clone()) } else { None };

    let mut resp = json!({
        "ok": true,
        "message": if delivered { "A new OTP has been sent to your email." } else { "A new OTP has been generated." },
    });
    if let Some(otp) = demo_otp {
        resp["demoOtp"] = json!(otp);
    }

    (StatusCode::OK, Json(resp)).into_response()
}

// ─── /api/auth/otp/verify ────────────────────────────────────────────────────

#[derive(Deserialize)]
struct OtpVerifyBody {
    email: Option<String>,
    code: Option<String>,
}

async fn auth_otp_verify_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    jar: CookieJar,
    Json(body): Json<OtpVerifyBody>,
) -> impl IntoResponse {
    let session_email = get_session_from_jar(&jar).map(|s| s.email);
    let email = normalize_email(
        &body.email
            .or(session_email)
            .unwrap_or_default(),
    );
    let code = body.code.unwrap_or_default().trim().to_owned();

    if email.is_empty() || !code.chars().all(|c| c.is_ascii_digit()) || code.len() != 6 {
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Enter the 6-digit OTP sent to your email."}))).into_response();
    }

    let mut store = read_auth_store(&state);

    // Find + verify OTP
    let otp_idx = match store.otps.iter().position(|o| o.email == email) {
        Some(i) => i,
        None => return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "OTP expired. Please request a new code."}))).into_response(),
    };

    let now_ms = Utc::now().timestamp_millis();
    if store.otps[otp_idx].expires_at < now_ms {
        store.otps.remove(otp_idx);
        write_auth_store(&state, &store);
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "OTP expired. Please request a new code."}))).into_response();
    }
    if store.otps[otp_idx].attempts >= 5 {
        store.otps.remove(otp_idx);
        write_auth_store(&state, &store);
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Too many attempts. Please request a new OTP."}))).into_response();
    }

    store.otps[otp_idx].attempts += 1;
    let matches = store.otps[otp_idx].code_hash == hash_otp(&code);
    if !matches {
        write_auth_store(&state, &store);
        return (StatusCode::BAD_REQUEST, jar, Json(json!({"error": "Invalid OTP. Please check and try again."}))).into_response();
    }

    store.otps.retain(|o| o.email != email);
    write_auth_store(&state, &store);

    let user = match store.users.iter().find(|u| u.email == email).cloned() {
        Some(u) => u,
        None => return (StatusCode::NOT_FOUND, jar, Json(json!({"error": "Account not found."}))).into_response(),
    };

    let token = create_session_token(&user.id, &user.email, &user.name, true);
    let new_jar = jar.add(session_cookie(&token));

    let ip = client_ip(&headers);
    let ua = client_ua(&headers);
    let event = log_activity(&state, "otp_verified", &user.name, &user.email, Some(&user.phone), ip.as_deref(), ua.as_deref());
    let notified = notify_admin("otp_verified", &event.name, &event.email, event.phone.as_deref(), event.ip.as_deref(), &event.created_at).await;
    if notified { mark_activity_notified(&state, &event.id); }

    (StatusCode::OK, new_jar, Json(json!({
        "ok": true,
        "access": true,
        "user": {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone},
        "message": "Verified. You can now view our projects.",
    }))).into_response()
}

// ─── /api/auth/activity ──────────────────────────────────────────────────────

async fn auth_activity_handler(
    State(state): State<Arc<AppState>>,
    jar: CookieJar,
) -> impl IntoResponse {
    let session = match get_session_from_jar(&jar) {
        Some(s) if s.projects_access && s.user_id == "team-admin" => s,
        _ => return (StatusCode::UNAUTHORIZED, Json(json!({"error": "Admin access required."}))).into_response(),
    };
    let _ = session;
    let store = read_activity(&state);
    let events: Vec<&LoginActivity> = store.events.iter().take(100).collect();
    (StatusCode::OK, Json(json!({"ok": true, "events": events}))).into_response()
}

// ─── Main ────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    // Load secrets from backend/.env then frontend/.env.local (shared AUTH_SECRET, etc.)
    dotenvy::dotenv().ok();
    dotenvy::from_filename("../frontend/.env.local").ok();

    let state = Arc::new(AppState::new());
    let data_display = state.data_dir.display().to_string();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any)
        .allow_credentials(false);

    let app = Router::new()
        .route("/api/contact", post(contact_handler))
        .route("/api/quote", post(quote_handler))
        .route("/api/audit", post(audit_handler))
        .route("/api/instagram", get(instagram_handler))
        .route("/api/auth/login", post(auth_login_handler))
        .route("/api/auth/signup", post(auth_signup_handler))
        .route("/api/auth/logout", post(auth_logout_handler))
        .route("/api/auth/session", get(auth_session_handler))
        .route("/api/auth/team-unlock", post(auth_team_unlock_handler))
        .route("/api/auth/admin-login", post(auth_admin_login_handler))
        .route("/api/auth/otp/send", post(auth_otp_send_handler))
        .route("/api/auth/otp/verify", post(auth_otp_verify_handler))
        .route("/api/auth/activity", get(auth_activity_handler))
        .layer(cors)
        .with_state(state);

    let addr = "0.0.0.0:8080";
    println!("[tasmafive-backend] Listening on http://{addr}  data={data_display}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
