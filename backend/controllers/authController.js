// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email dan password harus diisi.' });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Email tidak terdaftar.' });
        }

        const user = rows[0];

        if (user.status_aktif === 0) {
            return res.status(403).json({ status: 'error', message: 'Akun Anda tidak aktif.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordIsValid) {
            return res.status(401).json({ status: 'error', message: 'Password salah.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, nama: user.nama }, SECRET_KEY, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil.',
            data: {
                id: user.id,
                nama: user.nama,
                role: user.role,
                nip_nim: user.nip_nim,
                token: token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { nip_nim, nama, email, password } = req.body;
        
        if (!nip_nim || !nama || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Semua field harus diisi.' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR nip_nim = ?', [email, nip_nim]);
        
        if (existing.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email atau NIP/NIM sudah terdaftar.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        await db.query(
            'INSERT INTO users (nip_nim, nama, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [nip_nim, nama, email, passwordHash, 'pemohon']
        );

        res.status(201).json({ status: 'success', message: 'Registrasi berhasil, silakan login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.me = (req, res) => {
    // Because this route will be protected by verifyToken middleware, 
    // if it reaches here, the token is valid.
    res.status(200).json({
        status: 'success',
        data: {
            id: req.userId,
            role: req.userRole,
            nama: req.userName
        }
    });
};
