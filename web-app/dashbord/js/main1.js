import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"

const canvas = document.getElementById("canvas");
const loader = document.getElementById("loader");
const app = TubesCursor(document.getElementById("canvas"), {
    tubes: {
        colors: ["#0ef", "#0ef", "#6958d5"],
        lights: {
        intesity: 200,
        colors: ["#6958d5", "#0ef", "#0ef", "#60aed5"],
        },
    },
    });

requestAnimationFrame(() => {
    canvas.style.opacity = "1";
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 600);
});

document.body.addEventListener('click',() =>{
    const colors = randomColors(3)
    const lightsColors = randomColors(4)
    console.log(colors , lightsColors)
    app.tubes.setColors(colors)
    app.tubes.setlightColors(lightsColors)
})

    function randomColors(count) {
      return new Array(count).fill(0).map(() => lightenColor(randomHex(), 50)); // ← 35% زيادة سطوع قوية وواضحة
    }

        function randomHex() {
        return (
            "#" +
            Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
        );
        }

        function lightenColor(hex, percent) {
        let { h, s, l } = hexToHSL(hex);
        l = Math.min(100, l + percent); // زيادة السطوع بشكل واضح
        return hslToHex(h, s, l);
        }

        function hexToHSL(H) {
        let r = 0,
            g = 0,
            b = 0;
        r = parseInt(H.substring(1, 3), 16) / 255;
        g = parseInt(H.substring(3, 5), 16) / 255;
        b = parseInt(H.substring(5, 7), 16) / 255;

        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        return {
            h,
            s: +(s * 100).toFixed(1),
            l: +(l * 100).toFixed(1),
        };
        }

        function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        r = Math.round((r + m) * 255)
            .toString(16)
            .padStart(2, "0");
        g = Math.round((g + m) * 255)
            .toString(16)
            .padStart(2, "0");
        b = Math.round((b + m) * 255)
            .toString(16)
            .padStart(2, "0");

        return `#${r}${g}${b}`;
        }


/--------------------------------------------------------/ 



    // import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

    // let app = null;

    // // تهيئة المؤشر بعد تحميل الصفحة
    // async function initTubesCursor() {
    // try {
    //     const canvas = document.getElementById("canvas");

    //     // تهيئة المؤشر مع إعدادات أولية
    //     app = TubesCursor(canvas, {
    //     tubes: {
    //         colors: ["#0ef", "#0ef", "#6958d5"],
    //         lights: {
    //         intensity: 50,
    //         colors: ["#6958d5", "#0ef", "#0ef", "#60aed5"],
    //         },
    //     },
    //     });

    //     // إخفاء شاشة التحميل بعد تهيئة المؤشر
    //     setTimeout(() => {
    //     document.getElementById("loading").classList.add("hidden");
    //     }, 500);

    //     // إضافة مستمع النقر لتغيير الألوان
    //     document.body.addEventListener("click", changeColors);
    // } catch (error) {
    //     console.error("Error initializing TubesCursor:", error);
    //     document.getElementById("loading").innerHTML =
    //     '<p style="color: #ff4757;">حدث خطأ في تحميل التأثير</p>';
    // }
    // }

    // // دالة لتغيير الألوان
    // function changeColors() {
    // if (!app) return;

    // try {
    //     // توليد ألوان جديدة
    //     const newColors = randomColors(3);
    //     const newLightColors = randomColors(4);

    //     // تطبيق الألوان الجديدة
    //     app.tubes.setColors(newColors);
    //     app.tubes.setlightColors(newLightColors);
    // } catch (error) {
    //     console.error("Error changing colors:", error);
    // }
    // }

    // // دالة لتوليد ألوان عشوائية
    // function randomColors(count) {
    // return new Array(count).fill(0).map(() => lightenColor(randomHex(), 30));
    // }

    // // توليد لون عشوائي
    // function randomHex() {
    // return (
    //     "#" +
    //     Math.floor(Math.random() * 16777215)
    //     .toString(16)
    //     .padStart(6, "0")
    // );
    // }

    // // تفتيح اللون
    // function lightenColor(hex, percent) {
    // const { h, s, l } = hexToHSL(hex);
    // const newLightness = Math.min(100, l + percent);
    // return hslToHex(h, s, newLightness);
    // }

    // // تحويل Hex إلى HSL
    // function hexToHSL(hex) {
    // const r = parseInt(hex.slice(1, 3), 16) / 255;
    // const g = parseInt(hex.slice(3, 5), 16) / 255;
    // const b = parseInt(hex.slice(5, 7), 16) / 255;

    // const max = Math.max(r, g, b);
    // const min = Math.min(r, g, b);
    // let h,
    //     s,
    //     l = (max + min) / 2;

    // if (max === min) {
    //     h = s = 0;
    // } else {
    //     const d = max - min;
    //     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    //     switch (max) {
    //     case r:
    //         h = (g - b) / d + (g < b ? 6 : 0);
    //         break;
    //     case g:
    //         h = (b - r) / d + 2;
    //         break;
    //     case b:
    //         h = (r - g) / d + 4;
    //         break;
    //     }

    //     h /= 6;
    // }

    // return {
    //     h: Math.round(h * 360),
    //     s: Math.round(s * 100),
    //     l: Math.round(l * 100),
    // };
    // }

    // // تحويل HSL إلى Hex
    // function hslToHex(h, s, l) {
    // l /= 100;
    // const a = (s * Math.min(l, 1 - l)) / 100;
    // const f = (n) => {
    //     const k = (n + h / 30) % 12;
    //     const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    //     return Math.round(255 * color)
    //     .toString(16)
    //     .padStart(2, "0");
    // };
    // return `#${f(0)}${f(8)}${f(4)}`;
    // }

    // // بدء التحميل عندما تكون الصفحة جاهزة
    // window.addEventListener("DOMContentLoaded", initTubesCursor);

    // // جعل الدالة متاحة عالمياً للزر
    // window.changeColors = changeColors;

