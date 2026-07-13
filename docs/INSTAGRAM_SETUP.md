# Instagram Live Feed Setup (READ-ONLY)

Website sirf **posts fetch** karti hai.  
**Koi edit / delete / comment / publish permission nahi** maangi jaati.

## Sirf ye permission chahiye

| Permission | Kaam | Lena hai? |
|------------|------|-----------|
| `instagram_business_basic` | Profile + **media/posts read** | **HAAN** |
| `instagram_business_content_publish` | Post upload/edit | **NAHI** |
| `instagram_business_manage_comments` | Comments manage | **NAHI** |
| `instagram_business_manage_messages` | DMs | **NAHI** |

Account type: Instagram **Business** ya **Creator** (`@tasmafivesolutions`).

---

## Step-by-step (Meta)

### 1) Account ready
1. Instagram pe `@tasmafivesolutions` → **Professional account** (Business/Creator).
2. Meta pe [developers.facebook.com](https://developers.facebook.com/) login.

### 2) App banao
1. **My Apps → Create App → Business**.
2. App me **Instagram** product add karo → **API setup with Instagram login**.

### 3) Permission (sirf basic)
1. App Dashboard → **App Review / Permissions**.
2. Sirf **`instagram_business_basic`** request / enable karo.
3. Publish / content / messages **mat** select karo.

### 4) Token lo (read-only)
1. **Instagram → API setup with Instagram login → Generate token** (ya Graph API Explorer).
2. Scope: **sirf** `instagram_business_basic`.
3. Authorize `@tasmafivesolutions`.
4. Short-lived token milega → **long-lived token** me exchange karo (Meta docs: Exchange a short-lived token).

### 5) User ID
Token ke baad ye call chalao (browser/Postman):

```text
GET https://graph.instagram.com/v21.0/me?fields=user_id,username&access_token=YOUR_TOKEN
```

`user_id` copy karo → ye `INSTAGRAM_USER_ID` hai.  
Agar nahi milta to `.env.local` me `INSTAGRAM_USER_ID=me` rakho.

### 6) Project me daalo
File: `tasmafive-website/.env.local` (GitHub pe **mat** push karo)

```env
INSTAGRAM_ACCESS_TOKEN=IGQWxxxx...
INSTAGRAM_USER_ID=me
```

Phir:

```powershell
cd "C:\Users\priya\OneDrive\Desktop\Ananya Dixit\tasmafive-website"
npm run dev
```

Browser: `http://localhost:3000/api/instagram`  
- `"source":"live"` → asli posts aa rahi hain  
- `"source":"fallback"` → token/permission issue (`reason` field dekho)

---

## Code safety (already in project)

- API sirf ye fields maangti hai: `id, caption, media_type, media_url, thumbnail_url, permalink, timestamp`
- Koi publish / comment / message endpoint **nahi**
- Token fail hone par site crash nahi hoti — fallback tiles dikhti hain

## Important

- `.env.local` kabhi GitHub pe mat daalna
- Token expire ho to naya long-lived token banao
- Development mode me pehle apna Instagram account **Tester** banao (App → Roles → Instagram Testers)
