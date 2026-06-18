import { api } from './api.js';
import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

const canvas = document.getElementById("canvas");
const loader = document.getElementById("loader");
const app = TubesCursor(canvas, {
    tubes: {
        colors: ["#0ef", "#0ef", "#6958d5"],
        lights: {
            intensity: 200,
            colors: ["#6958d5", "#0ef", "#0ef", "#60aed5"],
        },
    },
});

requestAnimationFrame(() => {
    canvas.style.opacity = "1";
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 600);
});

document.body.addEventListener('click', () => {
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    app.tubes.setColors(colors);
    app.tubes.setlightColors(lightsColors);
});

function randomColors(count) {
    return new Array(count).fill(0).map(() => lightenColor(randomHex(), 50));
}

function randomHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function lightenColor(hex, percent) {
    let { h, s, l } = hexToHSL(hex);
    l = Math.min(100, l + percent);
    return hslToHex(h, s, l);
}

function hexToHSL(H) {
    let r = 0, g = 0, b = 0;
    r = parseInt(H.substring(1, 3), 16) / 255;
    g = parseInt(H.substring(3, 5), 16) / 255;
    b = parseInt(H.substring(5, 7), 16) / 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255).toString(16).padStart(2, "0");
    g = Math.round((g + m) * 255).toString(16).padStart(2, "0");
    b = Math.round((b + m) * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

// ========================================
// دوال التنبيه المخصصة - تظهر في أعلى الشاشة
// ========================================

function showToast(message, type = 'success') {
    // إزالة أي تنبيه سابق
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    // تحديد الأيقونة واللون حسب نوع التنبيه
    let icon = 'check-circle';
    let iconColor = '#10b981';
    let borderColor = '#10b981';
    
    if (type === 'error') {
        icon = 'exclamation-circle';
        iconColor = '#ef4444';
        borderColor = '#ef4444';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
        iconColor = '#f59e0b';
        borderColor = '#f59e0b';
    } else if (type === 'info') {
        icon = 'info-circle';
        iconColor = '#0ef';
        borderColor = '#0ef';
    }
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 22px; color: ${iconColor};">
                <i class="fas fa-${icon}"></i>
            </div>
            <div style="flex: 1; font-weight: 500; color: #a0d2db; font-size: 14px; line-height: 1.5;">${message}</div>
            <button onclick="this.closest('.custom-toast').remove()" style="background: none; border: none; color: #a0d2db; cursor: pointer; font-size: 16px; padding: 5px; transition: all 0.3s ease; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // تنسيق التنبيه - يظهر في أعلى الشاشة
    toast.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(10, 36, 56, 0.98) 0%, rgba(8, 27, 41, 0.99) 100%);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 238, 255, 0.2);
        border-right: 4px solid ${borderColor};
        z-index: 100000;
        animation: toastSlideDown 0.3s ease;
        min-width: 300px;
        max-width: 500px;
        padding: 15px 20px;
        font-family: 'Cairo', sans-serif;
    `;
    
    // إضافة تأثير hover لزر الإغلاق
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = 'rgba(79, 195, 247, 0.1)';
            closeBtn.style.color = '#4fc3f7';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#a0d2db';
        };
    }
    
    document.body.appendChild(toast);
    
    // إزالة التنبيه تلقائياً بعد 4 ثواني
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastFadeOutUp 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }
    }, 4000);
}

// دوال مساعدة للاستخدام السريع
function showSuccessMessage(msg) { showToast(msg, 'success'); }
function showErrorMessage(msg) { showToast(msg, 'error'); }
function showWarningMessage(msg) { showToast(msg, 'warning'); }
function showInfoMessage(msg) { showToast(msg, 'info'); }

// إضافة أنماط CSS للتنبيهات إذا لم تكن موجودة
if (!document.querySelector('#toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes toastSlideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes toastFadeOutUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// OTP SEND LOGIC
// ========================================

let currentEmail = '';

document.getElementById("submitBtn").addEventListener("click", async function () {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.toLowerCase();
    const btn = this;
    const originalText = btn.textContent;

    // التحقق من صحة الإيميل
    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }

    // التحقق من النطاق المسموح
    let goodDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    let domain = email.split("@")[1];
    let allowed = goodDomains.includes(domain);
    
    if (!allowed) {
        showErrorMessage('❌ النطاق "' + domain + '" غير مسموح به!');
        emailInput.value = "";
        emailInput.focus();
        return;
    }

    btn.textContent = "⏳ جاري الإرسال...";
    btn.disabled = true;

    try {
        const result = await api.sendOTP(email);
        console.log('OTP sent:', result);
        
        // حفظ الإيميل للتالي
        currentEmail = email;
        localStorage.setItem('resetEmail', email);
        
        // ✅ استخدام التنبيه المخصص بدلاً من alert
        showSuccessMessage("✅ تم إرسال رمز التحقق إلى بريدك الإلكتروني!");
        
        // الانتقال إلى صفحة إدخال OTP بعد 1.5 ثانية
        setTimeout(() => {
            window.location.href = "otp.html";
        }, 1500);
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        showErrorMessage("❌ " + (error.message || "فشل إرسال رمز التحقق"));
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});