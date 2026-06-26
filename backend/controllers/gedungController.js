// backend/controllers/gedungController.js
const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM gedung ORDER BY nama_gedung ASC');
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM gedung WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Gedung tidak ditemukan' });
        res.status(200).json({ status: 'success', data: rows[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { kode_gedung, nama_gedung, lokasi, kapasitas, deskripsi, status_operasional } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO gedung (kode_gedung, nama_gedung, lokasi, kapasitas, deskripsi, status_operasional) VALUES (?, ?, ?, ?, ?, ?)',
            [kode_gedung, nama_gedung, lokasi, kapasitas, deskripsi || '', status_operasional || 'aktif']
        );
        
        res.status(201).json({ status: 'success', message: 'Gedung berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { kode_gedung, nama_gedung, lokasi, kapasitas, deskripsi, status_operasional } = req.body;
        
        await db.query(
            'UPDATE gedung SET kode_gedung = ?, nama_gedung = ?, lokasi = ?, kapasitas = ?, deskripsi = ?, status_operasional = ? WHERE id = ?',
            [kode_gedung, nama_gedung, lokasi, kapasitas, deskripsi, status_operasional, req.params.id]
        );
        
        res.status(200).json({ status: 'success', message: 'Gedung berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await db.query('DELETE FROM gedung WHERE id = ?', [req.params.id]);
        res.status(200).json({ status: 'success', message: 'Gedung berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
