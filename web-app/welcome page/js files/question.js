    document.addEventListener("DOMContentLoaded", function () {
    // عناصر النموذج
    const form = document.getElementById("investmentForm");
    const customerRadios = document.querySelectorAll('input[name="isCustomer"]');
    const customerFields = document.getElementById("customerFields");
    const resetBtn = document.getElementById("resetBtn");
    const successMessage = document.getElementById("successMessage");
    const referenceNumber = document.getElementById("referenceNumber");

    // متغيرات التحقق
    let isCustomer = false;

    // التحقق من حقل "هل أنت عميل حالي"
    customerRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
        // إخفاء رسالة الخطأ إذا تم الاختيار
        document.getElementById("customerError").style.display = "none";

        // التحقق مما إذا كان المستخدم عميلاً
        isCustomer = this.value === "yes";

        // إظهار/إخفاء حقول SIM إذا كان المستخدم عميلاً
        if (isCustomer) {
            customerFields.style.display = "block";
        } else {
            customerFields.style.display = "none";
            // إزالة القيمة المطلوبة من حقل SIM إذا لم يكن عميلاً
            document.getElementById("sim").removeAttribute("required");
        }
        });
    });

    // التحقق من رقم الهاتف
    function validatePhone(phone) {
        const phoneRegex = /^05\d{8}$/;
        return phoneRegex.test(phone);
    }

    // التحقق من البريد الإلكتروني
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // التحقق من حقل SIM (إذا كان عميلاً)
    function validateSIM(sim) {
        // تحقق بسيط - يجب أن يحتوي على أرقام فقط وطول مناسب
        const simRegex = /^\d{10,20}$/;
        return simRegex.test(sim);
    }

    // التحقق من التاريخ (لا يمكن اختيار تاريخ قديم)
    function validateDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    // إظهار رسالة الخطأ
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = "block";
        return false;
    }

    // إخفاء رسالة الخطأ
    function hideError(elementId) {
        document.getElementById(elementId).style.display = "none";
        return true;
    }

    // إعادة تعيين النموذج
    resetBtn.addEventListener("click", function () {
        form.reset();
        customerFields.style.display = "none";

        // إخفاء جميع رسائل الخطأ
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach((error) => {
        error.style.display = "none";
        });

        // إخفاء رسالة النجاح
        successMessage.style.display = "none";
    });

    // معالجة إرسال النموذج
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let isValid = true;

        // التحقق من حقل "هل أنت عميل حالي"
        const selectedCustomer = document.querySelector(
        'input[name="isCustomer"]:checked'
        );
        if (!selectedCustomer) {
        isValid = showError(
            "customerError",
            "يرجى اختيار ما إذا كنت عميلاً حاليًا أم لا"
        );
        } else {
        hideError("customerError");
        isCustomer = selectedCustomer.value === "yes";
        }

        // التحقق من حقل SIM إذا كان عميلاً
        if (isCustomer) {
        const sim = document.getElementById("sim").value.trim();
        if (!sim) {
            isValid = showError("simError", "يرجى إدخال رقم السيم كاملاً");
        } else if (!validateSIM(sim)) {
            isValid = showError(
            "simError",
            "يرجى إدخال رقم سيم صحيح (أرقام فقط، 10-20 رقم)"
            );
        } else {
            hideError("simError");
        }
        }

        // التحقق من رقم الهاتف
        const phone = document.getElementById("phone").value.trim();
        if (!phone) {
        isValid = showError("phoneError", "يرجى إدخال رقم الهاتف");
        } else if (!validatePhone(phone)) {
        isValid = showError(
            "phoneError",
            "يرجى إدخال رقم هاتف صحيح (مثال: 05XXXXXXXX)"
        );
        } else {
        hideError("phoneError");
        }

        // التحقق من البريد الإلكتروني
        const email = document.getElementById("email").value.trim();
        if (!email) {
        isValid = showError("emailError", "يرجى إدخال البريد الإلكتروني");
        } else if (!validateEmail(email)) {
        isValid = showError("emailError", "يرجى إدخال بريد إلكتروني صحيح");
        } else {
        hideError("emailError");
        }

        // التحقق من المحافظة
        const governorate = document.getElementById("governorate").value;
        if (!governorate) {
        isValid = showError("governorateError", "يرجى اختيار المحافظة");
        } else {
        hideError("governorateError");
        }

        // التحقق من صندوق الاستثمار
        const fund = document.getElementById("fund").value;
        if (!fund) {
        isValid = showError("fundError", "يرجى اختيار صندوق الاستثمار");
        } else {
        hideError("fundError");
        }

        // التحقق من التاريخ
        const date = document.getElementById("date").value;
        if (!date) {
        isValid = showError("dateError", "يرجى اختيار التاريخ");
        } else if (!validateDate(date)) {
        isValid = showError("dateError", "لا يمكن اختيار تاريخ قديم");
        } else {
        hideError("dateError");
        }

        // التحقق من الوقت
        const time = document.getElementById("time").value;
        if (!time) {
        isValid = showError("timeError", "يرجى اختيار الوقت المناسب");
        } else {
        hideError("timeError");
        }

        // إذا كان النموذج صالحاً، عرض رسالة النجاح
        if (isValid) {
        // إنشاء رقم مرجعي عشوائي
        const refNum = "REF-" + Math.floor(100000 + Math.random() * 900000);
        referenceNumber.textContent = refNum;

        // إخفاء النموذج وعرض رسالة النجاح
        form.style.display = "none";
        successMessage.style.display = "block";

        // في الواقع، هنا نرسل البيانات إلى الخادم
        console.log("تم إرسال النموذج بنجاح!");
        console.log("بيانات النموذج:", {
            isCustomer: isCustomer ? "نعم" : "لا",
            sim: isCustomer ? document.getElementById("sim").value : "غير مطبق",
            phone: phone,
            email: email,
            governorate: governorate,
            fund: fund,
            date: date,
            time: time,
        });
        }
    });

    // إضافة الحد الأدنى للتاريخ (اليوم)
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);
    });
