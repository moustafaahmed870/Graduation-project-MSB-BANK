// admin/admin-auth.js
const API_URL = 'http://localhost:3000/api';

async function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminEmail');
            window.location.href = 'login.html';
            return false;
        }
        
        const data = await response.json();
        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'login.html';
        return false;
    }
}

function adminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '../login.html';
}

// تنفيذ التحقق
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminAuth);
} else {
    checkAdminAuth();
}