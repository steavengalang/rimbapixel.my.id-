# 📝 Changelog - Phishing Simulation Tool

## 🚀 v2.1 - Simplified Single Mode (Latest)

### 🔄 **BREAKING CHANGES**
- ❌ **Removed login form mode** - no more credential capture
- ✅ **Single mode operation** - only direct redirect
- ✅ **Simplified deployment** - just send `index.html` link
- ✅ **Focus on tracking** - IP, location, camera capture only

### 📁 **Updated File Structure**
```
phishing-simulation/
├── index.html          # Main tool (was direct.html)
├── admin.html          # Admin dashboard
├── style.css           # Legacy styling
├── script.js           # Legacy functions
├── README.md           # Updated docs
├── USAGE_GUIDE.md      # Simplified guide
└── CHANGELOG.md        # This file
```

### 🎯 **New Simplified Flow**
1. **User**: Clicks link → sees loading → redirects to rimbapixel.my.id
2. **System**: Silent capture of IP, location, camera, browser data
3. **Admin**: View all data in enhanced dashboard

---

## 🚀 v2.0 - Advanced Stealth Mode

### 🆕 New Features

#### 📍 **Automatic Location Detection**
- ✅ **No permission prompts** - uses IP geolocation service
- ✅ **Detailed location data**: City, Country, Region, ISP, Organization
- ✅ **Fallback system** - multiple API endpoints for reliability
- ✅ **Admin dashboard integration** - location distribution charts

#### 📸 **Silent Camera Capture**
- ✅ **Attempts both front and back camera** access
- ✅ **No obvious UI elements** - hidden video elements
- ✅ **Silent failure** - continues if camera denied
- ✅ **Photo compression** - stores base64 thumbnails
- ✅ **Camera statistics** in admin dashboard

#### 🎯 **Enhanced Redirect System**
- ✅ **Mode 1**: Login form → fake success → `youtube.com`
- ✅ **Mode 2**: Direct redirect → loading animation → `rimbapixel.my.id`
- ✅ **Realistic timing** - longer delays for camera capture
- ✅ **Progressive status updates** for user experience

### 🔧 Technical Improvements

#### 📊 **Admin Dashboard Enhanced**
- ✅ **New data columns**: Location, Camera status
- ✅ **Additional charts**: Location distribution, Camera access stats
- ✅ **Enhanced CSV export** with location and camera data
- ✅ **Type differentiation**: Login Form vs Direct Redirect
- ✅ **Color-coded indicators** for different capture types

#### 🛡️ **Security & Stealth**
- ✅ **Complete invisibility** - no warning banners for users
- ✅ **Silent logging** - debug mode toggle for admins
- ✅ **Professional UX** - realistic loading and success messages
- ✅ **Background data capture** - no user awareness

#### 🔄 **Data Structure Updates**
- ✅ **Camera data object**: Front/back capture status and images
- ✅ **Enhanced location object**: City, country, ISP, coordinates
- ✅ **Session metadata**: Type tracking, improved timestamps
- ✅ **Backward compatibility** with old data formats

### 📁 **File Structure**
```
phishing-simulation/
├── index.html          # Mode 1: Login form → youtube.com
├── direct.html         # Mode 2: Direct capture → rimbapixel.my.id  
├── admin.html          # Enhanced dashboard with new features
├── style.css           # Professional styling
├── script.js           # Updated with location/camera functions
├── README.md           # Complete documentation
├── USAGE_GUIDE.md      # Quick start guide
└── CHANGELOG.md        # This file
```

### 🎯 **Capture Capabilities**

#### 👤 **User Data (Mode 1 Only)**
- Email address
- Password length (masked for security)

#### 🌐 **Automatic Technical Data (Both Modes)**
- Public IP address
- City, Region, Country
- ISP and Organization
- Browser fingerprinting
- Screen resolution & timezone
- Network connection info
- Session timing and metadata

#### 📸 **Camera Data (Both Modes - NEW!)**
- Front camera photo attempt
- Back camera photo attempt  
- Capture success/failure status
- Image dimensions and timestamps
- Silent operation (no user notification)

### 📈 **Admin Analytics**

#### 📊 **Statistics Dashboard**
- Total tests performed
- Success rate tracking
- Average response times
- Last test timestamp

#### 📱 **Distribution Charts**
- Browser usage patterns
- Time-based activity
- **Location distribution by country** (NEW!)
- **Camera access success rates** (NEW!)

#### 💾 **Data Export**
- Enhanced CSV format with all new fields
- JSON export for technical analysis
- Location and camera data included
- Type-based filtering capabilities

---

## 📋 v1.0 - Initial Stealth Implementation

### ✨ Original Features
- Basic login form phishing simulation
- Credential capture with password masking
- Browser fingerprinting
- Real-time admin dashboard
- CSV export functionality
- Stealth operation (no user awareness)

### 🔧 Core Components
- Professional login interface
- Admin monitoring dashboard
- Silent data capture
- Basic geolocation (with permissions)

---

## 🎯 **Usage Comparison**

### v1.0 → v2.0 Improvements

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Location | Permission-based | **Automatic IP-based** |
| Camera | Not available | **Silent capture** |
| Redirect | about:blank | **Realistic sites** |
| Admin UI | Basic table | **Enhanced with charts** |
| Data Types | Login only | **Multiple modes** |
| Stealth Level | Good | **Complete invisibility** |

### 📱 **New Deployment Options**

#### 🎯 **For Credential Testing**
```bash
# Use index.html
# Users see: Login form → Success → YouTube
# Admin gets: Email, password, location, camera, tech data
```

#### 🕵️ **For Tracking/Analytics**  
```bash
# Use direct.html
# Users see: Loading → Redirect to target site
# Admin gets: Location, camera, browser data (no credentials)
```

#### 👨‍💼 **For Security Teams**
```bash
# Use admin.html
# View: All captured data with enhanced analytics
# Export: Complete dataset for reporting
```

---

## 🚨 **Security & Legal Notes**

⚠️ **v2.0 requires additional considerations:**

- **Camera access needs HTTPS** - browser security requirement
- **More invasive data collection** - ensure proper authorization
- **Enhanced stealth capabilities** - higher responsibility for ethical use
- **Location tracking** - may require additional legal compliance

✅ **Always ensure:**
- Management authorization before deployment
- Legal department awareness of capabilities  
- Educational follow-up for detected users
- Ethical use for improvement, not punishment

---

**Happy Ethical Phishing Testing! 🎣🔒** 