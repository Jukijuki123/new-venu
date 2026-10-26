# VENU

**"Bertemu di Satu Ruang, Tumbuh Barengan."**

VENU adalah platform digital yang mempertemukan **sekolah** dan **UMKM** dalam
setiap event kewirausahaan (expo, bazar, market day, dsb). Sekolah bisa
membuka event dan mencari tenant yang tepat, sementara UMKM bisa menemukan
event yang relevan untuk memperluas peluang usahanya — dibantu fitur
**AI Match** yang mencocokkan keduanya secara otomatis.

Proyek ini dibuat untuk mengikuti lomba web development, dikerjakan oleh tim
yang terdiri dari frontend developer, backend developer, dan desainer.

---

## Fitur Utama

1. **Event Discovery** — UMKM mencari, memfilter, dan melihat detail event
   yang tersedia (lokasi, tanggal, kategori, kebutuhan tenant, biaya booth).
2. **AI Match** — merekomendasikan event yang cocok untuk UMKM, dan
   sebaliknya merekomendasikan UMKM yang cocok untuk kebutuhan event sekolah,
   lengkap dengan skor kecocokan dan alasannya.
3. **Tenant Management** — alur pendaftaran UMKM menjadi tenant suatu event,
   dari pengajuan hingga disetujui/ditolak oleh sekolah.
4. **Event Management & Analytics** — sekolah membuat dan mengelola event,
   meninjau pendaftar, serta melihat performa event setelah selesai.

---

## Tech Stack

### Backend
- **Laravel 13** (PHP 8.3)
- **Laravel Sanctum** — autentikasi berbasis token, dengan role `school` dan
  `umkm`
- **MySQL** sebagai database

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — token warna didefinisikan
  lewat `@theme` di `src/index.css`, bukan `tailwind.config.js`
- **React Router** untuk routing & proteksi halaman per role
- **Axios** untuk konsumsi API
- **lucide-react** untuk ikon

**Warna brand:** navy `#001F3F` dan oranye `#FEA232`.

---

## Struktur Proyek

Repo ini terdiri dari dua bagian terpisah:

```
venu-app/
├── backend/     # API Laravel
└── frontend/    # Aplikasi React (Vite)
```

### Struktur `backend/`
Mengikuti konvensi Laravel standar. Beberapa bagian penting:

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── Auth/              # Register, login, logout
│   │   │   ├── EventDiscoveryController.php
│   │   │   ├── School/            # Profile, Event, Application, Match, Analytics
│   │   │   └── Umkm/              # Profile, Application, Match
│   │   └── Requests/              # Validasi form per endpoint
│   └── Models/                    # User, School, UmkmProfile, Event,
│                                   # EventApplication, Booth
├── database/migrations/
└── routes/api.php
```

### Struktur `frontend/`
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Button, Card (reusable)
│   │   ├── layout/          # Navbar (per role), Footer, AuthLayout
│   │   ├── landing/         # Section-section landing page
│   │   ├── ai-match/        # Komponen hasil AI Match
│   │   └── event-management/
│   ├── pages/
│   │   ├── LandingPage.jsx, Login.jsx, Register.jsx
│   │   ├── school/          # SchoolHome, ManageEvents, AiMatchIntro
│   │   └── umkm/            # UmkmHome, AiMatchIntro
│   ├── features/            # Logic per domain (API call + custom hook),
│   │                         # mengikuti struktur controller backend
│   ├── context/             # AuthContext (state login)
│   ├── routes/              # AppRouter, ProtectedRoute
│   └── services/api.js      # Axios instance + interceptor token Sanctum
```

---

## Model Data (Backend)

| Tabel | Keterangan |
|---|---|
| `users` | Akun dengan `role`: `school` atau `umkm` |
| `schools` | Profil sekolah (nama, alamat, kontak) |
| `umkm_profiles` | Profil UMKM (nama usaha, kategori, lokasi, kisaran harga) |
| `events` | Event yang dibuat sekolah (kategori, tanggal, kapasitas booth, status) |
| `event_applications` | Pengajuan UMKM ke suatu event, beserta skor & alasan AI Match |
| `booths` | Slot booth per event, terhubung ke pengajuan yang disetujui |

---

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

**Auth**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` *(auth)*
- `GET /auth/me` *(auth)*

**Event Discovery** *(auth, semua role)*
- `GET /events`
- `GET /events/{slug}`

**Role: school**
- `GET/PUT /school/profile`
- `GET/POST/PUT/DELETE /school/events`, `POST /school/events/{event}/publish`
- `GET /school/events/{event}/applications`
- `PATCH /school/applications/{application}/approve`
- `PATCH /school/applications/{application}/reject`
- `GET /school/events/{event}/matches`
- `GET /school/events/{event}/analytics`

**Role: umkm**
- `GET/PUT /umkm/profile`
- `GET /umkm/applications`, `GET /umkm/applications/{application}`
- `POST /umkm/events/{event}/applications`
- `GET /umkm/matches`

---

## Menjalankan Secara Lokal

### 1. Backend
```bash
cd backend
composer install
cp .env.example .env
# Buka .env, set:
#   DB_CONNECTION=mysql
#   DB_DATABASE=venu_db (buat database ini dulu di MySQL)
#   DB_USERNAME, DB_PASSWORD sesuai environment kamu
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
Backend berjalan di `http://localhost:8000`.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# pastikan VITE_API_BASE_URL=http://localhost:8000/api/v1
npm run dev
```
Frontend berjalan di `http://localhost:5173`.

---

## Alur Autentikasi & Routing

- Landing page publik (`/`) menampilkan tombol **Masuk**/**Daftar**.
- Saat mendaftar, pengguna memilih peran (**Sekolah** atau **UMKM**) terlebih
  dahulu, lalu mengisi form yang berbeda sesuai peran tersebut.
- Setelah login, pengguna diarahkan ke dashboard sesuai role:
  - Sekolah → `/school`
  - UMKM → `/umkm`
- Halaman dashboard dilindungi lewat `ProtectedRoute` — pengguna yang belum
  login atau salah role akan di-redirect.

---



