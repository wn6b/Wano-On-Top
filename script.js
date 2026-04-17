/* Project: Wano Cloud Hosting - Logic v1.0
   Environment: JavaScript / Firebase Realtime Database
*/

// إعدادات Firebase - تأكد من وضع الـ Config الخاص بك هنا
const firebaseConfig = {
    databaseURL: "https://wano-studio-default-rtdb.firebaseio.com",
};

// تهيئة التطبيق
// ملاحظة: بما أننا نستخدم CDN في الـ HTML، نفترض أن firebase محملة
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// وظيفة تسجيل الدخول (تجريبية للوحة التحكم)
function login() {
    console.log("Checking credentials...");
    // هنا نضع نظام الـ Auth لاحقاً
    alert("نظام تسجيل الدخول قيد التطوير للنسخة الاحترافية.");
}

// وظيفة التحقق من القوانين قبل إضافة أي بوت
function checkSafetyRules(botToken, platform) {
    // كود منطقي بسيط لمنع الـ Self-Bots (مثلاً: توكن الديسكورد العادي يختلف عن حساب المستخدم)
    if (platform === 'discord' && !botToken.startsWith('M') && !botToken.startsWith('N')) {
        alert("تحذير: هذا التوكن يبدو لحساب شخصي (Self-Bot). الحظر فوراً!");
        return false;
    }
    return true;
}

// وظيفة ربط البوت بقاعدة البيانات
function connectBot(platform) {
    const token = prompt(`أدخل التوكن الخاص ببوت ${platform}:`);
    
    if (token) {
        if (checkSafetyRules(token, platform)) {
            const botRef = database.ref('bots/' + platform);
            botRef.push({
                token: token,
                status: 'pending',
                timestamp: Date.now(),
                owner: 'WanoUser' // هنا نربطه بـ ID المستخدم مستقبلاً
            }).then(() => {
                alert(`تم إرسال طلب استضافة بوت ${platform} بنجاح. يتم الفحص الآن...`);
            }).catch((error) => {
                console.error("Error: ", error);
            });
        }
    }
}

// مراقبة الحالة (Real-time Status)
function trackStatus() {
    const statusRef = database.ref('system/status');
    statusRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("Server Status: ", data);
        // هنا نقوم بتحديث الـ UI بناءً على حالة السيرفر الحقيقية
    });
}

// تشغيل المراقبة عند تحميل الصفحة
window.onload = trackStatus;
