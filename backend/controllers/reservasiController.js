// backend/controllers/reservasiController.js
const db = require('../config/db');

exports.checkAvailability = async (req, res) => {
    try {
        const { gedung_id, waktu_mulai, waktu_selesai } = req.body;
        
        if (!gedung_id || !waktu_mulai || !waktu_selesai) {
            return res.status(400).json({ status: 'error', message: 'Parameter gedung_id, waktu_mulai, dan waktu_selesai dibutuhkan.' });
        }

        const query = `
            SELECT id FROM reservasi 
            WHERE gedung_id = ? 
            AND status IN ('pending', 'approved')
            AND (
                (waktu_mulai < ? AND waktu_selesai > ?)
            )
        `;
        
        const [rows] = await db.query(query, [gedung_id, waktu_selesai, waktu_mulai]);
        
        if (rows.length > 0) {
            res.status(200).json({ status: 'success', available: false, message: 'Jadwal sudah terbooking pada rentang waktu tersebut.' });
        } else {
            res.status(200).json({ status: 'success', available: true, message: 'Jadwal tersedia.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.submit = async (req, res) => {
    try {
        const { gedung_id, jenis_kegiatan, jumlah_peserta, waktu_mulai, waktu_selesai } = req.body;
        
        if (!gedung_id || !jenis_kegiatan || !waktu_mulai || !waktu_selesai) {
            return res.status(400).json({ status: 'error', message: 'Data wajib harus diisi.' });
        }

        // Double check
        const checkQuery = `
            SELECT id FROM reservasi 
            WHERE gedung_id = ? 
            AND status IN ('pending', 'approved')
            AND ((waktu_mulai < ? AND waktu_selesai > ?))
        `;
        const [existing] = await db.query(checkQuery, [gedung_id, waktu_selesai, waktu_mulai]);
        
        if (existing.length > 0) {
            return res.status(409).json({ status: 'error', message: 'Jadwal sudah keduluan di-booking oleh pemohon lain.' });
        }

        const kode_reservasi = `RSV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        await db.query(
            'INSERT INTO reservasi (kode_reservasi, user_id, gedung_id, jenis_kegiatan, jumlah_peserta, waktu_mulai, waktu_selesai, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [kode_reservasi, req.userId, gedung_id, jenis_kegiatan, jumlah_peserta, waktu_mulai, waktu_selesai, 'pending']
        );
        
        res.status(201).json({ status: 'success', message: 'Reservasi berhasil diajukan dan sedang menunggu persetujuan.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        let query = `
            SELECT r.*, g.nama_gedung, u.nama as nama_pemohon 
            FROM reservasi r
            JOIN gedung g ON r.gedung_id = g.id
            JOIN users u ON r.user_id = u.id
        `;
        
        const params = [];
        
        // If not admin, only show their own reservations
        if (req.userRole !== 'superadmin' && req.userRole !== 'admin_gedung') {
            query += ' WHERE r.user_id = ?';
            params.push(req.userId);
        }
        
        query += ' ORDER BY r.created_at DESC';
        
        const [rows] = await db.query(query, params);
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.approveReject = async (req, res) => {
    try {
        const { status, catatan } = req.body;
        const reservasiId = req.params.id;
        
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Status tidak valid.' });
        }
        
        await db.query(
            'UPDATE reservasi SET status = ?, catatan_reviewer = ? WHERE id = ?',
            [status, catatan || '', reservasiId]
        );
        
        res.status(200).json({ status: 'success', message: 'Status reservasi berhasil diupdate.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
