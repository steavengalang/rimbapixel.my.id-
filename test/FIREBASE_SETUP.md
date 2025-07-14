# 🔥 Firebase Setup Guide

## Panduan Lengkap Setup Firebase untuk Centralized Data Storage

### ⚠️ Mengapa Perlu Firebase?

**Masalah**: Data capture hanya tersimpan di localStorage browser yang mengakses situs. Jadi admin tidak bisa lihat data dari user lain.

**Solusi**: Firebase Realtime Database untuk menyimpan data secara terpusat sehingga admin bisa melihat capture data dari semua users.

---

## 🚀 Step-by-Step Setup

### 1. Buat Project Firebase

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** atau **"Tambah project"**
3. Masukkan nama project (contoh: `phishing-simulation-tool`)
4. Disable Google Analytics (opsional)
5. Klik **"Create project"**

### 2. Setup Realtime Database

1. Di dashboard Firebase, pilih **"Realtime Database"**
2. Klik **"Create Database"**
3. Pilih lokasi server (pilih **Asia-Southeast1** untuk Indonesia)
4. Pilih **"Start in test mode"** (rules akan dikonfigurasi nanti)
5. Klik **"Enable"**

### 3. Dapatkan Configuration

1. Di dashboard Firebase, klik ikon gear ⚙️ > **"Project settings"**
2. Scroll ke bawah ke section **"Your apps"**
3. Klik **"</>"** (Web app)
4. Daftarkan app dengan nama (contoh: "phishing-admin")
5. **JANGAN** centang "Firebase Hosting"
6. Klik **"Register app"**
7. **Copy configuration object** yang terlihat seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "phishing-simulation-xxxxx.firebaseapp.com",
  databaseURL: "https://phishing-simulation-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phishing-simulation-xxxxx",
  storageBucket: "phishing-simulation-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 4. Configure Security Rules

1. Di Realtime Database, klik tab **"Rules"**
2. Replace rules dengan ini untuk testing:

```json
{
  "rules": {
    "phishing_captures": {
      ".read": true,
      ".write": true
    },
    "admin_notifications": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **PENTING**: Rules di atas untuk testing only! Untuk production gunakan rules yang lebih secure.

### 5. Update Configuration di Code

1. **Edit `index.html`** - ganti configuration:
```javascript
const firebaseConfig = {
    // GANTI dengan config dari step 3
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "phishing-simulation-xxxxx.firebaseapp.com",
    databaseURL: "https://phishing-simulation-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "phishing-simulation-xxxxx",
    storageBucket: "phishing-simulation-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

2. **Edit `admin.html`** - ganti configuration dengan **config yang sama persis**

---

## 🔧 Testing Setup

### 1. Test Basic Functionality

1. Upload files ke GitHub Pages
2. Buka `index.html` di browser - check console untuk:
   - `🔥 Firebase connected successfully`
   - `☁️ Data saved to Firebase successfully`

3. Buka `admin.html` di browser - check console untuk:
   - `🔥 Firebase connected successfully`
   - `☁️ Loaded X records from Firebase`

### 2. Test Cross-Device Data Sharing

1. **Device 1**: Akses `index.html` (simulate user)
2. **Device 2**: Akses `admin.html` (sebagai admin)
3. Verify data muncul di admin dashboard

---

## 📊 Firebase Data Structure

Data disimpan dengan struktur:

```
your-project/
├── phishing_captures/
│   ├── capture_1640123456789_abc123/
│   │   ├── sessionInfo: {...}
│   │   ├── technicalInfo: {...}
│   │   ├── cameraData: {...}
│   │   └── captureId: "capture_1640123456789_abc123"
│   └── capture_1640123456790_def456/
│       └── ...
└── admin_notifications/
    ├── push_id_1: {type: "new_capture", ...}
    └── push_id_2: {type: "new_capture", ...}
```

---

## 🔒 Security Best Practices

### For Production Use

1. **Database Rules** yang lebih secure:
```json
{
  "rules": {
    "phishing_captures": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "admin_notifications": {
      ".read": "auth != null", 
      ".write": "auth != null"
    }
  }
}
```

2. **Enable Authentication**:
   - Setup Firebase Auth
   - Require login untuk admin
   - Restrict write access

3. **API Key Restrictions**:
   - Di Google Cloud Console
   - Restrict API key ke domain spesifik
   - Enable only required APIs

---

## 🛠️ Troubleshooting

### Error: "Firebase not configured"
- **Solusi**: Ganti config dummy dengan config asli dari Firebase

### Error: "Permission denied"
- **Solusi**: Check database rules, pastikan `.read` dan `.write` = `true`

### Error: "Network error"
- **Solusi**: Check internet connection dan databaseURL

### Data tidak muncul di admin
- **Solusi**: 
  1. Check console untuk error messages
  2. Verify config sama di `index.html` dan `admin.html`
  3. Test dengan browser incognito

### Real-time updates tidak bekerja
- **Solusi**:
  1. Refresh admin dashboard
  2. Check browser console untuk errors
  3. Verify Firebase connection status

---

## 💡 Advanced Features

### 1. Photo Storage (Optional)

Untuk menyimpan foto full-size di Firebase Storage:

1. Enable Firebase Storage
2. Update upload logic di `index.html`
3. Update download logic di `admin.html`

### 2. User Authentication (Recommended)

1. Enable Authentication di Firebase
2. Setup email/password atau Google auth
3. Protect admin dashboard dengan login

### 3. Data Analytics

1. Enable Firebase Analytics
2. Track user engagement
3. Monitor capture success rates

---

## 📞 Support

**Jika masih ada masalah:**

1. Check browser console untuk error messages
2. Verify Firebase configuration
3. Test dengan device/browser lain
4. Check Firebase Console untuk connection status

**Common Issues:**
- Config tidak sama antara index.html dan admin.html
- Database rules terlalu restrictive
- Network firewall blocking Firebase
- Browser blocking third-party cookies

---

**🎯 Setelah setup Firebase berhasil:**
- Admin bisa lihat data capture dari semua users
- Real-time notifications ketika ada capture baru
- Centralized data storage yang aman
- No more localStorage limitations! 