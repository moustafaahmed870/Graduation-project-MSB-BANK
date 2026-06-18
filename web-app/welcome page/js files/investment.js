    document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
        const item = header.parentElement;

        // إغلاق جميع العناصر الأخرى
        document.querySelectorAll(".accordion-item").forEach((otherItem) => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
        }
        });
        document.querySelectorAll(".accordion-item-1").forEach((otherItem) => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
        }
        });
        document.querySelectorAll(".accordion-item-2").forEach((otherItem) => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
        }
        });
        document.querySelectorAll(".accordion-item-3").forEach((otherItem) => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
        }
        });
        document.querySelectorAll(".accordion-item-4").forEach((otherItem) => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
        }
        });

        // فتح/إغلاق العنصر الحالي
        item.classList.toggle("active");
    });
    });
