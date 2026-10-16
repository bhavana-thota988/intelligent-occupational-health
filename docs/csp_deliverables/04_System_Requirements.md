# SYSTEM REQUIREMENTS SPECIFICATION

**Project Title**: Intelligent Occupational Health and Workplace Risk Management Platform  
**Document Code**: CSP-DOC-08  
**Format**: PDF / Markdown  

---

## 1. Hardware Requirements

### Minimum Hardware Specifications (Client / Demonstration Machine)
* **Processor (CPU)**: Intel Core i3 (7th Gen or later) / AMD Ryzen 3 / Apple M-series
* **Clock Speed**: 2.0 GHz Dual-Core minimum
* **RAM (Memory)**: 4 GB DDR4 minimum
* **Storage Available**: At least 1.5 GB free disk space (for Node modules, Python venv, and source code)
* **Display Resolution**: 1366 x 768 pixels minimum (optimized for 1920 x 1080 Full HD)
* **Input Devices**: Standard Keyboard, Touchpad or Mouse
* **Network Adapter**: 10/100 Mbps Ethernet or 802.11 b/g/n Wi-Fi (for initial package downloads)

### Recommended Hardware Specifications (Development & Production Server)
* **Processor (CPU)**: Intel Core i5/i7 (10th Gen or later) / AMD Ryzen 5/7 / Apple Silicon (M1/M2/M3)
* **Clock Speed**: 2.8 GHz Quad-Core or higher
* **RAM (Memory)**: 8 GB or 16 GB DDR4/DDR5
* **Storage**: Solid State Drive (SSD) with at least 5 GB available space
* **Display Resolution**: 1920 x 1080 (1080p) or 2560 x 1440 (2K)

---

## 2. Software Requirements

### Operating System
* **Primary / Supported**:
  * Microsoft Windows 10 (64-bit) / Windows 11 (64-bit) [Current Target]
  * Apple macOS 12 Monterey or higher
  * Linux (Ubuntu 20.04 LTS / 22.04 LTS, Debian 11/12, Fedora)

### Runtime Environments & Compilers
* **Node.js Runtime**: Version 18.18.0 LTS or higher (v20+ recommended)
* **Package Manager**: npm version 9.x or 10.x / pnpm / yarn
* **Python Interpreter**: Version 3.10, 3.11, or 3.12 (64-bit)
* **Virtual Environment Tool**: `venv` / `virtualenv`

### Web Browsers (Standards Compliant)
* Google Chrome (Version 110 or higher) — *Recommended*
* Microsoft Edge (Version 110 or higher)
* Mozilla Firefox (Version 112 or higher)
* Apple Safari (Version 16 or higher)

### Development Tools & IDEs
* **Visual Studio Code (VS Code)**: Version 1.85 or higher
* **Recommended VS Code Extensions**:
  * ES7+ React/Redux/React-Native snippets
  * Python (Microsoft)
  * Tailwind / CSS IntelliSense
  * GitLens
* **Version Control**: Git Version 2.30+

---

## 3. Libraries, Frameworks & Dependencies

### Frontend Stack (`frontend/package.json`)
* **Core Library**: React.js 18.3.1
* **DOM Renderer**: React-DOM 18.3.1
* **Build Tool & Dev Server**: Vite 8.3.0
* **Routing**: React Router DOM 6.22.3
* **Data Visualization**: Recharts 2.12.3
* **Iconography**: Lucide React 0.359.0
* **Effects**: Canvas-Confetti 1.9.2

### Backend Stack (`backend/requirements.txt`)
* **API Framework**: FastAPI 0.110.0
* **ASGI Web Server**: Uvicorn (standard) 0.28.0
* **Data Serialization & Validation**: Pydantic 2.6.4
* **Security & Auth Utilities**: Passlib, Python-Jose (JWT support)

---

## 4. Network & Port Configurations

* **Frontend Port**: `http://localhost:5175/` (or default `5173`)
* **Backend API Port**: `http://127.0.0.1:8000/`
* **Swagger Interactive Docs**: `http://127.0.0.1:8000/docs`
* **Network Access**: Fully operable offline on `localhost` without external internet dependencies once dependencies are installed.
