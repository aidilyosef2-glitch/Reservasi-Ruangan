-- Skema Database Sistem Reservasi Gedung
-- Nama Database: reservasi_polinela (silakan buat database ini terlebih dahulu di MySQL/MariaDB)

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nip_nim` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','admin_gedung','pemohon') NOT NULL DEFAULT 'pemohon',
  `status_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip_nim` (`nip_nim`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `gedung` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_gedung` varchar(20) NOT NULL,
  `nama_gedung` varchar(100) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `kapasitas` int(11) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `status_operasional` enum('aktif','maintenance','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_gedung` (`kode_gedung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `fasilitas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedung_id` int(11) NOT NULL,
  `nama_fasilitas` varchar(100) NOT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 1,
  `kondisi` enum('baik','rusak_ringan','rusak_berat') NOT NULL DEFAULT 'baik',
  PRIMARY KEY (`id`),
  KEY `gedung_id` (`gedung_id`),
  CONSTRAINT `fasilitas_ibfk_1` FOREIGN KEY (`gedung_id`) REFERENCES `gedung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `galeri_gedung` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedung_id` int(11) NOT NULL,
  `url_gambar` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `gedung_id` (`gedung_id`),
  CONSTRAINT `galeri_gedung_ibfk_1` FOREIGN KEY (`gedung_id`) REFERENCES `gedung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reservasi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_reservasi` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gedung_id` int(11) NOT NULL,
  `jenis_kegiatan` varchar(255) NOT NULL,
  `jumlah_peserta` int(11) NOT NULL,
  `waktu_mulai` datetime NOT NULL,
  `waktu_selesai` datetime NOT NULL,
  `surat_pengantar` varchar(255) DEFAULT NULL,
  `status` enum('draft','pending','approved','rejected','cancelled','completed') NOT NULL DEFAULT 'pending',
  `catatan_reviewer` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_reservasi` (`kode_reservasi`),
  KEY `user_id` (`user_id`),
  KEY `gedung_id` (`gedung_id`),
  CONSTRAINT `reservasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservasi_ibfk_2` FOREIGN KEY (`gedung_id`) REFERENCES `gedung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notifikasi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `judul` varchar(100) NOT NULL,
  `pesan` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifikasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Data Dummy Default Superadmin (Password: admin123)
-- Password hash menggunakan BCRYPT (default PHP password_hash)
INSERT INTO `users` (`nip_nim`, `nama`, `email`, `password_hash`, `role`) VALUES
('ADMIN001', 'Administrator Utama', 'admin@polinela.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin');
