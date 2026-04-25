# 🚀 Cara Menjalankan AMSA POS Desktop

## 📋 Prerequisites (Wajib)

Sebelum menjalankan aplikasi, pastikan Anda sudah menginstall:

1. **Windows 10/11** (Aplikasi ini hanya support Windows)
2. **.NET 8.0 SDK** - [Download disini](https://dotnet.microsoft.com/download/dotnet/8.0)
3. **MySQL Server** atau **MariaDB** - [Download MySQL](https://dev.mysql.com/downloads/mysql/) atau [Download MariaDB](https://mariadb.org/download/)
4. **Visual Studio Code** - [Download VS Code](https://code.visualstudio.com/)

## 🔧 Setup Database (MySQL/MariaDB)

### Opsi 1: Otomatis (Recommended)
Aplikasi akan otomatis membuat database dan tabel saat pertama kali dijalankan.

### Opsi 2: Manual
Jika ingin membuat database manual:

```sql
-- Buat database
CREATE DATABASE amsa_pos;

-- Gunakan database
USE amsa_pos;

-- Jalankan aplikasi, tabel akan dibuat otomatis
```

### Konfigurasi Database

Edit file `src/appsettings.json` jika ingin mengubah koneksi database:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=amsa_pos;User=root;Password=root;"
  }
}
```

**Format Connection String:**
- `Server=localhost` - Host MySQL Anda
- `Port=3306` - Port MySQL (default 3306)
- `Database=amsa_pos` - Nama database
- `User=root` - Username MySQL
- `Password=root` - Password MySQL

## 💻 Cara Membuka di Visual Studio Code

### Langkah 1: Buka Project
1. Buka **Visual Studio Code**
2. Klik **File** → **Open Folder** (atau `Ctrl+K Ctrl+O`)
3. Pilih folder `AMSA-POS-Desktop` 
4. VS Code akan memuat project

### Langkah 2: Install Extensions (Jika belum)
VS Code akan merekomendasikan extensions berikut, install semua:
- **C# Dev Kit** (Microsoft)
- **C#** (Microsoft)
- **.NET Extension Pack** (Microsoft)

### Langkah 3: Restore Dependencies
Buka terminal di VS Code (`Ctrl+``) dan jalankan:

```bash
cd src
dotnet restore
```

### Langkah 4: Build & Run

**Opsi A: Menggunakan Terminal**
```bash
cd src
dotnet run
```

**Opsi B: Menggunakan VS Code Debug**
1. Tekan `F5` untuk start debugging
2. Atau klik menu **Run** → **Start Debugging**

**Opsi C: Menggunakan Command Palette**
1. Tekan `Ctrl+Shift+P`
2. Ketik `.NET: Run Project`
3. Enter

## 🔐 Default Login

Setelah aplikasi berjalan, gunakan kredensial berikut:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `cashier1` | `admin123` | Cashier |

## 📁 Struktur Folder

```
AMSA-POS-Desktop/
├── src/
│   ├── App.xaml              # Entry point aplikasi
│   ├── App.xaml.cs
│   ├── appsettings.json      # Konfigurasi database ⚙️
│   ├── Views/                # UI Windows
│   ├── ViewModels/           # Business Logic
│   ├── Models/               # Data Models
│   └── Services/             # Database Services
├── AMSA.POS.Desktop.sln      # Solution file
└── README.md
```

## ❗ Troubleshooting

### Error: "Unable to connect to MySQL"
- Pastikan MySQL/MariaDB sudah running
- Cek username & password di `appsettings.json`
- Pastikan port 3306 tidak diblokir firewall

### Error: ".NET 8.0 not found"
- Install .NET 8.0 SDK dari https://dotnet.microsoft.com/download
- Restart VS Code setelah install

### Error: "Build failed"
```bash
# Clean dan rebuild
dotnet clean
dotnet restore
dotnet build
```

### Error: Database tidak ter-create
- Pastikan user MySQL punya permission CREATE DATABASE
- Atau buat database manual: `CREATE DATABASE amsa_pos;`

## 🎨 Fitur Aplikasi

✅ Point of Sale (POS) dengan UI modern  
✅ Inventory Management  
✅ Purchase Orders  
✅ Customer & Vendor Management  
✅ Sales History & Reports  
✅ User Management  
✅ Dark Theme Modern  
✅ Real-time Clock  
✅ Shopping Cart  

## 📝 Catatan Penting

- Aplikasi ini **hanya berjalan di Windows** (karena menggunakan WPF)
- Database yang digunakan adalah **MySQL/MariaDB** (bukan SQL Server)
- Pastikan MySQL service sudah running sebelum menjalankan aplikasi
- Untuk production, ganti password default di `appsettings.json`

---

**Happy Coding! 🚀**
