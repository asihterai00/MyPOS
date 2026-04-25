# 🏪 AMSA POS Desktop

**Point of Sale System Modern untuk Windows** - Dibangun dengan WPF, .NET 8, dan MySQL

![.NET](https://img.shields.io/badge/.NET-8.0-purple?logo=dotnet)
![WPF](https://img.shields.io/badge/UI-WPF-blue?logo=windows)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fitur Utama

### 🛒 Point of Sale (POS)
- Interface kasir modern dan intuitif
- Support keyboard shortcuts untuk input cepat
- Shopping cart real-time
- Multiple payment methods
- Print receipt ready

### 📦 Inventory Management
- Manajemen produk lengkap (CRUD)
- Stock tracking otomatis
- Kategori produk
- SKU management
- Low stock alerts

### 👥 Customer & Vendor Management
- Database pelanggan
- Database pemasok
- Riwayat transaksi
- Contact management

### 📊 Reports & Analytics
- Sales history
- Revenue reports
- Product performance
- Export to Excel/PDF

### 🔐 User Management
- Multi-user support
- Role-based access (Admin, Cashier)
- Secure authentication
- Activity logging

## 🎨 Desain Modern

Terinspirasi dari sistem POS modern seperti AMSJA:

- **Dark Theme** - Nyaman di mata untuk penggunaan lama
- **Material Design** - UI yang clean dan profesional
- **Smooth Animations** - Transisi halus antar halaman
- **Responsive Layout** - Menyesuaikan ukuran layar
- **Card-based UI** - Informasi terorganisir dengan baik

## 🚀 Quick Start

### Prerequisites

1. **Windows 10/11** (WPF hanya support Windows)
2. **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **MySQL/MariaDB** - [Download MySQL](https://dev.mysql.com/downloads/mysql/) | [Download MariaDB](https://mariadb.org/download/)
4. **Visual Studio Code** - [Download](https://code.visualstudio.com/)

### Instalasi

#### 1. Clone atau Download Project

```bash
cd AMSA-POS-Desktop
```

#### 2. Setup Database

Aplikasi akan otomatis membuat database dan tabel saat pertama kali dijalankan.

Atau buat manual:

```sql
CREATE DATABASE amsa_pos;
```

#### 3. Konfigurasi Database

Edit file `src/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=amsa_pos;User=root;Password=root;"
  }
}
```

#### 4. Build & Run

```bash
cd src
dotnet restore
dotnet run
```

### Login Default

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `cashier1` | `admin123` | Cashier |

## 📁 Struktur Project

```
AMSA-POS-Desktop/
├── src/
│   ├── App.xaml              # Application entry point
│   ├── App.xaml.cs
│   ├── appsettings.json      # Database configuration
│   ├── Views/                # XAML UI files
│   │   └── MainWindow.xaml   # Main window dengan POS interface
│   ├── ViewModels/           # MVVM ViewModels
│   │   └── MainWindowViewModel.cs
│   ├── Models/               # Data models
│   │   └── Models.cs
│   ├── Services/             # Business logic & database
│   │   ├── DatabaseService.cs
│   │   └── Services.cs
│   └── Assets/Styles/        # Custom styles & themes
│       └── ModernStyles.xaml
├── AMSA.POS.Desktop.sln      # Solution file
├── RUN.md                    # Detailed running instructions
└── README.md                 # This file
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | .NET 8.0 |
| UI Framework | WPF (Windows Presentation Foundation) |
| UI Libraries | MaterialDesignThemes, MahApps.Metro |
| Architecture | MVVM (Model-View-ViewModel) |
| ORM | Dapper |
| Database | MySQL / MariaDB |
| Logging | Serilog |
| DI | Microsoft.Extensions.DependencyInjection |

## 📖 Documentation

- **[RUN.md](RUN.md)** - Panduan lengkap cara menjalankan
- **Wiki** - Coming soon

## 🎯 Keyboard Shortcuts (POS Mode)

| Shortcut | Function |
|----------|----------|
| `F1` | Help |
| `F2` | Search Product |
| `F5` | Refresh |
| `ESC` | Cancel / Back |
| `Enter` | Confirm / Add to Cart |
| `Delete` | Remove from Cart |
| `Ctrl+P` | Print Receipt |
| `Ctrl+S` | Complete Sale |

## 🔧 Development

### Build Commands

```bash
# Restore dependencies
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Publish for production
dotnet publish -c Release -r win-x64 --self-contained false
```

### VS Code Extensions Recommended

- C# Dev Kit (Microsoft)
- C# (Microsoft)
- .NET Extension Pack (Microsoft)
- XAML Styler

## 📝 Notes

- ⚠️ **Windows Only**: Aplikasi ini menggunakan WPF yang hanya berjalan di Windows
- 🔒 **Security**: Ganti password default sebelum production
- 💾 **Backup**: Regular backup database recommended
- 🌐 **Network**: Support multi-terminal dengan network database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for modern retail businesses.

---

**Happy Selling! 🚀**
