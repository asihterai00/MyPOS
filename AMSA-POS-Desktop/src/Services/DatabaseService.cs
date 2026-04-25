using System.Data;
using Dapper;
using MySqlConnector;
using AMSA.POS.Desktop.Models;

namespace AMSA.POS.Desktop.Services
{
    public interface IDatabaseService
    {
        IDbConnection CreateConnection();
        Task InitializeDatabaseAsync();
    }

    public interface IProductService
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<int> CreateAsync(Product product);
        Task<int> UpdateAsync(Product product);
        Task<int> DeleteAsync(int id);
        Task UpdateStockAsync(int productId, int quantity);
    }

    public interface ICustomerService
    {
        Task<List<Customer>> GetAllAsync();
        Task<Customer?> GetByIdAsync(int id);
        Task<int> CreateAsync(Customer customer);
        Task<int> UpdateAsync(Customer customer);
        Task<int> DeleteAsync(int id);
    }

    public interface IVendorService
    {
        Task<List<Vendor>> GetAllAsync();
        Task<Vendor?> GetByIdAsync(int id);
        Task<int> CreateAsync(Vendor vendor);
        Task<int> UpdateAsync(Vendor vendor);
        Task<int> DeleteAsync(int id);
    }

    public interface ICategoryService
    {
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<int> CreateAsync(Category category);
        Task<int> UpdateAsync(Category category);
        Task<int> DeleteAsync(int id);
    }

    public interface ISaleService
    {
        Task<List<Sale>> GetAllAsync();
        Task<Sale?> GetByIdAsync(int id);
        Task<int> CreateAsync(Sale sale);
        Task<string> GenerateInvoiceNumberAsync();
    }

    public interface IPurchaseOrderService
    {
        Task<List<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<int> CreateAsync(PurchaseOrder order);
        Task<string> GeneratePONumberAsync();
    }

    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<int> CreateAsync(User user);
        Task<int> UpdateAsync(User user);
        Task<int> DeleteAsync(int id);
        Task<User?> AuthenticateAsync(string username, string password);
    }

    public class DatabaseService : IDatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService()
        {
            // Baca dari appsettings.json atau gunakan default
            _connectionString = "Server=localhost;Port=3306;Database=amsa_pos;User=root;Password=root;";
        }

        public IDbConnection CreateConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        public async Task InitializeDatabaseAsync()
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            // Create Categories table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS categories (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create vendors table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS vendors (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(200) NOT NULL,
                    contact_person VARCHAR(100),
                    phone VARCHAR(20),
                    email VARCHAR(100),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create customers table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS customers (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(200) NOT NULL,
                    phone VARCHAR(20),
                    email VARCHAR(100),
                    address TEXT,
                    points INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create products table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS products (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    sku VARCHAR(50) UNIQUE,
                    name VARCHAR(200) NOT NULL,
                    description TEXT,
                    category_id INT,
                    price DECIMAL(10,2) NOT NULL DEFAULT 0,
                    cost DECIMAL(10,2) DEFAULT 0,
                    stock INT DEFAULT 0,
                    min_stock INT DEFAULT 5,
                    unit VARCHAR(20) DEFAULT 'pcs',
                    image_url VARCHAR(500),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create purchase_orders table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS purchase_orders (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    po_number VARCHAR(50) UNIQUE NOT NULL,
                    vendor_id INT,
                    order_date DATE NOT NULL,
                    expected_date DATE,
                    status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
                    total_amount DECIMAL(10,2) DEFAULT 0,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create purchase_order_items table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS purchase_order_items (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    po_id INT NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    unit_price DECIMAL(10,2) NOT NULL,
                    subtotal DECIMAL(10,2) NOT NULL,
                    received_quantity INT DEFAULT 0,
                    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create users table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(100) NOT NULL,
                    role ENUM('admin', 'cashier', 'manager') DEFAULT 'cashier',
                    is_active BOOLEAN DEFAULT TRUE,
                    last_login TIMESTAMP NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create sales table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS sales (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    invoice_number VARCHAR(50) UNIQUE NOT NULL,
                    customer_id INT,
                    user_id INT,
                    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
                    discount DECIMAL(10,2) DEFAULT 0,
                    tax DECIMAL(10,2) DEFAULT 0,
                    total DECIMAL(10,2) NOT NULL DEFAULT 0,
                    payment_method ENUM('cash', 'card', 'qris', 'transfer') DEFAULT 'cash',
                    payment_status ENUM('paid', 'partial', 'pending') DEFAULT 'paid',
                    amount_paid DECIMAL(10,2) DEFAULT 0,
                    change_amount DECIMAL(10,2) DEFAULT 0,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Create sale_items table
            await connection.ExecuteAsync(@"
                CREATE TABLE IF NOT EXISTS sale_items (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    sale_id INT NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    unit_price DECIMAL(10,2) NOT NULL,
                    subtotal DECIMAL(10,2) NOT NULL,
                    discount DECIMAL(10,2) DEFAULT 0,
                    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Seed default data - Categories
            var categoryCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM categories");
            if (categoryCount == 0)
            {
                await connection.ExecuteAsync(@"
                    INSERT INTO categories (name, description) VALUES 
                    ('Makanan', 'Produk makanan dan snack'),
                    ('Minuman', 'Produk minuman'),
                    ('Elektronik', 'Produk elektronik dan gadget'),
                    ('Pakaian', 'Pakaian dan aksesoris'),
                    ('Kebutuhan Rumah Tangga', 'Perlengkapan rumah tangga')
                ");
            }

            // Seed default data - Vendors
            var vendorCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM vendors");
            if (vendorCount == 0)
            {
                await connection.ExecuteAsync(@"
                    INSERT INTO vendors (name, contact_person, phone, email, address) VALUES 
                    ('PT Sumber Makmur', 'Budi Santoso', '081234567890', 'budi@sumbermakmur.com', 'Jakarta'),
                    ('CV Jaya Abadi', 'Siti Nurhaliza', '081234567891', 'siti@jayaabadi.com', 'Bandung'),
                    ('Toko Elektronik Maju', 'Ahmad Wijaya', '081234567892', 'ahmad@elektronikmaju.com', 'Surabaya')
                ");
            }

            // Seed default data - Customers
            var customerCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM customers");
            if (customerCount == 0)
            {
                await connection.ExecuteAsync(@"
                    INSERT INTO customers (name, phone, email, address, points) VALUES 
                    ('Umum', '-', '-', '-', 0),
                    ('John Doe', '081234567893', 'john@email.com', 'Jakarta Selatan', 100),
                    ('Jane Smith', '081234567894', 'jane@email.com', 'Bandung', 250),
                    ('Bob Williams', '081234567895', 'bob@email.com', 'Surabaya', 50)
                ");
            }

            // Seed default data - Products
            var productCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM products");
            if (productCount == 0)
            {
                await connection.ExecuteAsync(@"
                    INSERT INTO products (sku, name, description, category_id, price, cost, stock, min_stock, unit) VALUES 
                    ('SNK001', 'Keripik Kentang', 'Keripik kentang rasa original 100g', 1, 15000, 10000, 50, 10, 'pcs'),
                    ('SNK002', 'Coklat Batang', 'Coklat susu 50g', 1, 12000, 8000, 100, 20, 'pcs'),
                    ('MNM001', 'Air Mineral 600ml', 'Air mineral kemasan 600ml', 2, 5000, 3000, 200, 50, 'pcs'),
                    ('MNM002', 'Kopi Susu', 'Kopi susu kemasan 250ml', 2, 8000, 5000, 75, 15, 'pcs'),
                    ('MNM003', 'Jus Jeruk', 'Jus jeruk segar 250ml', 2, 10000, 6000, 60, 10, 'pcs'),
                    ('ELK001', 'Mouse Wireless', 'Mouse wireless USB', 3, 85000, 60000, 30, 5, 'pcs'),
                    ('ELK002', 'Keyboard Mechanical', 'Keyboard mechanical RGB', 3, 450000, 350000, 15, 3, 'pcs'),
                    ('PAK001', 'Kaos Polos Hitam', 'Kaos polos cotton 100% L', 4, 50000, 30000, 40, 10, 'pcs'),
                    ('PAK002', 'Topi Baseball', 'Topi baseball adjustable', 4, 35000, 20000, 25, 5, 'pcs'),
                    ('RTH001', 'Sabun Cuci Piring', 'Sabun cuci piring 800ml', 5, 18000, 12000, 80, 20, 'pcs'),
                    ('RTH002', 'Tisu Basah', 'Tisu basah anti bakteri 80 sheets', 5, 12000, 8000, 100, 25, 'pcs')
                ");
            }

            // Seed default data - Users
            var userCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM users");
            if (userCount == 0)
            {
                // Password: admin123 (placeholder hash - aplikasi akan menggunakan simple comparison untuk demo)
                await connection.ExecuteAsync(@"
                    INSERT INTO users (username, password_hash, full_name, role) VALUES 
                    ('admin', 'admin123', 'Administrator', 'admin'),
                    ('cashier1', 'admin123', 'Kasir 1', 'cashier'),
                    ('cashier2', 'admin123', 'Kasir 2', 'cashier')
                ");
            }
        }
    }
}
