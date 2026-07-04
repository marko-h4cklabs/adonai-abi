# ADONAI — web stranica

Statična, jednostranična (scrollable) web stranica za glazbeni sastav **ADONAI**,
koji djeluje u okviru udruge građana **„Ima Nade"**. Svrha: netko vidi koncertni
plakat, dođe ovdje i odmah razumije tko je ADONAI te može poslušati glazbu.

Stranica je **statična** (samo HTML, CSS i malo vanilla JavaScripta), bez frameworka,
bez build-koraka i **bez vanjskih CDN-ova**. Svi fontovi su lokalni (`.woff2`) radi
brzine i usklađenosti s GDPR-om.

---

## Struktura projekta

```
adonai-abi/
├── index.html          # cijela stranica (sve sekcije)
├── css/
│   └── styles.css      # svi stilovi
├── js/
│   └── main.js         # samo mobilni izbornik (hamburger)
├── assets/
│   ├── fonts/          # self-hosted Oswald + Inter (.woff2)
│   ├── img/            # poster, galerija, favicon, og-cover
│   ├── audio/          # mp3 isječci
│   └── video/          # (prazno — opcionalno)
├── CNAME               # custom domena (trenutno PLACEHOLDER_DOMAIN)
├── .nojekyll           # isključuje Jekyll obradu na GitHub Pagesu
└── README.md
```

---

## Pokretanje lokalno

Stranica je čisti statični sadržaj, pa je dovoljan bilo koji lokalni server.
Iz korijena projekta pokrenite jedan od sljedećih:

```bash
# Python (dolazi s macOS-om / većinom Linuxa)
python3 -m http.server 8000
```

Zatim u pregledniku otvorite: **http://localhost:8000**

> Napomena: možete i samo dvokliknuti `index.html`, no zbog `file://` ograničenja
> preporučuje se lokalni server (ispravno učitavanje fontova i medija).

### Provjera bez interneta (fontovi su lokalni)
Isključite Wi-Fi ili u DevTools → Network postavite *Offline* pa osvježite stranicu —
tipografija se mora učitati identično jer nema vanjskih font-poziva.

---

## Objava na GitHub Pages

1. **Inicijalizirajte repozitorij i pushajte na GitHub**
   ```bash
   git init
   git add .
   git commit -m "ADONAI: initial site"
   git branch -M main
   git remote add origin https://github.com/<korisnik>/<repo>.git
   git push -u origin main
   ```

2. **Uključite GitHub Pages**
   Repozitorij → **Settings → Pages → Build and deployment**
   → *Deploy from a branch* → grana **main**, mapa **/ (root)** → **Save**.

3. **Custom domena**
   U datoteci `CNAME` zamijenite `PLACEHOLDER_DOMAIN` svojom domenom
   (npr. `adonai.hr`), commitajte i pushajte. Na **Settings → Pages → Custom domain**
   upišite istu domenu.

4. **DNS zapisi** (kod vašeg registrara domene)
   - **Apex domena** (`adonai.hr`) → četiri **A** zapisa:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **www** poddomena → **CNAME** zapis prema `<korisnik>.github.io`

5. **Enforce HTTPS**
   Kad se DNS proširi, na **Settings → Pages** označite **Enforce HTTPS**.

---

## Što još treba popuniti (vidi i komentare u `index.html`)

- **YouTube kanal** — link u YouTube bloku (sekcija „Glazba i galerija").
- **Donacije** — odabrati primatelja (IMA NADE HR ili IMA NADE SRBIJA) i upisati
  stvarni link/podatke za uplatu (sekcija „Doniraj").
- **Kontakt e-mail** — zamijeniti `info@PLACEHOLDER` (sekcija „Kontakt"); po želji
  aktivirati zakomentirani Formspree obrazac.
- **Termini koncerata** — dodati stvarne datume (predložak reda je u komentaru u
  tablici „Najave i turneje").
- **Prave fotografije, poster, glazba** — zamijeniti placeholder datoteke u
  `assets/img/` i `assets/audio/` stvarnim materijalima ADONAI-ja.
- **og-cover.jpg** — po želji zamijeniti kvalitetnijom rasteriziranom slikom
  1200×630 (trenutna je generirana iz `og-cover.svg`).

---

## Tehničke napomene

- **Fontovi:** Oswald (naslovi) + Inter (tekst), oboje SIL Open Font License,
  self-hostano kao `.woff2` s `latin` i `latin-ext` podskupovima (hrvatski
  dijakritički znakovi č ć đ š ž).
- **Pristupačnost:** semantički HTML, „skip" link, vidljiv fokus tipkovnice,
  alt tekstovi, poštuje `prefers-reduced-motion`.
- **Responzivnost:** mobile-first; testirano na 375 / 768 / 1280 px.
