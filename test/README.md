# 🔒 Phishing Simulation Tool

## ⚠️ PERINGATAN PENTING

**Tool ini HANYA untuk testing keamanan internal yang diotorisasi dalam organisasi Anda sendiri!**

- ❌ JANGAN gunakan untuk tujuan ilegal atau merugikan orang lain
- ❌ JANGAN gunakan tanpa izin eksplisit dari organisasi
- ✅ HANYA untuk testing kesadaran keamanan internal
- ✅ HANYA untuk training dan edukasi karyawan

## 📋 Deskripsi

Tool simulasi phishing ini dirancang untuk membantu organisasi menguji tingkat kesadaran keamanan karyawan mereka. Tool ini meniru teknik phishing umum untuk mengidentifikasi kerentanan dalam perilaku pengguna dan memberikan edukasi real-time.

## 🎯 Fitur Utama

### 📊 Data Collection
- Email dan password (dengan masking keamanan)
- Informasi IP address
- Detail browser dan platform
- Resolusi layar dan timezone
- Lokasi geografis (dengan izin pengguna)
- Metadata teknis lainnya

### 🔍 Analisis Teknis
- User agent analysis
- Screen resolution tracking
- Network connection info
- Session duration tracking
- Referrer detection
- Silent camera capture (front/back)
- Photo preview dan download
- Geolocation tracking otomatis

### 📈 Reporting
- Real-time feedback modal
- Local data storage
- CSV export functionality dengan data foto
- Photo preview dan download individual/bulk
- Test session tracking
- Educational content delivery

## 🚀 Cara Penggunaan

### 1. Setup Lokal
```bash
# Clone atau download files
# Buka index.html di browser web
```

### 2. Testing Simulation (Direct Redirect Mode)

#### Simple One-Mode Operation (`index.html`)
1. Kirim link `index.html` ke target
2. User melihat loading "Mengarahkan..."
3. System menangkap data browser/IP/camera otomatis
4. Auto redirect ke `rimbapixel.my.id` (target site)
5. User tidak tahu ada data capture - terlihat seperti redirect biasa

### 3. Data Analysis (Admin)
- **Ctrl + Shift + E**: Export data testing ke CSV
- **Ctrl + Shift + C**: Clear semua data testing
- **Ctrl + Shift + D**: Toggle debug mode untuk console logging
- Check browser console untuk log detail (jika debug mode aktif)
- Review localStorage untuk data session
- Buka `admin.html` untuk dashboard lengkap

#### Photo Management di Admin Dashboard
- 📸 **View photos**: Klik thumbnail untuk preview modal
- 📥 **Download individual**: Tombol download di setiap foto
- 📥 **Download bulk**: Tombol "Download All Photos" untuk semua foto
- 📊 **Camera stats**: Chart success rate front/back camera
- 📋 **CSV export**: Include status dan dimensions foto

## 📁 Struktur File

```
phishing-simulation/
├── index.html          # Main: Direct redirect dengan capture
├── admin.html          # Admin dashboard untuk analisis
├── style.css           # Styling dan layout (legacy)
├── script.js          # Functions library (legacy)
├── README.md          # Dokumentasi lengkap
├── USAGE_GUIDE.md     # Panduan quick start
└── CHANGELOG.md       # History perubahan
```

## 🛡️ Fitur Keamanan

### Stealth Mode (Baru!)
- **User tidak tahu mereka terkena phishing** - melihat pesan "login berhasil" palsu
- **Identitas tersembunyi** - data hanya terlihat di admin dashboard
- **No warning banners** - tampilan seperti portal perusahaan asli
- **Silent data capture** - logging tersembunyi dari user biasa
- **Fake success flow** - redirect otomatis setelah beberapa detik

### Data Protection
- Password di-mask untuk keamanan
- Data tersimpan lokal saja (tidak dikirim ke server eksternal)
- Session tracking untuk analisis
- Admin-only data visibility

### Admin-Only Features
- Full identity data di dashboard
- Photo preview dengan modal view
- Individual/bulk photo download (JPG format)
- Console logging dengan debug mode
- CSV/JSON export functionality dengan data foto
- Real-time statistics dan analytics

## 📊 Data yang Dikumpulkan

### User Credentials
- Email address
- Password (length only, content masked)

### Technical Information
- Public IP address
- Browser type dan versi
- Operating system
- Screen resolution
- Timezone
- Language settings

### Session Metadata
- Timestamp akses
- Session duration
- Referrer URL
- Test ID unik

### Camera Capture Data
- Front camera photos (JPEG format, kualitas 0.8)
- Back camera photos (JPEG format, kualitas 0.8)
- Dimensions dan timestamp setiap foto
- Status success/failure untuk setiap attempt
- Silent capture tanpa UI notification

## 🔧 Customization

### Mengubah Tampilan
Edit `style.css` untuk mengubah:
- Color scheme
- Logo perusahaan
- Layout dan typography
- Responsive behavior

### Mengubah Content
Edit `index.html` untuk mengubah:
- Company branding
- Form fields
- Educational content
- Warning messages

### Mengubah Logic
Edit `script.js` untuk mengubah:
- Data collection methods
- Export formats
- Educational feedback
- Analytics tracking

## 📋 Best Practices

### Untuk Administrator
1. **Dapatkan izin eksplisit** dari management sebelum testing
2. **Dokumentasikan semua test** dengan proper approval
3. **Anonimkan data** untuk privacy protection
4. **Provide follow-up training** untuk yang terkena simulasi
5. **Regular review** hasil testing untuk improvement

### Untuk Implementasi
1. **Host di server internal** untuk kontrol penuh
2. **Gunakan HTTPS** untuk simulasi yang realistis
3. **Customize branding** sesuai organisasi
4. **Set clear timeline** untuk testing campaign
5. **Prepare educational materials** untuk follow-up

## 📈 Reporting dan Analysis

### Metrics yang Bisa Ditrack
- **Success Rate**: Berapa persen karyawan yang terkena
- **Response Time**: Seberapa cepat pengguna memasukkan data
- **Browser Patterns**: Browser/OS apa yang paling rentan
- **Time Patterns**: Kapan orang paling rentan terhadap phishing
- **Department Analysis**: Department mana yang perlu training lebih

### Export Data
Tool ini menyediakan export CSV dengan kolom:
- Timestamp
- Test ID
- Email
- IP Address
- Browser
- Platform
- Location (jika diizinkan)

## 🎓 Educational Value

### Untuk Pengguna
- Real-time awareness tentang phishing
- Tips praktis keamanan siber
- Pengenalan red flags phishing
- Best practices untuk password security

### Untuk Organisasi
- Baseline security awareness assessment
- Targeted training identification
- Progress tracking over time
- ROI measurement untuk security training

## ⚖️ Legal dan Ethical Considerations

### WAJIB Dilakukan
- ✅ Dapatkan written authorization dari management
- ✅ Inform legal department tentang testing
- ✅ Document semua approval dan scope
- ✅ Provide educational follow-up untuk semua participant
- ✅ Anonymize data untuk privacy protection

### JANGAN Dilakukan
- ❌ Testing tanpa proper authorization
- ❌ Gunakan data untuk disciplinary action
- ❌ Share individual results publicly
- ❌ Use tool diluar organisasi internal
- ❌ Target external individuals/organizations

## 🔄 Future Enhancements

Beberapa improvement yang bisa ditambahkan:

### Technical
- Backend integration untuk centralized data
- Real-time dashboard untuk monitoring
- Integration dengan SIEM systems
- Advanced user behavioral analytics
- Mobile app simulation

### Educational
- Multi-language support
- Video-based education modules
- Gamification elements
- Progress tracking dashboard
- Certification system

### Security
- Advanced anti-detection methods
- More realistic email templates
- Integration dengan email security tools
- Automated reporting systems
- Compliance reporting

## 📞 Support dan Documentation

### Troubleshooting
- Check browser console untuk error messages
- Ensure JavaScript enabled
- Verify network connectivity untuk IP detection
- Check localStorage untuk saved data

### Technical Support
- Review script.js comments untuk implementation details
- Customize CSS untuk branding requirements
- Modify HTML untuk additional form fields
- Extend JavaScript untuk advanced analytics

---

**Disclaimer**: Tool ini dikembangkan untuk tujuan edukasi dan testing keamanan internal yang legitimate. Penggunaan untuk tujuan ilegal atau merugikan orang lain sangat dilarang dan menjadi tanggung jawab pengguna sepenuhnya.

**Remember**: The goal is education and improvement, not punishment. Use this tool responsibly to build a more security-aware organization. 