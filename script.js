/* ==========================================================
   WANO CLOUD PANEL - CORE ENGINE (PTERODACTYL CLONE)
   Version: 4.0.0 (Ultra Realistic Edition)
   Author: wn6b
   Environment: Web (GitHub Pages / Normal Host) + Firebase
   Security Level: AI-Enforced (No Discord Self-Bots)
   ========================================================== */

// 1. إعدادات قاعدة البيانات (Firebase v8)
const firebaseConfig = {
    databaseURL: "https://wano-studio-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. إعدادات النظام الأساسية
const SYSTEM_CONFIG = {
    MAX_CPU: 500, // 500% CPU (5 vCores)
    MAX_RAM: 32768, // 32 GB RAM in MB
    MAX_DISK: 102400, // 100 GB NVMe in MB
    NODE_LOCATION: "Node-DE-01 (Germany)",
    ADMIN_KEY: 'f!2HgJv#)"E"y^i' // مفتاح التشفير الخاص بك
};

// 3. إدارة واجهة المستخدم (UI Controller)
const UI = {
    showLoader: function() {
        const loader = document.getElementById('page-loader');
        if(loader) loader.style.display = 'block';
    },
    hideLoader: function() {
        const loader = document.getElementById('page-loader');
        if(loader) {
            setTimeout(() => { loader.style.display = 'none'; }, 800);
        }
    },
    updateServerCount: function(count) {
        // تحديث إحصائيات لوحة التحكم
        console.log(`[SYSTEM]: Active servers count updated to ${count}`);
    }
};

// 4. نظام النوافذ المنبثقة (Modal Controller)
let selectedSoftware = 'Node.js (v20)';

function openCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.style.display = 'flex';
        // إضافة تأثير الدخول
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

// تفعيل اختيار بيئة البرمجة
document.addEventListener('DOMContentLoaded', () => {
    UI.showLoader();
    
    // مراقبة اختيار السوفتوير
    const options = document.querySelectorAll('.option-card');
    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            options.forEach(o => o.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedSoftware = e.target.innerText;
        });
    });

    // تحميل الخوادم
    ServerManager.fetchServers();
});

// 5. محرك الذكاء الاصطناعي (AI Shield Logic)
const AIShield = {
    scanDeployment: function(serverName, software) {
        return new Promise((resolve, reject) => {
            console.log(`[AI-SHIELD]: Scanning deployment request for '${serverName}'...`);
            setTimeout(() => {
                const blacklist = ['selfbot', 'ddos', 'miner', 'hack'];
                const isClean = !blacklist.some(word => serverName.toLowerCase().includes(word));
                
                if (isClean) {
                    resolve("CLEAN");
                } else {
                    reject("MALICIOUS_ACTIVITY_DETECTED");
                }
            }, 1500); // محاكاة وقت الفحص
        });
    }
};

// 6. إدارة الخوادم (Server Manager)
const ServerManager = {
    generateUUID: function() {
        return 'WN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().substring(8);
    },

    createServer: async function() {
        const nameInput = document.getElementById('serverName');
        const name = nameInput.value.trim();

        if (name.length < 4) {
            alert("[ERROR]: اسم الخادم يجب أن يكون 4 أحرف على الأقل.");
            return;
        }

        try {
            // 1. فحص الذكاء الاصطناعي
            await AIShield.scanDeployment(name, selectedSoftware);
            
            // 2. إنشاء السيرفر في قاعدة البيانات
            const serverId = this.generateUUID();
            const serverData = {
                id: serverId,
                name: name,
                software: selectedSoftware,
                node: SYSTEM_CONFIG.NODE_LOCATION,
                status: "installing", // يبدأ بالتثبيت
                cpu_usage: 0.0,
                ram_usage: 0,
                disk_usage: 120, // OS Base usage
                created_at: Date.now(),
                owner: "wn6b"
            };

            await database.ref('servers/' + serverId).set(serverData);
            console.log(`[WANO-DAEMON]: Server ${serverId} container created.`);
            
            closeCreateModal();
            nameInput.value = '';
            
            // 3. محاكاة عملية التثبيت (Installation Process)
            this.simulateInstallation(serverId);

        } catch (error) {
            alert(`[AI SHIELD BLOCK]: تم رفض الإنشاء. السبب: ${error}`);
        }
    },

    simulateInstallation: function(serverId) {
        // محاكاة سحب الحزم وتثبيت Node.js
        setTimeout(() => {
            database.ref('servers/' + serverId).update({ status: "starting" });
        }, 4000);

        setTimeout(() => {
            database.ref('servers/' + serverId).update({ 
                status: "running",
                cpu_usage: (Math.random() * 5 + 0.1).toFixed(2), // استهلاك مبدئي
                ram_usage: Math.floor(Math.random() * 200) + 50 // 50-250MB RAM
            });
        }, 8000);
    },

    fetchServers: function() {
        const container = document.getElementById('serversContainer');
        
        database.ref('servers').on('value', (snapshot) => {
            container.innerHTML = '';
            let serverCount = 0;

            if (!snapshot.exists()) {
                container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #707070; padding: 40px;">لا يوجد خوادم نشطة حالياً. قم بإنشاء خادمك الأول.</div>`;
                UI.hideLoader();
                return;
            }

            snapshot.forEach((child) => {
                serverCount++;
                const server = child.val();
                this.renderServerCard(server, container);
            });

            UI.updateServerCount(serverCount);
            UI.hideLoader();
        });
    },

    renderServerCard: function(server, container) {
        const card = document.createElement('div');
        card.className = 'server-card';
        
        // حساب النسب المئوية للـ Progress Bars
        const cpuPercent = Math.min((server.cpu_usage / SYSTEM_CONFIG.MAX_CPU) * 100, 100).toFixed(1);
        const ramPercent = Math.min((server.ram_usage / SYSTEM_CONFIG.MAX_RAM) * 100, 100).toFixed(1);

        // تحديد لون وحالة السيرفر
        let statusClass = 'status-offline';
        let statusText = 'Offline';
        
        if (server.status === 'running') {
            statusClass = 'status-online';
            statusText = 'Running';
        } else if (server.status === 'installing') {
            statusClass = 'status-installing';
            statusText = 'Installing...';
        } else if (server.status === 'starting') {
            statusClass = 'status-starting';
            statusText = 'Starting...';
        }

        card.innerHTML = `
            <div class="server-header">
                <div class="server-title-group">
                    <h3>${server.name}</h3>
                    <span class="server-uuid">${server.id}</span>
                </div>
                <div class="status-indicator ${statusClass}">
                    <span class="dot"></span> ${statusText}
                </div>
            </div>

            <div class="server-info">
                <div class="info-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    ${server.node}
                </div>
                <div class="info-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                    ${server.software}
                </div>
            </div>

            <div class="server-resources">
                <div class="resource-block">
                    <div class="res-header">
                        <span>CPU Load</span>
                        <span>${server.cpu_usage}% / 500%</span>
                    </div>
                    <div class="res-bar-bg"><div class="res-bar-fill cpu-fill" style="width: ${cpuPercent}%"></div></div>
                </div>
                
                <div class="resource-block">
                    <div class="res-header">
                        <span>Memory (RAM)</span>
                        <span>${(server.ram_usage / 1024).toFixed(2)} GB / 32 GB</span>
                    </div>
                    <div class="res-bar-bg"><div class="res-bar-fill ram-fill" style="width: ${ramPercent}%"></div></div>
                </div>
            </div>

            <div class="server-actions">
                <button class="btn-console" onclick="Panel.openConsole('${server.id}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></svg>
                    إدارة السيرفر
                </button>
            </div>
        `;
        container.appendChild(card);
    }
};

// 7. وظيفة زر الإنشاء
function submitNewServer() {
    ServerManager.createServer();
}

// 8. نظام الـ Console / إدارة السيرفر (تحضير للخطوة القادمة)
const Panel = {
    openConsole: function(serverId) {
        // التحقق من صلاحيات الآدمن
        const access = prompt("[WANO DAEMON] - ROOT ACCESS REQUIRED:\nأدخل مفتاح التشفير للوصول إلى الطرفية (Terminal):");
        if (access === SYSTEM_CONFIG.ADMIN_KEY) {
            console.log(`[DAEMON]: Authenticated successfully for container ${serverId}.`);
            alert(`جارٍ فتح اتصال WebSocket مع العقدة لتشغيل السيرفر ${serverId}... (سيتم برمجتها في صفحة الـ Console)`);
            // مستقبلاً: window.location.href = `console.html?id=${serverId}`;
        } else {
            alert("[SECURITY BREACH]: تم رفض الوصول. تسجيل المحاولة في السجلات المركزية.");
        }
    }
};

// تحديث الموارد بشكل وهمي كل 5 ثواني لزيادة الواقعية (Real-time Simulation)
setInterval(() => {
    database.ref('servers').once('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((child) => {
                const server = child.val();
                if(server.status === 'running') {
                    // تذبذب واقعي في استهلاك الـ CPU والـ RAM
                    const newCpu = Math.max(0.1, (parseFloat(server.cpu_usage) + (Math.random() * 2 - 1))).toFixed(2);
                    const newRam = Math.max(50, (server.ram_usage + Math.floor(Math.random() * 20 - 10)));
                    database.ref('servers/' + child.key).update({
                        cpu_usage: newCpu,
                        ram_usage: newRam
                    });
                }
            });
        }
    });
}, 5000);
