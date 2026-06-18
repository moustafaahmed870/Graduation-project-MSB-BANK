// admin/admin-api.js
const ADMIN_API_URL = 'http://localhost:3000/api';
// جلب التوكن من localStorage
function getAdminToken() {
    return localStorage.getItem('adminToken');
}

// دالة عامة للطلبات
async function adminRequest(endpoint, options = {}) {
    const token = getAdminToken();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
    
    const data = await response.json();
    
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        window.location.href = 'login.html';
        throw new Error('Session expired');
    }
    
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    
    return data;
}

// ============= دوال المستخدمين =============
async function getAllUsers() {
    return adminRequest('/admin/users');
}

async function getPendingUsers() {
    return adminRequest('/admin/users/pending');
}

async function approveUser(userId) {
    return adminRequest(`/admin/users/${userId}/approve`, { method: 'PUT' });
}

async function rejectUser(userId) {
    return adminRequest(`/admin/users/${userId}/reject`, { method: 'PUT' });
}

async function suspendUser(userId) {
    return adminRequest(`/admin/users/${userId}/suspend`, { method: 'PUT' });
}

async function unsuspendUser(userId) {
    return adminRequest(`/admin/users/${userId}/unsuspend`, { method: 'PUT' });
}

async function deleteUser(userId) {
    return adminRequest(`/admin/users/${userId}`, { method: 'DELETE' });
}

// ============= دوال الإحصائيات =============
async function getSystemStats() {
    return adminRequest('/admin/stats');
}

async function getRecentActivities() {
    return adminRequest('/admin/activities');
}

// ============= دوال الإعدادات =============
async function getSystemSettings() {
    return adminRequest('/admin/settings');
}

async function updateSystemSettings(settings) {
    return adminRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
}

// ✅ تصدير الدوال
window.AdminAPI = {
    getAllUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getSystemStats,
    getRecentActivities,
    getSystemSettings,
    updateSystemSettings,
    getAdminToken
};