# 🎯 Panduan Penggunaan Phishing Simulation Tool

## 🔄 Flow Penggunaan

### 🎯 Simplified Single Mode (index.html)
👥 **Untuk User (Target)**:
1. **Akses**: Buka `index.html` di browser (atau kirim link)
2. **Loading**: Melihat animasi "Mengarahkan..." dengan progress bar
3. **Capture**: Data browser/IP/camera ter-capture otomatis di background
4. **Redirect**: Otomatis redirect ke `rimbapixel.my.id` setelah 3 detik
5. **Status**: ❌ **TIDAK TAHU** ada data capture, hanya pikir redirect biasa

### 👨‍💼 Untuk Admin (Security Team)
1. **Monitoring**: Buka `admin.html` untuk dashboard
2. **Data**: Lihat semua data yang ter-capture
3. **Analysis**: Review statistics, location, dan camera capture rates
4. **Export**: Download data untuk reporting
5. **Status**: ✅ **DAPAT MELIHAT** semua data lengkap

---

## 🖥️ Interface Overview

### User Interface (index.html)
```
🌐 Mengarahkan...
┌─────────────────────────┐
│       [Loading...]      │
│  Menganalisis koneksi   │
│ ████████████████████████ │
│   Selesai! Mengalihkan  │
└─────────────────────────┘
→ Redirect ke rimbapixel.my.id

Background: Silent capture IP, location, camera
```

### Admin Interface (admin.html)
```
🔒 Admin Dashboard
┌─────────────────────────────────┐
│ Total Tests: 25                 │
│ Success Rate: 100%              │
│ Last Test: 2024-01-15          │
└─────────────────────────────────┘

📋 Captured Data:
facebook.com | IP: 192.168.1.100 | Jakarta, ID | 📸 Front | 14:30
google.com   | IP: 10.0.0.50     | Bandung, ID | 📸 Both  | 09:15
twitter.com  | IP: 172.16.1.5    | Surabaya,ID | ❌ Failed| 11:45
...
```

---

## 🛠️ Keyboard Shortcuts

### Admin Controls
- `Ctrl + Shift + E` → Export CSV
- `Ctrl + Shift + C` → Clear all data  
- `Ctrl + Shift + R` → Refresh dashboard
- `Ctrl + Shift + D` → Toggle debug mode

### Debug Mode
```javascript
// Console akan menampilkan:
🎯 Phishing Simulation - Data Captured: {
  email: "user@corp.com",
  ip: "192.168.1.100",
  browser: "Chrome",
  ...
}
```

---

## 📊 Data yang Di-capture

### Visible to Admin Only
- ✅ **IP address + automatic geolocation** 🌍
- ✅ **Detailed location**: City, country, region, ISP
- ✅ **Browser & OS fingerprinting** 🖥️
- ✅ **Screen resolution & timezone** ⏰
- ✅ **Camera photos** (front + back cameras) 📸
- ✅ **Referrer URL** (where they came from)
- ✅ **Session timestamps & load times**

### Visible to User
- ❌ **Nothing!** (Complete stealth mode)
- ✅ **Only loading animation** "Mengarahkan..."
- ❌ **No camera permission prompts** (silent attempts)
- ❌ **No location permission prompts** (IP-based)
- ❌ **No forms or suspicious UI**

---

## 🔒 Security Features

### Stealth Protection
- No warning banners untuk user
- No educational content exposed
- Silent data collection
- Fake success simulation
- Auto-redirect untuk realism

### Admin Protection  
- Data hanya di localStorage
- No external server calls
- Password masking
- Debug mode toggle
- Secure admin dashboard

---

## 🎯 Best Practices

### Pre-Testing
1. ✅ Dapatkan izin management
2. ✅ Inform legal department
3. ✅ Set clear testing timeline
4. ✅ Prepare follow-up training
5. ✅ Test tool di environment staging

### During Testing
1. ✅ Monitor admin dashboard
2. ✅ Document semua hasil
3. ✅ Keep data confidential
4. ✅ No disciplinary actions
5. ✅ Ready untuk educational follow-up

### Post-Testing
1. ✅ Export data untuk analysis
2. ✅ Provide security training
3. ✅ Share aggregate results (no individuals)
4. ✅ Plan improvement programs
5. ✅ Clear sensitive data setelah analysis

---

## ⚡ Quick Start

```bash
# 1. Setup
git clone <repository>
cd phishing-simulation

# 2. Deploy Main Tool
open index.html
# Users melihat loading → data ter-capture (IP, location, camera) → redirect rimbapixel.my.id

# 3. Admin Monitoring  
open admin.html
# Admin melihat semua data captured dengan location dan camera info

# 4. Export Results
Ctrl + Shift + E (dari admin.html)
# Download CSV dengan data lengkap: IP, location, camera, browser
```

## 🚨 Important Notes

⚠️ **HANYA untuk testing internal yang diotorisasi**  
⚠️ **User tidak boleh tahu ini adalah simulation**  
⚠️ **Data untuk improvement, bukan punishment**  
⚠️ **Follow organizational security policies**  
🔒 **HTTPS required untuk camera access** - browser policy  
📱 **Camera access works best on mobile devices**  
🌐 **IP geolocation tidak butuh permission** - always works

---

**Happy Phishing Testing! 🎣** (Legal dan ethical saja ya 😉) 