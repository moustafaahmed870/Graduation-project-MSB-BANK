// login-signup pages/dashbord/js/form.js
// نسخة معدلة بالكامل مع رفع صور البطاقة

import { api } from './api.js';

console.log("✅ form.js loaded with API integration");

// ========== متغيرات تخزين الصور ==========
let frontImageBase64 = null;
let backImageBase64 = null;

// ========== تعريف نظام التنبيهات ==========
function showCustomAlert(message, type = 'success', duration = 5000) {
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
        background: linear-gradient(135deg, rgba(17, 63, 98, 0.98) 0%, rgba(17, 69, 106, 0.99) 100%);
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
    
    document.body.appendChild(alert);
    
    if (duration > 0) {
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
        }, duration);
    }
}

// ========== دالة تحويل الصورة إلى Base64 ==========
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// ========== دالة التحقق من حجم ونوع الصورة ==========
function validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showCustomAlert("❌ نوع المغير غير مسموح! يرجى رفع صور من نوع JPG, PNG فقط", 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showCustomAlert("❌ حجم الصورة كبير جداً! الحد الأقصى 5 ميجابايت", 'error');
        return false;
    }
    
    return true;
}

// ========== دالة عرض معاينة الصورة ==========
function createImagePreview(file, containerId, imageType) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // مسح المعاينات السابقة
        container.innerHTML = '';
        
        // إنشاء عنصر المعاينة
        const previewDiv = document.createElement('div');
        previewDiv.className = 'image-preview';
        previewDiv.innerHTML = `
            <img src="${e.target.result}" alt="صورة ${imageType}">
            <div class="remove-image" onclick="removeImage('${imageType}')">
                <i class="fas fa-times"></i>
            </div>
            <div class="label">${imageType === 'front' ? 'الوجه الأمامي' : 'الوجه الخلفي'}</div>
        `;
        container.appendChild(previewDiv);
        
        // تغيير لون منطقة الرفع
        const uploadArea = document.getElementById(imageType === 'front' ? 'uploadFrontArea' : 'uploadBackArea');
        if (uploadArea) {
            uploadArea.style.borderColor = '#10b981';
            uploadArea.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        
        // تحديث الحالة
        const statusDiv = document.getElementById(imageType === 'front' ? 'frontStatus' : 'backStatus');
        if (statusDiv) {
            statusDiv.innerHTML = '✓ تم رفع الصورة بنجاح';
            statusDiv.style.color = '#10b981';
        }
    };
    reader.readAsDataURL(file);
    
    // حفظ الصورة كـ Base64
    imageToBase64(file).then(base64 => {
        if (imageType === 'front') {
            frontImageBase64 = base64;
        } else {
            backImageBase64 = base64;
        }
        console.log(`✅ ${imageType} image converted to Base64`);
    });
}

// ========== دالة إزالة الصورة ==========
window.removeImage = function(imageType) {
    const container = document.getElementById(imageType === 'front' ? 'frontPreview' : 'backPreview');
    const uploadArea = document.getElementById(imageType === 'front' ? 'uploadFrontArea' : 'uploadBackArea');
    const statusDiv = document.getElementById(imageType === 'front' ? 'frontStatus' : 'backStatus');
    const fileInput = document.getElementById(imageType === 'front' ? 'frontImage' : 'backImage');
    
    if (container) container.innerHTML = '';
    if (uploadArea) {
        uploadArea.style.borderColor = 'rgba(79, 195, 247, 0.3)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
    }
    if (statusDiv) {
        statusDiv.innerHTML = '';
        statusDiv.style.color = '#10b981';
    }
    if (fileInput) fileInput.value = '';
    
    if (imageType === 'front') {
        frontImageBase64 = null;
    } else {
        backImageBase64 = null;
    }
    
    showCustomAlert(`✅ تم إزالة صورة ${imageType === 'front' ? 'الوجه الأمامي' : 'الوجه الخلفي'}`, 'info', 2000);
};

// ========== إعداد رفع الصور ==========
function setupImageUpload() {
    // صورة الوجه الأمامي
    const frontUploadArea = document.getElementById('uploadFrontArea');
    const frontInput = document.getElementById('frontImage');
    
    if (frontUploadArea && frontInput) {
        frontUploadArea.addEventListener('click', () => frontInput.click());
        frontInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (validateImage(file)) {
                    createImagePreview(file, 'frontPreview', 'front');
                } else {
                    frontInput.value = '';
                }
            }
        });
    }
    
    // صورة الظهر الخلفي
    const backUploadArea = document.getElementById('uploadBackArea');
    const backInput = document.getElementById('backImage');
    
    if (backUploadArea && backInput) {
        backUploadArea.addEventListener('click', () => backInput.click());
        backInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (validateImage(file)) {
                    createImagePreview(file, 'backPreview', 'back');
                } else {
                    backInput.value = '';
                }
            }
        });
    }
}

// ============ دالة حساب العمر ==========
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

// ============ دالة التحقق من رقم الهاتف ==========
function validateEgyptianPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return {
        isValid: phoneRegex.test(cleanPhone),
        formatted: cleanPhone
    };
}

// ============ Password Strength ============
const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("passStrength");

if (passwordInput) {
    passwordInput.addEventListener("input", () => {
        let p = passwordInput.value;
        if (p.length < 1) {
            strengthText.innerText = "Strength: —";
            strengthText.className = "strength";
        }
        else if (p.length < 6) {
            strengthText.innerText = "Strength: Weak";
            strengthText.className = "strength weak";
        }
        else if (p.match(/[0-9]/) && p.match(/[A-Z]/)) {
            strengthText.innerText = "Strength: Strong";
            strengthText.className = "strength strong";
        }
        else {
            strengthText.innerText = "Strength: Medium";
            strengthText.className = "strength medium";
        }
    });
}

// ============ Email Validation ==========
let emailInput = document.getElementById("email");
if (emailInput) {
    emailInput.onblur = function () {
        let email = this.value.toLowerCase();
        let goodDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
        let domain = email.split("@")[1];
        if (email.includes("@")) {
            let allowed = false;
            for (let good of goodDomains) {
                if (domain === good) {
                    allowed = true;
                    break;
                }
            }
            if (!allowed) {
                showCustomAlert(`❌ النطاق "${domain}" غير مسموح به!`, 'error');
                this.value = "";
                this.focus();
            }
        }
    };
}

// ============ Form Submit ============
const bankForm = document.getElementById("bankForm");

if (bankForm) {
    bankForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById("submitBtn");
        const originalText = btn.textContent;
        
        // جمع البيانات
        const fullName = document.getElementById("fullName").value.trim();
        const nationalId = document.getElementById("nationalId").value.trim();
        const dateOfBirth = document.getElementById("birthDate").value;
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const postalCode = document.getElementById("postalCode").value.trim();
        const accountType = document.getElementById("accountType").value;
        const initialDeposit = parseFloat(document.getElementById("initialDeposit").value) || 0;
        
        // ========== ✅ التحقق من الرقم القومي ==========
        if (!nationalId || nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
            showCustomAlert("❌ الرقم القومي يجب أن يكون 14 رقم بالضبط!", 'error');
            return;
        }
        
        // ========== ✅ التحقق من العمر ==========
        if (!dateOfBirth) {
            showCustomAlert("❌ الرجاء إدخال تاريخ الميلاد!", 'error');
            return;
        }
        const age = calculateAge(dateOfBirth);
        if (age < 18) {
            showCustomAlert(`❌ عمرك ${age} سنة. يجب أن يكون 18 سنة على الأقل!`, 'error');
            return;
        }
        
        // ========== ✅ التحقق من رقم الهاتف ==========
        if (!phone) {
            showCustomAlert("❌ الرجاء إدخال رقم الهاتف!", 'error');
            return;
        }
        const phoneValidation = validateEgyptianPhone(phone);
        if (!phoneValidation.isValid) {
            showCustomAlert("❌ رقم الهاتف غير صحيح! يجب أن يبدأ بـ 010/011/012/015", 'error');
            return;
        }
        
        // ========== ✅ التحقق من رفع صور البطاقة ==========
        if (!frontImageBase64) {
            showCustomAlert("❌ الرجاء رفع صورة الوجه الأمامي للبطاقة!", 'error');
            return;
        }
        if (!backImageBase64) {
            showCustomAlert("❌ الرجاء رفع صورة الوجه الخلفي للبطاقة!", 'error');
            return;
        }
        
        const userData = {
            fullName, nationalId, dateOfBirth, gender, 
            phone: phoneValidation.formatted, email, password,
            address, city, postalCode, accountType, initialDeposit,
            frontImage: frontImageBase64,
            backImage: backImageBase64
        };
        
        // تحقق من تطابق كلمة المرور
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (userData.password !== confirmPassword) {
            showCustomAlert("❌ كلمات المرور غير متطابقة!", 'error');
            return;
        }
        
        if (userData.password.length < 8) {
            showCustomAlert("❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل!", 'error');
            return;
        }
        
        if (!userData.email || !userData.password || !userData.fullName) {
            showCustomAlert("❌ الرجاء ملء جميع الحقول المطلوبة!", 'error');
            return;
        }
        
        if (userData.initialDeposit < 1000) {
            showCustomAlert("❌ الحد الأدنى للإيداع المبدئي هو 1000 جنيه!", 'error');
            return;
        }
        
        btn.textContent = "⏳ جاري إنشاء الحساب...";
        btn.disabled = true;
        
        try {
            console.log('📤 Sending to backend with images...');
            const result = await api.register(userData);
            console.log('✅ Backend response:', result);
            
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                showCustomAlert(`✅ مرحباً ${userData.fullName}! تم انشاء الحساب بانتظار تفعيل الحساب ف خلال 5 دقائق`, 'success');
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                showCustomAlert("❌ " + (result.message || "فشل إنشاء الحساب"), 'error');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            showCustomAlert("❌ خطأ في الاتصال. تأكد من تشغيل الخادم!", 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// ========== تشغيل إعدادات رفع الصور ==========
setupImageUpload();

// ========== التحقق من رقم الهاتف أثناء الكتابة ==========
const phoneField = document.getElementById("phone");
if (phoneField) {
    phoneField.addEventListener("input", function() {
        let phone = this.value.replace(/[^0-9]/g, '');
        if (phone.length > 11) phone = phone.slice(0, 11);
        this.value = phone;
    });
}

// ========== التحقق من الرقم القومي أثناء الكتابة ==========
const nationalIdField = document.getElementById("nationalId");
if (nationalIdField) {
    nationalIdField.addEventListener("input", function() {
        let id = this.value.replace(/[^0-9]/g, '');
        if (id.length > 14) id = id.slice(0, 14);
        this.value = id;
    });
}

// تعيين الحد الأقصى لتاريخ الميلاد
const birthDateField = document.getElementById("birthDate");
if (birthDateField) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    birthDateField.max = minDate.toISOString().split('T')[0];
}

// تعبئة البيانات المؤقتة
document.addEventListener('DOMContentLoaded', function() {
    const tempData = localStorage.getItem('tempSignup');
    if (tempData) {
        const data = JSON.parse(tempData);
        if (document.getElementById('fullName') && data.username) {
            document.getElementById('fullName').value = data.username;
        }
        if (document.getElementById('nationalId') && data.nationalId) {
            document.getElementById('nationalId').value = data.nationalId;
        }
        if (document.getElementById('birthDate') && data.dateOfBirth) {
            document.getElementById('birthDate').value = data.dateOfBirth;
        }
        if (document.getElementById('email') && data.email) {
            document.getElementById('email').value = data.email;
        }
        console.log('✅ Pre-filled form with signup data');
    }
});