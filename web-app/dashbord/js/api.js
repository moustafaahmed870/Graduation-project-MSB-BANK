// js/api.js - API Module for backend communication

const API_URL = 'http://localhost:3000/api';

const api = {
    // تسجيل مستخدم جديد
register: async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    } catch (error) {
        console.error('❌ Register error:', error);
        throw error;
    }
},
    
    // تسجيل الدخول
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            return data;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },

    // ✅ إرسال OTP لنسيان كلمة المرور
    sendOTP: async (email) => {
        try {
            console.log('📤 Sending OTP to:', email);
            const response = await fetch(`${API_URL}/forgot/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
            return data;
        } catch (error) {
            console.error('❌ Send OTP error:', error);
            throw error;
        }
    },

    // ✅ التحقق من OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await fetch(`${API_URL}/forgot/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'OTP verification failed');
            return data;
        } catch (error) {
            console.error('❌ Verify OTP error:', error);
            throw error;
        }
    },

    // ✅ إعادة تعيين كلمة المرور
    resetPassword: async (email, newPassword, confirmPassword) => {
        try {
            const response = await fetch(`${API_URL}/forgot/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, confirmPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Password reset failed');
            return data;
        } catch (error) {
            console.error('❌ Reset password error:', error);
            throw error;
        }
    },
    
    // دالة مساعدة لإضافة التوكن
    getHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
};

// Make it available globally
window.api = api;

export { api, API_URL };