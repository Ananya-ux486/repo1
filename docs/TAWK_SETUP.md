# tawk.to setup — step by step (TasmaFive)

Aapka Property ID: `6a5e3e8f1a1df41d5c178534`  
Aapka Widget ID: `1ju028oi0`  
(Ye pehle se `frontend/.env.local` mein set hai.)

---

## Step 1 — Overview (aap yahan ho)

Dashboard → Property **TasmaFive Solutions** → Overview  
Status **Active** hona chahiye. ✅

---

## Step 2 — Hide default green bubble

1. Left sidebar → **Administration** (gear) → **Chat Widget**
2. **Widget Appearance** / **Visibility** section kholo
3. Option dhoondo: **Hide the widget on load** / **Hide widget** / **Don’t show widget by default**
4. ON karo aur **Save**

Isse default green tawk bubble nahi dikhega. Site ka apna orange “Need help?” button hi open karega.

---

## Step 3 — AI Assist on karo + training data

1. Dashboard → **Add-ons** → **AI Assist** (ya **Channels → AI**)
2. **Enable** / turn ON
3. Knowledge base / Training content / FAQ area kholo
4. File `docs/tawk-training-data.txt` ka **poora text copy-paste** karo
5. **Save / Publish**

Iske baad bot web development prices aur contact details sahi batayega.

---

## Step 4 — Widget brand (optional, recommended)

1. **Chat Widget → Appearance**
2. Primary color ≈ brand orange `#ea580c` / `#f97316`
3. Company name: **TasmaFive Solutions**
4. Greeting: e.g. `Hi! Ask about our services, web development pricing, or contact details.`
5. Save

---

## Step 5 — Domains (local + live)

1. **Administration → Domains** (ya Property settings)
2. Allow:
   - `localhost`
   - `127.0.0.1`
   - `project.tasmafivesolutions.com` (jo pehle se hai)
3. Save

---

## Step 6 — Site pe test

1. Backend + frontend dono chalao (`README.md`)
2. Chrome → http://localhost:3000
3. Hard refresh: `Ctrl + Shift + R`
4. Orange chatbot / “Need help?” click karo
5. tawk window open hona chahiye (default green bubble nahi)
6. Pocho: `Web development price?` — AI Assist training ke hisaab se jawab de

---

## Agar chat open na ho

- Browser console mein tawk script error check karo
- Step 2 (hide on load) confirm karo — phir bhi custom button se open hona chahiye
- `.env.local` IDs sahi hain (script wale IDs ke saath match)
- Ad-blocker / Brave shields temporarily off karke try karo
