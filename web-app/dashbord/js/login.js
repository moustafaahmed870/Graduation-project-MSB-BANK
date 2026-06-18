// login-signup pages/dashbord/js/register.js
// نسخة معدلة بالكامل مع التحقق من العمر والرقم القومي

import { api } from './api.js';

console.log("✅ register.js loaded with API integration");

// ========== تعريف نظام التنبيهات المدمج ==========
function showCustomAlert(message, type = 'success', duration = 5000) {
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `custom-alert-message custom-alert-${type}`;
    
    let icon = 'info-circle';
    let iconColor = '#4fc3f7';
    if (type === 'success') { icon = 'check-circle'; iconColor = '#10b981'; }
    else if (type === 'error') { icon = 'exclamation-circle'; iconColor = '#ef4444'; }
    else if (type === 'warning') { icon = 'exclamation-triangle'; iconColor = '#f59e0b'; }
    
    alert.innerHTML = `
        <div class="custom-alert-content">
            <div class="custom-alert-icon" style="color: ${iconColor};">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="custom-alert-text">${message}</div>
            <button class="custom-alert-close" onclick="this.closest('.custom-alert-message').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(10, 36, 56, 0.98) 0%, rgba(8, 27, 41, 0.99) 100%);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(79, 195, 247, 0.2);
        padding: 0;
        z-index: 10000;
        animation: customAlertSlideDown 0.3s ease;
        min-width: 300px;
        max-width: 500px;
        border-right: 4px solid ${iconColor};
        font-family: 'Montserrat', 'Cairo', sans-serif;
    `;
    
    const contentDiv = alert.querySelector('.custom-alert-content');
    contentDiv.style.cssText = `display: flex; align-items: center; gap: 15px; padding: 15px 20px;`;
    
    const iconDiv = alert.querySelector('.custom-alert-icon');
    iconDiv.style.cssText = `font-size: 22px; display: flex; align-items: center; justify-content: center;`;
    
    const textDiv = alert.querySelector('.custom-alert-text');
    textDiv.style.cssText = `flex: 1; font-weight: 500; color: #a0d2db; font-size: 14px; line-height: 1.5;`;
    
    const closeBtn = alert.querySelector('.custom-alert-close');
    closeBtn.style.cssText = `background: none; border: none; color: #a0d2db; cursor: pointer; font-size: 16px; padding: 5px; transition: all 0.3s ease; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;`;
    
    closeBtn.onmouseover = () => { closeBtn.style.backgroundColor = 'rgba(79, 195, 247, 0.1)'; closeBtn.style.color = '#4fc3f7'; };
    closeBtn.onmouseout = () => { closeBtn.style.backgroundColor = 'transparent'; closeBtn.style.color = '#a0d2db'; };
    
    document.body.appendChild(alert);
    
    if (duration > 0) {
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, duration);
    }
}

// إضافة أنماط CSS للتنبيهات إذا لم تكن موجودة
if (!document.querySelector('#customAlertStyles')) {
    const style = document.createElement('style');
    style.id = 'customAlertStyles';
    style.textContent = `
        @keyframes customAlertSlideDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes customAlertFadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
        .custom-alert-message.fade-out {
            animation: customAlertFadeOut 0.3s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// ============ دالة حساب العمر من تاريخ الميلاد ==========
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// ============ تبديل بين Login و Sign Up ==========
const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
    });
}

// ============ تسجيل الدخول (Login) ==========
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const inputs = loginForm.querySelectorAll('input');
        const emailOrUsername = inputs[0]?.value.trim();
        const password = inputs[1]?.value.trim();
        
        console.log('📤 Login attempt:', { emailOrUsername, password });
        
        if (!emailOrUsername || !password) {
            showCustomAlert("⚠️ الرجاء إدخال البريد الإلكتروني وكلمة المرور", 'warning');
            return;
        }
        
        let email = emailOrUsername;
        if (!email.includes('@')) {
            email =  + '';
            console.log('ℹ️ Converted username to email:', email);
        }
        
        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = "⏳ جاري تسجيل الدخول...";
        btn.disabled = true;
        
        try {
            // First, get user data to check if 2FA is enabled
            // We'll do a pre-check by trying to login with credentials
            const loginResult = await api.login(email, password);
            console.log('✅ Login response:', loginResult);
            
            if (loginResult.requiresTwoFactor) {
                // Store credentials temporarily for 2FA flow
                localStorage.setItem('pendingLoginEmail', email);
                localStorage.setItem('pendingLoginPassword', password);
                
                // Send OTP to email
                showCustomAlert("📧 جاري إرسال رمز التحقق إلى بريدك الإلكتروني...", 'success');
                
                const otpResponse = await fetch('http://localhost:3000/api/auth/send-login-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                const otpData = await otpResponse.json();
                
                if (otpResponse.ok) {
                    showCustomAlert("✅ تم إرسال رمز التحقق. جاري تحويلك...", 'success');
                    setTimeout(() => {
                        window.location.href = 'login-otp.html';
                    }, 1500);
                } else {
                    showCustomAlert(otpData.message || "فشل إرسال رمز التحقق", 'error');
                }
                return;
            }
            
            if (loginResult.token) {
                localStorage.setItem('token', loginResult.token);
                localStorage.setItem('user', JSON.stringify({
                    uid: loginResult.user.uid,
                    fullName: loginResult.user.fullName,
                    email: loginResult.user.email,
                    accountType: loginResult.user.accountType
                }));
                localStorage.setItem('userName', loginResult.user.fullName);
                
                showCustomAlert(`✅ مرحباً ${loginResult.user?.fullName || ''}! تم تسجيل الدخول بنجاح`, 'success');
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                showCustomAlert("❌ " + (loginResult.message || "فشل تسجيل الدخول"), 'error');
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            let errorMsg = "فشل تسجيل الدخول";
            
            if (error.message.includes('404')) {
                errorMsg = "❌ المستخدم غير موجود. يرجى التحقق من البريد الإلكتروني.";
            } else if (error.message.includes('401')) {
                errorMsg = "❌ كلمة المرور غير صحيحة.";
            } else if (error.message.includes('Failed to fetch')) {
                errorMsg = "❌ لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي على المنفذ 3000!";
            } else {
                errorMsg = "❌ " + error.message;
            }
            
            showCustomAlert(errorMsg, 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// ============ ✅ التسجيل (Sign Up) - مع كل التحققات ==========
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const inputs = signupForm.querySelectorAll('input');
        const username = inputs[0]?.value.trim();
        const nationalId = inputs[1]?.value.trim();
        const dateOfBirth = inputs[2]?.value.trim();
        
        // ========== ✅ التحقق من اسم المستخدم ==========
        if (!username || username.length < 3) {
            showCustomAlert("❌ اسم المستخدم يجب أن يكون 3 أحرف على الأقل!", 'error');
            return;
        }
        
        // ========== ✅ التحقق من الرقم القومي (14 رقم بالضبط) ==========
        if (!nationalId || nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
            showCustomAlert("❌ الرقم القومي يجب أن يكون 14 رقم بالضبط (أرقام فقط)!", 'error');
            return;
        }
        
        // ========== ✅ التحقق من العمر (لا يقل عن 18 سنة) ==========
        if (!dateOfBirth) {
            showCustomAlert("❌ الرجاء إدخال تاريخ الميلاد!", 'error');
            return;
        }
        
        const age = calculateAge(dateOfBirth);
        if (age < 18) {
            showCustomAlert(`❌ عمرك ${age} سنة. يجب أن يكون عمرك 18 سنة على الأقل لفتح حساب بنكي!`, 'error');
            return;
        }
        
        // ========== ✅ تحقق إضافي: التأكد أن تاريخ الميلاد ليس في المستقبل ==========
        const today = new Date();
        const birthDateObj = new Date(dateOfBirth);
        if (birthDateObj > today) {
            showCustomAlert("❌ تاريخ الميلاد لا يمكن أن يكون في المستقبل!", 'error');
            return;
        }
        
        // ========== ✅ تحقق إضافي: التأكد أن العمر ليس أكثر من 100 سنة ==========
        if (age > 100) {
            showCustomAlert(`❌ عمرك ${age} سنة. يرجى التحقق من تاريخ الميلاد المدخل.`, 'warning');
            return;
        }
        
        // حفظ البيانات المؤقتة
        localStorage.setItem('tempSignup', JSON.stringify({
            username,
            nationalId,
            dateOfBirth,
            email:  ''
        }));
        
        console.log('📤 Redirecting to form.html with:', { username, nationalId, dateOfBirth });
        
        // ✅ عرض رسالة نجاح قبل الانتقال
        showCustomAlert(`✅ مرحباً ${username}! تم التحقق من بياناتك. جاري نقلك لإكمال التسجيل...`, 'success');
        
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 1500);
    });
}

// ============ تحسينات بصرية فورية أثناء الكتابة ==========

// ✅ التحقق من الرقم القومي أثناء الكتابة
const nationalIdInput = document.getElementById("signupNationalId");
if (nationalIdInput) {
    nationalIdInput.addEventListener("input", function() {
        let id = this.value.replace(/[^0-9]/g, '');
        if (id.length > 14) id = id.slice(0, 14);
        this.value = id;
        
        // تغيير لون边框 حسب حالة الإدخال
        if (id.length === 14) {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 5px #10b981';
        } else if (id.length > 0) {
            this.style.borderColor = '#f59e0b';
            this.style.boxShadow = '0 0 5px #f59e0b';
        } else {
            this.style.borderColor = 'rgba(225,225,225,0.3)';
            this.style.boxShadow = 'none';
        }
    });
    
    nationalIdInput.addEventListener("blur", function() {
        const id = this.value;
        if (id.length > 0 && id.length !== 14) {
            showCustomAlert("⚠️ الرقم القومي يجب أن يكون 14 رقم بالضبط!", 'warning', 3000);
            this.style.borderColor = '#ef4444';
        }
    });
}

// ✅ التحقق من العمر عند تغيير تاريخ الميلاد
const birthDateInput = document.getElementById("signupDob");
if (birthDateInput) {
    // تعيين الحد الأقصى لتاريخ الميلاد (18 سنة مضت)
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    birthDateInput.max = minDate.toISOString().split('T')[0];
    birthDateInput.min = maxDate.toISOString().split('T')[0];
    
    birthDateInput.addEventListener("change", function() {
        if (this.value) {
            const age = calculateAge(this.value);
            
            // إزالة أي تحذير سابق
            const existingWarning = document.getElementById('ageWarningSignup');
            if (existingWarning) existingWarning.remove();
            
            if (age < 18) {
                const warning = document.createElement('small');
                warning.id = "ageWarningSignup";
                warning.style.cssText = "color: #f59e0b; display: block; margin-top: 5px; font-size: 12px;";
                warning.innerHTML = `⚠️ عمرك ${age} سنة. يجب أن تكون 18 سنة على الأقل لفتح حساب.`;
                this.parentElement.appendChild(warning);
                this.style.borderColor = '#f59e0b';
            } else if (age >= 18 && age <= 100) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 5px #10b981';
            } else if (age > 100) {
                const warning = document.createElement('small');
                warning.id = "ageWarningSignup";
                warning.style.cssText = "color: #ef4444; display: block; margin-top: 5px; font-size: 12px;";
                warning.innerHTML = `⚠️ عمرك ${age} سنة. يرجى التحقق من تاريخ الميلاد.`;
                this.parentElement.appendChild(warning);
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = 'rgba(225,225,225,0.3)';
            }
        }
    });
}

// ✅ التحقق من اسم المستخدم أثناء الكتابة
const usernameInput = document.getElementById("signupUsername");
if (usernameInput) {
    usernameInput.addEventListener("input", function() {
        const name = this.value.trim();
        if (name.length >= 3) {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 5px #10b981';
        } else if (name.length > 0) {
            this.style.borderColor = '#f59e0b';
            this.style.boxShadow = '0 0 5px #f59e0b';
        } else {
            this.style.borderColor = 'rgba(225,225,225,0.3)';
            this.style.boxShadow = 'none';
        }
    });
}

// ============ تحقق إذا كان في بيانات مؤقتة من signup ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Register page loaded');
    
    // التحقق من وجود بيانات محفوظة
    const tempData = localStorage.getItem('tempSignup');
    if (tempData) {
        const data = JSON.parse(tempData);
        if (usernameInput && data.username) {
            usernameInput.value = data.username;
        }
        if (nationalIdInput && data.nationalId) {
            nationalIdInput.value = data.nationalId;
        }
        if (birthDateInput && data.dateOfBirth) {
            birthDateInput.value = data.dateOfBirth;
            // التحقق من العمر فوراً
            const age = calculateAge(data.dateOfBirth);
            if (age < 18) {
                showCustomAlert(`⚠️ ملاحظة: عمرك ${age} سنة. يجب أن تكون 18 سنة على الأقل لفتح حساب.`, 'warning', 5000);
            }
        }
        console.log('✅ Pre-filled form with saved data');
    }
});

// ============ دالة تسجيل الخروج (متاحة عالمياً) ==========
window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('tempSignup');
    localStorage.removeItem('pendingLoginEmail');
    localStorage.removeItem('pendingLoginPassword');
    window.location.href = 'login.html';
};

// ============ Login with Biometrics ==========
window.biometricLogin = async function() {
    const email = localStorage.getItem('biometricPendingEmail');
    
    if (!email) {
        showCustomAlert('يرجى إدخال بريدك الإلكتروني أولاً لاستخدام biometrics', 'warning');
        return;
    }
    
    if (!navigator.credentials) {
        showCustomAlert('المتصفح لا يدعم المصادقة biometrics', 'error');
        return;
    }
    
    try {
        showCustomAlert('جاري التحقق من biometrics...', 'success');
        
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                timeout: 60000,
                rp: { name: "MSB Bank" },
                userVerification: "preferred"
            }
        });
        
        if (credential) {
            const response = await fetch('http://localhost:3000/api/auth/biometric-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    credentialId: credential.id 
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('userName', data.user.fullName);
                
                showCustomAlert(`✅ مرحباً ${data.user.fullName}! تم تسجيل الدخول بنجاح`, 'success');
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                showCustomAlert(data.message || 'فشل تسجيل الدخول biometrics', 'error');
            }
        }
    } catch (error) {
        console.error('Biometric login error:', error);
        
        if (error.name === 'NotAllowedError') {
            showCustomAlert('تم إلغاء عملية المصادقة', 'warning');
        } else {
            showCustomAlert('فشل تسجيل الدخول biometrics. يرجى المحاولة مرة أخرى.', 'error');
        }
    }
};

// Store email for biometric login when user types
document.addEventListener('DOMContentLoaded', function() {
    const loginEmailInput = document.getElementById('loginEmail');
    if (loginEmailInput) {
        loginEmailInput.addEventListener('change', function() {
            localStorage.setItem('biometricPendingEmail', this.value.trim());
        });
    }
});