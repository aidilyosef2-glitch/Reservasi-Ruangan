// backend/controllers/laporanController.js
const db = require('../config/db');

// Statistik bulanan reservasi (6 bulan terakhir)
exports.getMonthlyStats = async (req, res) => {
    try {
        const is_admin = (req.userRole === 'superadmin' || req.userRole === 'admin_gedung');
        
        let query = `
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as bulan,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
            FROM reservasi
        `;
        
        const params = [];
        
        if (!is_admin) {
            query += ' WHERE user_id = ?';
            params.push(req.userId);
        }
        
        query += ` GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                   ORDER BY bulan DESC
                   LIMIT 6`;
        
        const [rows] = await db.query(query, params);
        
        // Reverse agar urutan chronological (lama -> baru)
        res.status(200).json({ status: 'success', data: rows.reverse() });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Statistik penggunaan per gedung
exports.getBuildingUsage = async (req, res) => {
    try {
        const is_admin = (req.userRole === 'superadmin' || req.userRole === 'admin_gedung');
        
        let query = `
            SELECT 
                g.nama_gedung,
                COUNT(r.id) as total_reservasi,
                SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM gedung g
            LEFT JOIN reservasi r ON g.id = r.gedung_id
        `;
        
        const params = [];
        
        if (!is_admin) {
            query += ' AND r.user_id = ?';
            params.push(req.userId);
        }
        
        query += ` GROUP BY g.id, g.nama_gedung
                   ORDER BY total_reservasi DESC
                   LIMIT 10`;
        
        const [rows] = await db.query(query, params);
        
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Distribusi status reservasi
exports.getStatusDistribution = async (req, res) => {
    try {
        const is_admin = (req.userRole === 'superadmin' || req.userRole === 'admin_gedung');
        
        let query = `
            SELECT 
                status,
                COUNT(*) as jumlah
            FROM reservasi
        `;
        
        const params = [];
        
        if (!is_admin) {
            query += ' WHERE user_id = ?';
            params.push(req.userId);
        }
        
        query += ' GROUP BY status';
        
        const [rows] = await db.query(query, params);
        
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Rekap detail (tabel) — dengan filter bulan opsional
exports.getRekapDetail = async (req, res) => {
    try {
        const is_admin = (req.userRole === 'superadmin' || req.userRole === 'admin_gedung');
        const { bulan } = req.query; // format: YYYY-MM
        
        let query = `
            SELECT 
                r.kode_reservasi,
                u.nama as nama_pemohon,
                g.nama_gedung,
                r.jenis_kegiatan,
                r.jumlah_peserta,
                r.waktu_mulai,
                r.waktu_selesai,
                r.status,
                r.created_at
            FROM reservasi r
            JOIN users u ON r.user_id = u.id
            JOIN gedung g ON r.gedung_id = g.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (!is_admin) {
            query += ' AND r.user_id = ?';
            params.push(req.userId);
        }
        
        if (bulan) {
            query += ` AND DATE_FORMAT(r.created_at, '%Y-%m') = ?`;
            params.push(bulan);
        }
        
        query += ' ORDER BY r.created_at DESC';
        
        const [rows] = await db.query(query, params);
        
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
