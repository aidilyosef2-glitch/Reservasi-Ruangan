// frontend/assets/js/app.js

const API_BASE_URL = 'reservasi-ruangan-production.up.railway.app';

// Utility for fetching data with JWT
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: 'Koneksi ke server gagal. Pastikan server Node.js berjalan.' };
    }
}

// Check session
async function checkAuth() {
    const res = await apiFetch('/auth/me');
    if (res.status !== 'success') {
        localStorage.removeItem('token');
        window.location.href = '../login.html';
        return null;
    }
    return res.data;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login.html';
}

// UI Utilities
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `glass-card animate-fade-in`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.padding = '1rem 2rem';
    toast.style.borderLeft = `4px solid ${type === 'success' ? 'var(--success)' : 'var(--danger)'}`;
    
    toast.innerHTML = `<p style="margin:0;font-weight:500">${message}</p>`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
