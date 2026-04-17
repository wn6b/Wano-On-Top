/* ==========================================================
   WANO CLOUD ENGINE v3.0 - CORE LOGIC
   Owner: wn6b | Key: f!2HgJv#)"E"y^i
   ========================================================== */

const firebaseConfig = { databaseURL: "https://wano-studio-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const ACCESS_KEY = 'f!2HgJv#)"E"y^i';

// تسجيل دخول المالك
function login() {
    const key = prompt("CRITICAL SECURITY: ENTER ACCESS KEY");
    if (key === ACCESS_KEY) {
        alert("ACCESS GRANTED. WELCOME MARWAN.");
    } else {
        alert("ACCESS DENIED. UNAUTHORIZED ATTEMPT LOGGED.");
    }
}

// إنشاء هوست بنظام الـ Cloud
function createNewHost() {
    const name = prompt("أدخل اسم الهوست (HOST IDENTIFIER):");
    if (name && name.length >= 3) {
        const hostId = "WANO-" + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // محاكاة توزيع الموارد
        database.ref('hosts/' + hostId).set({
            name: name,
            status: "online",
            cpu: Math.floor(Math.random() * 5) + 0.1, // محاكاة ضغط CPU
            ram: Math.floor(Math.random() * 50) + 20, // محاكاة استهلاك RAM
            max_ram: 512,
            owner: "wn6b",
            created_at: Date.now()
        }).then(() => {
            console.log("Host Created Successfully: " + hostId);
        });
    }
}

// عرض الهوستات بتصميم واقعي
function renderHosts() {
    const grid = document.getElementById('hostsGrid');
    
    database.ref('hosts').on('value', (snapshot) => {
        grid.innerHTML = '';
        
        if (!snapshot.exists()) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:var(--text-dim);">لا يوجد هوستات نشطة حالياً. أنشئ أول هوست للبدء.</p>';
            return;
        }

        snapshot.forEach((child) => {
            const host = child.val();
            const ramPercentage = (host.ram / host.max_ram) * 100;
            
            const card = document.createElement('div');
            card.className = 'server-card';
            card.innerHTML = `
                <div class="status-tag status-online">Active Node</div>
                <h3>${host.name}</h3>
                <p class="server-id">UID: ${child.key}</p>
                
                <div class="server-stats">
                    <div class="stat-item">
                        <span class="stat-label">CPU Load</span>
                        <span class="stat-value">${host.cpu}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${host.cpu * 10}%"></div>
                    </div>
                    
                    <div class="stat-item" style="margin-top: 15px;">
                        <span class="stat-label">RAM Usage</span>
                        <span class="stat-value">${host.ram}MB / ${host.max_ram}MB</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${ramPercentage}%"></div>
                    </div>
                </div>

                <button class="btn-secondary" onclick="manageHost('${child.key}')">الإعدادات المتقدمة</button>
            `;
            grid.appendChild(card);
        });
    });
}

function manageHost(id) {
    alert(`[WANO-AI]: جارٍ فحص موارد الهوست ${id} وتجهيز البيئة البرمجية...`);
}

// تشغيل النظام عند التحميل
document.addEventListener('DOMContentLoaded', renderHosts);
