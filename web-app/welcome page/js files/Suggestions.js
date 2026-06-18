    // تعيين التاريخ الحالي
    document.addEventListener("DOMContentLoaded", function () {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const dateString = now.toLocaleDateString("ar-EG", options);
    document.getElementById("currentDate").textContent = dateString;
    });

    // عناصر DOM
    const contactForm = document.getElementById("contactForm");
    const fileInput = document.getElementById("fileInput");
    const fileBtn = document.getElementById("fileBtn");
    const fileDropArea = document.getElementById("fileDropArea");
    const selectedFile = document.getElementById("selectedFile");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const removeFile = document.getElementById("removeFile");
    const summaryTextarea = document.getElementById("summary");
    const charCounter = document.getElementById("charCounter");
    const successModal = document.getElementById("successModal");
    const errorModal = document.getElementById("errorModal");
    const loadingModal = document.getElementById("loadingModal");

    // مصفوفة لتخزين الأخطاء
    let errors = {};

    // تعقب عدد الأحرف في الملخص
    summaryTextarea.addEventListener("input", function () {
    const charCount = this.value.length;
    charCounter.textContent = `عدد الأحرف: ${charCount} / 4000`;

    if (charCount > 4000) {
        charCounter.classList.add("exceeded");
        charCounter.classList.remove("near-limit");
    } else if (charCount > 3500) {
        charCounter.classList.add("near-limit");
        charCounter.classList.remove("exceeded");
    } else {
        charCounter.classList.remove("near-limit", "exceeded");
    }
    });

    // فتح مدير الملفات عند النقر على الزر
    fileBtn.addEventListener("click", () => {
    fileInput.click();
    });

    // السماح بسحب وإفلات الملفات
    fileDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDropArea.style.borderColor = "var(--primary-color)";
    fileDropArea.style.backgroundColor = "#f0f7ff";
    });

    fileDropArea.addEventListener("dragleave", () => {
    fileDropArea.style.borderColor = "#c8d4de";
    fileDropArea.style.backgroundColor = "#f9fbfc";
    });

    fileDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDropArea.style.borderColor = "#c8d4de";
    fileDropArea.style.backgroundColor = "#f9fbfc";

    if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
    });

    // التعامل مع اختيار الملف
    fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
    });

    // معالجة الملف المختار
    function handleFileSelect(file) {
    // التحقق من نوع الملف
    const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
    ];
    const fileError = document.getElementById("fileError");

    if (!validTypes.includes(file.type)) {
        fileError.classList.add("show");
        fileInput.value = "";
        return;
    }

    // التحقق من حجم الملف (1 ميغابايت)
    const maxSize = 1024 * 1024; // 1 ميغابايت
    if (file.size > maxSize) {
        fileError.textContent =
        "حجم الملف أكبر من 1 ميغابايت. الرجاء اختيار ملف أصغر";
        fileError.classList.add("show");
        fileInput.value = "";
        return;
    }

    // إخفاء رسالة الخطأ إذا كان الملف صحيحًا
    fileError.classList.remove("show");

    // عرض معلومات الملف
    fileName.textContent = file.name;
    fileSize.textContent = `الحجم: ${(file.size / 1024).toFixed(2)} كيلوبايت`;
    selectedFile.classList.add("show");
    }

    // إزالة الملف المختار
    removeFile.addEventListener("click", () => {
    fileInput.value = "";
    selectedFile.classList.remove("show");
    document.getElementById("fileError").classList.remove("show");
    });

    // التحقق من صحة الحقول
    function validateField(fieldId, errorId, validationFn) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    const value = field.value.trim();

    if (validationFn(value)) {
        field.classList.remove("error");
        error.classList.remove("show");
        delete errors[fieldId];
        return true;
    } else {
        field.classList.add("error");
        error.classList.add("show");
        errors[fieldId] = errorId;
        return false;
    }
    }

    // دوال التحقق من الصحة
    function validateName(name) {
    return name.length >= 2 && /^[\u0600-\u06FF\s]+$/.test(name);
    }

    function validatePhone(phone) {
    return /^01[0-2,5]{1}[0-9]{8}$/.test(phone);
    }

    function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateNationalId(id) {
    return /^[0-9]{14}$/.test(id);
    }

    function validateMessageType(type) {
    return type && type !== "";
    }

    function validateSubject(subject) {
    return subject.length >= 5;
    }

    function validateSummary(summary) {
    return summary.length >= 10 && summary.length <= 4000;
    }

    // إضافة مستمعي الأحداث للتحقق أثناء الكتابة
    document.getElementById("fullName").addEventListener("blur", function () {
    validateField("fullName", "nameError", validateName);
    });

    document.getElementById("phone").addEventListener("blur", function () {
    validateField("phone", "phoneError", validatePhone);
    });

    document.getElementById("email").addEventListener("blur", function () {
    validateField("email", "emailError", validateEmail);
    });

    document.getElementById("nationalId").addEventListener("blur", function () {
    validateField("nationalId", "nationalIdError", validateNationalId);
    });

    document.getElementById("messageType").addEventListener("change", function () {
    validateField("messageType", "messageTypeError", validateMessageType);
    });

    document.getElementById("subject").addEventListener("blur", function () {
    validateField("subject", "subjectError", validateSubject);
    });

    document.getElementById("summary").addEventListener("blur", function () {
    validateField("summary", "summaryError", validateSummary);
    });

    // التحقق من النموذج عند الإرسال
    contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // إعادة تعيين الأخطاء
    errors = {};

    // التحقق من جميع الحقول
    const isNameValid = validateField("fullName", "nameError", validateName);
    const isPhoneValid = validateField("phone", "phoneError", validatePhone);
    const isEmailValid = validateField("email", "emailError", validateEmail);
    const isNationalIdValid = validateField(
        "nationalId",
        "nationalIdError",
        validateNationalId
    );
    const isMessageTypeValid = validateField(
        "messageType",
        "messageTypeError",
        validateMessageType
    );
    const isSubjectValid = validateField(
        "subject",
        "subjectError",
        validateSubject
    );
    const isSummaryValid = validateField(
        "summary",
        "summaryError",
        validateSummary
    );

    // التحقق من الملف إذا تم اختياره
    const fileError = document.getElementById("fileError");
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        ];
        const maxSize = 1024 * 1024;

        if (!validTypes.includes(file.type) || file.size > maxSize) {
        fileError.classList.add("show");
        errors.file = "fileError";
        } else {
        fileError.classList.remove("show");
        }
    }

    // إذا لم توجد أخطاء، قم بعرض نافذة التحميل ثم النجاح
    if (
        isNameValid &&
        isPhoneValid &&
        isEmailValid &&
        isNationalIdValid &&
        isMessageTypeValid &&
        isSubjectValid &&
        isSummaryValid &&
        Object.keys(errors).length === 0
    ) {
        // عرض نافذة التحميل
        loadingModal.style.display = "flex";

        // محاكاة إرسال البيانات إلى الخادم
        setTimeout(() => {
        loadingModal.style.display = "none";

        // اختيار عشوائي بين النجاح والفشل (للتجربة فقط)
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            successModal.style.display = "flex";
        } else {
            errorModal.style.display = "flex";
        }
        }, 2000);
    } else {
        // إذا كانت هناك أخطاء، قم بالتمرير إلى أول حقل به خطأ
        const firstErrorId = Object.keys(errors)[0];
        if (firstErrorId) {
        document.getElementById(firstErrorId).scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        }
    }
    });

    // إغلاق النوافذ المنبثقة
    document
    .getElementById("closeSuccessModal")
    .addEventListener("click", function () {
        successModal.style.display = "none";
        contactForm.reset();
        selectedFile.classList.remove("show");
        charCounter.textContent = "عدد الأحرف: 0 / 4000";
        charCounter.classList.remove("near-limit", "exceeded");

        // إزالة أخطاء التنسيق من الحقول
        const errorFields = document.querySelectorAll(".form-control.error");
        errorFields.forEach((field) => field.classList.remove("error"));

        const errorMessages = document.querySelectorAll(".error-message.show");
        errorMessages.forEach((msg) => msg.classList.remove("show"));
    });

    document
    .getElementById("closeErrorModal")
    .addEventListener("click", function () {
        errorModal.style.display = "none";
    });
// دالة لعرض التاريخ باللغة المناسبة
function updateCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (!currentDateElement) return;
    
    const now = new Date();
    
    if (i18next && i18next.language === 'ar') {
        // تنسيق التاريخ بالعربية
        const arabicMonths = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        
        const day = now.getDate();
        const month = arabicMonths[now.getMonth()];
        const year = now.getFullYear();
        
        currentDateElement.textContent = `${day} ${month} ${year}`;
    } else {
        // تنسيق التاريخ بالإنجليزية
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// تحديث التاريخ عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    
    // تحديث التاريخ عند تغيير اللغة
    if (window.i18next) {
        i18next.on('languageChanged', function() {
            updateCurrentDate();
        });
    }
});

// أو إذا كنت تريد استخدام الترجمات من ملف language.js
function updateCurrentDateWithTranslation() {
    const currentDateElement = document.getElementById('currentDate');
    if (!currentDateElement) return;
    
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    if (i18nextInitialized) {
        // الحصول على أسماء الأشهر من الترجمات
        const monthNames = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        
        const monthName = i18next.t(monthNames[month]);
        currentDateElement.textContent = `${day} ${monthName} ${year}`;
    } else {
        // تنسيق افتراضي إذا لم تكن الترجمة جاهزة
        currentDateElement.textContent = now.toLocaleDateString();
    }
}