// backend/controllers/dashboardController.js
const db = require('../config/db');

exports.getSummary = async (req, res) => {
    try {
        const is_admin = (req.userRole === 'superadmin' || req.userRole === 'admin_gedung');
        
        let summary = {
            total_reservasi: 0,
            reservasi_pending: 0,
            reservasi_approved: 0,
            reservasi_rejected: 0,
            total_gedung: 0
        };

        if (is_admin) {
            const [[{total: tRes}]] = await db.query('SELECT COUNT(id) as total FROM reservasi');
            const [[{total: tPen}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE status="pending"');
            const [[{total: tApp}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE status="approved"');
            const [[{total: tRej}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE status="rejected"');
            const [[{total: tGed}]] = await db.query('SELECT COUNT(id) as total FROM gedung');
            
            summary = {
                total_reservasi: tRes,
                reservasi_pending: tPen,
                reservasi_approved: tApp,
                reservasi_rejected: tRej,
                total_gedung: tGed
            };
        } else {
            const [[{total: tRes}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE user_id = ?', [req.userId]);
            const [[{total: tPen}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE user_id = ? AND status="pending"', [req.userId]);
            const [[{total: tApp}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE user_id = ? AND status="approved"', [req.userId]);
            const [[{total: tRej}]] = await db.query('SELECT COUNT(id) as total FROM reservasi WHERE user_id = ? AND status="rejected"', [req.userId]);
            const [[{total: tGed}]] = await db.query('SELECT COUNT(id) as total FROM gedung WHERE status_operasional="aktif"');
            
            summary = {
                total_reservasi: tRes,
                reservasi_pending: tPen,
                reservasi_approved: tApp,
                reservasi_rejected: tRej,
                total_gedung: tGed
            };
        }
        
        res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
