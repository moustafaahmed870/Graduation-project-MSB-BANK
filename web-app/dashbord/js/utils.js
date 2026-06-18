// js/utils.js
// الدوال المساعدة لنظام البنك - مع تحديث ديزاين التنبيهات

const BankUtils = {
    // إظهار رسالة تحميل
    showLoading: function(show, message = 'جاري التحميل...') {
        let loadingEl = document.getElementById('global-loading');
        
        if (show) {
            if (!loadingEl) {
                loadingEl = document.createElement('div');
                loadingEl.id = 'global-loading';
                loadingEl.className = 'loading-overlay';
                loadingEl.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">${message}</div>
                    </div>
                `;
                document.body.appendChild(loadingEl);
            } else {
                const loadingText = loadingEl.querySelector('.loading-text');
                if (loadingText) loadingText.textContent = message;
                loadingEl.style.display = 'flex';
            }
        } else {
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
        }
    },
    
    // إظهار تنبيه بنفس ديزاين الصفحة
    showAlert: function(message, type = 'info', duration = 5000) {
        // إزالة أي تنبيهات سابقة
        const existingAlert = document.querySelector('.custom-alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // إنشاء عنصر التنبيه
        const alert = document.createElement('div');
        alert.className = `custom-alert-message custom-alert-${type}`;
        
        // تحديد الأيقونة بناءً على نوع التنبيه
        let icon = 'info-circle';
        let iconColor = '#4fc3f7'; // اللون الأساسي للـ info
        
        if (type === 'success') {
            icon = 'check-circle';
            iconColor = '#10b981'; // أخضر
        } else if (type === 'error') {
            icon = 'exclamation-circle';
            iconColor = '#ef4444'; // أحمر
        } else if (type === 'warning') {
            icon = 'exclamation-triangle';
            iconColor = '#f59e0b'; // برتقالي
        }
        
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
        
        // إضافة التنسيقات المدمجة (style مباشر لضمان التطبيق)
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
            font-family: 'Cairo', sans-serif;
        `;
        
        const contentDiv = alert.querySelector('.custom-alert-content');
        contentDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
        `;
        
        const iconDiv = alert.querySelector('.custom-alert-icon');
        iconDiv.style.cssText = `
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const textDiv = alert.querySelector('.custom-alert-text');
        textDiv.style.cssText = `
            flex: 1;
            font-weight: 500;
            color: #a0d2db;
            font-size: 14px;
            line-height: 1.5;
        `;
        
        const closeBtn = alert.querySelector('.custom-alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #a0d2db;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            transition: all 0.3s ease;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = 'rgba(79, 195, 247, 0.1)';
            closeBtn.style.color = '#4fc3f7';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#a0d2db';
        };
        
        document.body.appendChild(alert);
        
        // إضافة حركة السقوط في CSS إذا لم تكن موجودة
        if (!document.querySelector('#customAlertStyles')) {
            const style = document.createElement('style');
            style.id = 'customAlertStyles';
            style.textContent = `
                @keyframes customAlertSlideDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes customAlertFadeOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                }
                .custom-alert-message {
                    transition: all 0.3s ease;
                }
                .custom-alert-message.fade-out {
                    animation: customAlertFadeOut 0.3s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
        
        // إزالة التنبيه تلقائياً بعد المدة المحددة
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.classList.add('fade-out');
                    setTimeout(() => {
                        if (alert.parentNode) alert.remove();
                    }, 300);
                }
            }, duration);
        }
    },
    
    // تنسيق التاريخ
    formatDate: function(dateStr, format = 'full') {
        const date = new Date(dateStr);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('ar-EG', options);
    },
    
    // تنسيق الوقت النسبي (منذ...)
    timeAgo: function(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        return this.formatDate(dateStr);
    },
    
    // إغلاق جميع النوافذ المنبثقة
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.remove();
            }
        });
    },
    
    // تبديل اتجاه الصفحة (عربي/إنجليزي)
    toggleLanguage: function() {
        const body = document.body;
        const html = document.documentElement;
        const langBtn = document.getElementById('languageToggle');
        
        if (body.classList.contains('rtl')) {
            body.classList.remove('rtl');
            body.classList.add('ltr');
            html.dir = 'ltr';
            html.lang = 'en';
            if (langBtn) langBtn.innerHTML = '<i class="fas fa-language"></i> العربية';
            BankData.appState.currentLanguage = 'en';
        } else {
            body.classList.remove('ltr');
            body.classList.add('rtl');
            html.dir = 'rtl';
            html.lang = 'ar';
            if (langBtn) langBtn.innerHTML = '<i class="fas fa-language"></i> English';
            BankData.appState.currentLanguage = 'ar';
        }
        
        // حفظ التفضيل
        localStorage.setItem('bankLanguage', BankData.appState.currentLanguage);
    },
    
    // تهيئة اللغة المحفوظة
    initLanguage: function() {
        const savedLang = localStorage.getItem('bankLanguage');
        const body = document.body;
        const html = document.documentElement;
        
        if (savedLang === 'en') {
            body.classList.remove('rtl');
            body.classList.add('ltr');
            html.dir = 'ltr';
            html.lang = 'en';
            BankData.appState.currentLanguage = 'en';
        } else {
            body.classList.remove('ltr');
            body.classList.add('rtl');
            html.dir = 'rtl';
            html.lang = 'ar';
            BankData.appState.currentLanguage = 'ar';
        }
    }
};
BankUtils.showConfirmModal = function(options) {
    return new Promise((resolve) => {
        // إزالة أي مودال موجود مسبقاً
        const existingModal = document.getElementById('customConfirmModal');
        if (existingModal) existingModal.remove();
        
        const {
            title = 'تأكيد',
            message = 'هل أنت متأكد؟',
            confirmText = 'تأكيد',
            cancelText = 'إلغاء',
            confirmColor = '#10b981',
            icon = 'question-circle',
            iconColor = '#f59e0b',
            showCancel = true
        } = options;
        
        const modalHTML = `
            <div class="modal" id="customConfirmModal" style="display: flex; z-index: 10000;">
                <div class="modal-content" style="max-width: 450px; animation: slideInUp 0.3s ease;">
                    <div class="modal-header" style="border-bottom-color: rgba(49, 124, 129, 0.3);">
                        <h3 style="color: #a0d2db; margin: 0;">
                            <i class="fas fa-${icon}" style="color: ${iconColor}; margin-left: 10px;"></i>
                            ${title}
                        </h3>
                        ${showCancel ? `
                        <button class="modal-close" onclick="BankUtils.closeConfirmModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a0d2db;">
                            &times;
                        </button>
                        ` : ''}
                    </div>
                    <div class="modal-body" style="padding: 25px 20px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <i class="fas fa-${icon}" style="font-size: 48px; color: ${iconColor};"></i>
                        </div>
                        <p style="text-align: center; color: #a0d2db; font-size: 16px; line-height: 1.6; margin: 0;">
                            ${message}
                        </p>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 12px; justify-content: center; padding: 20px; border-top: 1px solid rgba(49, 124, 129, 0.3);">
                        ${showCancel ? `
                        <button class="btn btn-secondary" id="confirmModalCancelBtn" style="padding: 10px 25px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(49, 124, 129, 0.3); border-radius: 8px; color: #a0d2db; cursor: pointer; transition: all 0.3s ease;">
                            <i class="fas fa-times"></i>
                            ${cancelText}
                        </button>
                        ` : ''}
                        <button class="btn btn-primary" id="confirmModalOkBtn" style="padding: 10px 25px; background: linear-gradient(135deg, ${confirmColor} 0%, ${confirmColor}dd 100%); border: none; border-radius: 8px; color: white; cursor: pointer; transition: all 0.3s ease;">
                            <i class="fas fa-check"></i>
                            ${confirmText}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // إضافة أنماط CSS للـ modal إذا لم تكن موجودة
        if (!document.querySelector('#confirmModalStyles')) {
            const style = document.createElement('style');
            style.id = 'confirmModalStyles';
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .modal-footer .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .modal-footer .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #4fc3f7;
                    border-color: #4fc3f7;
                }
            `;
            document.head.appendChild(style);
        }
        
        // ربط الأحداث
        const okBtn = document.getElementById('confirmModalOkBtn');
        const cancelBtn = document.getElementById('confirmModalCancelBtn');
        const closeBtn = document.querySelector('#customConfirmModal .modal-close');
        
        const closeModal = () => {
            const modal = document.getElementById('customConfirmModal');
            if (modal) modal.remove();
        };
        
        if (okBtn) {
            okBtn.onclick = () => {
                closeModal();
                resolve(true);
            };
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                closeModal();
                resolve(false);
            };
        }
        
        if (closeBtn && showCancel) {
            closeBtn.onclick = () => {
                closeModal();
                resolve(false);
            };
        }
        
        // الضغط على Escape للإلغاء
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                resolve(false);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // الضغط خارج المودال للإلغاء
        const modal = document.getElementById('customConfirmModal');
        if (modal && showCancel) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    closeModal();
                    resolve(false);
                }
            };
        }
    });
};

// دالة إغلاق المودال (للاستخدام المباشر)
BankUtils.closeConfirmModal = function() {
    const modal = document.getElementById('customConfirmModal');
    if (modal) modal.remove();
};
// js/utils.js - أضف هذه الدالة في نهاية الملف

// ========================================
// مودال تأكيد بسيط (بدون Promises معقدة)
// ========================================

// جعل الدوال متاحة عالمياً
window.BankUtils = BankUtils;