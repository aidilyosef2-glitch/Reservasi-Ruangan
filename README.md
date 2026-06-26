# 🏛️ Rancang Bangun Sistem Reservasi Gedung
## Politeknik Negeri Lampung (POLINELA)

> Sistem informasi berbasis web yang memudahkan sivitas akademika Politeknik Negeri Lampung untuk mengajukan, mengelola, dan memonitor reservasi gedung & ruangan secara *real-time*.

---

## 📋 Deskripsi Proyek

Proyek **Rancang Bangun Sistem Reservasi Gedung** ini dikembangkan sebagai solusi digital untuk menggantikan proses peminjaman gedung yang selama ini dilakukan secara manual. Sistem ini mengimplementasikan arsitektur **Full Stack JavaScript** dengan pemisahan yang jelas antara **Backend API** dan **Frontend Web**.

---

## 👤 Informasi Pengembang

| Atribut        | Keterangan                                |
|----------------|-------------------------------------------|
| **Nama**       | Aidil Yosef                               |
| **Institusi**  | Politeknik Negeri Lampung (POLINELA)      |
| **Program**    | Rancang Bangun Sistem Informasi           |
| **Tahun**      | 2026                                      |

---

## 🚀 Teknologi yang Digunakan

### Backend
| Teknologi       | Keterangan                          |
|-----------------|-------------------------------------|
| **Node.js**     | Runtime environment JavaScript      |
| **Express.js**  | Web framework untuk RESTful API     |
| **MySQL2**      | Database driver (async/await)       |
| **JWT**         | JSON Web Token untuk autentikasi    |
| **Bcrypt**      | Enkripsi password pengguna          |
| **CORS**        | Cross-Origin Resource Sharing       |

### Frontend
| Teknologi          | Keterangan                              |
|--------------------|-----------------------------------------|
| **HTML5**          | Struktur halaman semantik               |
| **Vanilla CSS**    | Styling premium dengan Glassmorphism    |
| **Vanilla JS**     | Logika interaksi & Fetch API            |
| **Font Awesome**   | Ikon antarmuka via CDN                  |
| **Google Fonts**   | Tipografi modern (Inter)                |

### Database
- **MySQL** (dijalankan melalui XAMPP)

---

## 🏗️ Struktur Folder Proyek

```
ReservasiRuanganFiks/
├── backend/
│   ├── config/
│   │   └── db.js                  # Koneksi pool MySQL
│   ├── controllers/
│   │   ├── authController.js      # Logika Login & Register
│   │   ├── gedungController.js    # Logika CRUD Gedung
│   │   ├── reservasiController.js # Logika Reservasi & Approval
│   │   └── dashboardController.js # Logika Statistik Dashboard
│   ├── middleware/
│   │   └── auth.js                # Middleware verifikasi JWT
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gedungRoutes.js
│   │   ├── reservasiRoutes.js
│   │   └── dashboardRoutes.js
│   ├── package.json
│   └── server.js                  # Entry point Express.js
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css          # Global stylesheet premium
│   │   ├── js/
│   │   │   └── app.js             # Helper fetch, auth, toast
│   │   └── images/
│   │       └── polinela_building.png
│   ├── admin/
│   │   ├── index.html             # Dashboard Admin
│   │   ├── kelola_reservasi.html  # Approval & Manajemen Reservasi
│   │   └── kelola_gedung.html     # Master Data Gedung (CRUD)
│   ├── pemohon/
│   │   ├── index.html             # Dashboard Pemohon
│   │   ├── buat_reservasi.html    # Form Pengajuan Reservasi
│   │   └── katalog_gedung.html    # Katalog & Info Gedung
│   ├── login.html                 # Halaman Login
│   └── register.html             # Halaman Registrasi
│
├── database.sql                   # Skema & data awal database
└── README.md                      # Dokumentasi ini
```

---

## 🗄️ Skema Database

Database bernama `reservasi_polinela` terdiri dari tabel-tabel berikut:

- **`users`**: Data pengguna (id, nama, nip_nim, email, password_hash, role, created_at)
- **`gedung`**: Data gedung/ruangan (id, kode_gedung, nama_gedung, lokasi, kapasitas, status_operasional)
- **`reservasi`**: Data pengajuan (id, kode_reservasi, user_id, gedung_id, jenis_kegiatan, jumlah_peserta, waktu_mulai, waktu_selesai, status, catatan_reviewer)

### Role Pengguna
| Role           | Hak Akses                                          |
|----------------|----------------------------------------------------|
| `superadmin`   | Akses penuh ke seluruh sistem                      |
| `admin_gedung` | Kelola gedung & approval reservasi                 |
| `pemohon`      | Mengajukan & memantau reservasi sendiri            |

---

## ⚙️ Cara Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) (v18+)
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL)

### Langkah 1 — Siapkan Database

1. Buka **XAMPP Control Panel**, nyalakan **MySQL**.
2. Buka browser dan masuk ke `http://localhost/phpmyadmin`.
3. Buat database baru bernama `reservasi_polinela`.
4. Pilih database tersebut, klik tab **Import**, lalu pilih file `database.sql` dari root proyek ini.
5. Klik **Go** untuk mengimpor.

### Langkah 2 — Install Dependensi Backend

```bash
cd backend
npm install
```

### Langkah 3 — Jalankan Server

Dari **root folder proyek** (`D:\ReservasiRuanganFiks`), jalankan:

```bash
node backend/server.js
```

Server berhasil menyala jika muncul pesan:
```
✅ Backend API Server running...
🌐 Buka Website Reservasi disini: http://localhost:5000/login.html
```

### Langkah 4 — Buka Aplikasi

Tahan tombol **Ctrl** dan klik link `http://localhost:5000/login.html` di terminal, atau buka langsung di browser.

---

## 🔐 Akun Default

| Role          | Email                     | Password   |
|---------------|---------------------------|------------|
| **Admin**     | `admin@polinela.ac.id`    | `admin123` |
| **Pemohon**   | Daftar sendiri via form Registrasi |  -  |

---

## 🌐 Daftar Endpoint API

| Method   | Endpoint                          | Akses       | Keterangan                        |
|----------|-----------------------------------|-------------|-----------------------------------|
| `POST`   | `/api/auth/login`                 | Public      | Login pengguna                    |
| `POST`   | `/api/auth/register`              | Public      | Registrasi pemohon baru           |
| `GET`    | `/api/auth/me`                    | Auth        | Ambil data pengguna aktif         |
| `GET`    | `/api/gedung`                     | Auth        | Ambil semua data gedung           |
| `POST`   | `/api/gedung`                     | Admin       | Tambah gedung baru                |
| `PUT`    | `/api/gedung/:id`                 | Admin       | Update data gedung                |
| `DELETE` | `/api/gedung/:id`                 | Admin       | Hapus gedung                      |
| `POST`   | `/api/reservasi/check-availability` | Auth      | Cek ketersediaan jadwal gedung    |
| `POST`   | `/api/reservasi/submit`           | Pemohon     | Ajukan reservasi baru             |
| `GET`    | `/api/reservasi`                  | Auth        | Ambil semua/milik sendiri reservasi |
| `PUT`    | `/api/reservasi/:id/status`       | Admin       | Approve / Reject reservasi        |
| `GET`    | `/api/dashboard/summary`          | Auth        | Statistik ringkasan dashboard     |

---

## ✨ Fitur Utama

### Portal Pemohon
- ✅ Registrasi & Login dengan JWT
- ✅ Dashboard statistik reservasi pribadi (Total, Pending, Disetujui, Ditolak)
- ✅ Katalog gedung dengan tampilan *card* bergambar
- ✅ Form reservasi dengan **cek ketersediaan jadwal real-time** sebelum submit

### Portal Admin
- ✅ Command Center dengan statistik global
- ✅ Antrean persetujuan reservasi dengan modal review
- ✅ Setujui atau Tolak reservasi disertai catatan
- ✅ CRUD lengkap data gedung (Tambah, Edit, Hapus)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **akademis** di lingkungan Politeknik Negeri Lampung.
