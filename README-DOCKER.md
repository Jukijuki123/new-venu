# Panduan Deployment Docker VENU (Fullstack Laravel + React)

Setup Docker ini menggabungkan **Frontend (React 19 + Vite)** dan **Backend (Laravel 12/13 + PHP 8.3)** serta **Database (MySQL 8.0)** ke dalam satu arsitektur **Docker Compose** yang terisolasi dan siap untuk di-hosting di VPS / Cloud Server.

---

## 🚀 Cara Menjalankan Docker

### 1. Salin File Konfigurasi Environment (Opsional)
Jika ingin mengubah port atau kredensial database:
```bash
cp .env.docker.example .env
```

### 2. Build & Jalankan Seluruh Service
Jalankan perintah berikut di root directory project:
```bash
docker compose up -d --build
```
> **Catatan:** Backend entrypoint otomatis menjalankan migrasi database dengan aman (`php artisan migrate --force`) tanpa mereset data yang sudah ada.

### 3. Akses Aplikasi
- **Web App / Frontend:** Buka browser di `http://localhost` (atau `http://IP_SERVER_KAMU` jika di VPS).
- **Backend API:** Otomatis diproxy melalui endpoint `http://localhost/api/v1/...`.

---

## 📦 Menjalankan Database Seeder (Hanya Jika Dibutuhkan)
Jika kamu mendeploy di server baru dan ingin mengisi data awal seeder:
```bash
docker compose exec backend php artisan db:seed --force
```

---

## 🛠️ Perintah Berguna (Cheatsheet)

| Perintah | Deskripsi |
|---|---|
| `docker compose ps` | Cek status container yang sedang berjalan |
| `docker compose logs -f` | Cek live log semua container |
| `docker compose logs -f backend` | Cek log backend Laravel |
| `docker compose logs -f frontend` | Cek log Nginx frontend |
| `docker compose exec backend sh` | Masuk ke terminal container backend |
| `docker compose exec backend php artisan <cmd>` | Menjalankan perintah artisan Laravel |
| `docker compose restart` | Restart seluruh service |
| `docker compose down` | Menghentikan container (data DB & storage tetap aman di volume) |

---

## 🏗️ Struktur Arsitektur Docker

```text
[ Browser / Klien ]
        │
        ▼ (Port 80)
┌──────────────────────────────────────────────┐
│  Service: frontend (Nginx Alpine)            │
│  ├── Melayani React Static Build (SPA)       │
│  └── Reverse Proxy:                          │
│       ├── /api/*     ──► backend:8000/api/*  │
│       └── /storage/* ──► backend:8000/storage│
└───────────────────────┬──────────────────────┘
                        │ (Internal Docker Network)
                        ▼
┌──────────────────────────────────────────────┐
│  Service: backend (PHP 8.3 FPM + Nginx)      │
│  ├── Laravel REST API                        │
│  └── Volume Storage Uploads                  │
└───────────────────────┬──────────────────────┘
                        │
                        ▼ (Port 3306)
┌──────────────────────────────────────────────┐
│  Service: database (MySQL 8.0)               │
│  └── Persistent Volume: venu_db_data         │
└──────────────────────────────────────────────┘
```
