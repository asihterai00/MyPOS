-- =====================================================
-- AMSA POS Database - MySQL/MariaDB
-- Database: amsa_pos
-- User: root / Password: root
-- =====================================================

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `amsa_pos` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `amsa_pos`;

-- =====================================================
-- TABEL: categories
-- =====================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: vendors
-- =====================================================
DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `contact_person` VARCHAR(100),
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `address` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: customers
-- =====================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `address` TEXT,
    `points` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: products
-- =====================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sku` VARCHAR(50) UNIQUE,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `category_id` INT,
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `cost` DECIMAL(10,2) DEFAULT 0,
    `stock` INT DEFAULT 0,
    `min_stock` INT DEFAULT 5,
    `unit` VARCHAR(20) DEFAULT 'pcs',
    `image_url` VARCHAR(500),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: purchase_orders
-- =====================================================
DROP TABLE IF EXISTS `purchase_orders`;
CREATE TABLE `purchase_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `po_number` VARCHAR(50) UNIQUE NOT NULL,
    `vendor_id` INT,
    `order_date` DATE NOT NULL,
    `expected_date` DATE,
    `status` ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
    `total_amount` DECIMAL(10,2) DEFAULT 0,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: purchase_order_items
-- =====================================================
DROP TABLE IF EXISTS `purchase_order_items`;
CREATE TABLE `purchase_order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `po_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `received_quantity` INT DEFAULT 0,
    FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: users
-- =====================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'cashier', 'manager') DEFAULT 'cashier',
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: sales
-- =====================================================
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `invoice_number` VARCHAR(50) UNIQUE NOT NULL,
    `customer_id` INT,
    `user_id` INT,
    `sale_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(10,2) DEFAULT 0,
    `tax` DECIMAL(10,2) DEFAULT 0,
    `total` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `payment_method` ENUM('cash', 'card', 'qris', 'transfer') DEFAULT 'cash',
    `payment_status` ENUM('paid', 'partial', 'pending') DEFAULT 'paid',
    `amount_paid` DECIMAL(10,2) DEFAULT 0,
    `change_amount` DECIMAL(10,2) DEFAULT 0,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABEL: sale_items
-- =====================================================
DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `discount` DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SEED DATA: Categories
-- =====================================================
INSERT INTO `categories` (`name`, `description`) VALUES
('Makanan', 'Produk makanan dan snack'),
('Minuman', 'Produk minuman'),
('Elektronik', 'Produk elektronik dan gadget'),
('Pakaian', 'Pakaian dan aksesoris'),
('Kebutuhan Rumah Tangga', 'Perlengkapan rumah tangga');

-- =====================================================
-- SEED DATA: Vendors
-- =====================================================
INSERT INTO `vendors` (`name`, `contact_person`, `phone`, `email`, `address`) VALUES
('PT Sumber Makmur', 'Budi Santoso', '081234567890', 'budi@sumbermakmur.com', 'Jakarta'),
('CV Jaya Abadi', 'Siti Nurhaliza', '081234567891', 'siti@jayaabadi.com', 'Bandung'),
('Toko Elektronik Maju', 'Ahmad Wijaya', '081234567892', 'ahmad@elektronikmaju.com', 'Surabaya');

-- =====================================================
-- SEED DATA: Customers
-- =====================================================
INSERT INTO `customers` (`name`, `phone`, `email`, `address`, `points`) VALUES
('Umum', '-', '-', '-', 0),
('John Doe', '081234567893', 'john@email.com', 'Jakarta Selatan', 100),
('Jane Smith', '081234567894', 'jane@email.com', 'Bandung', 250),
('Bob Williams', '081234567895', 'bob@email.com', 'Surabaya', 50);

-- =====================================================
-- SEED DATA: Products
-- =====================================================
INSERT INTO `products` (`sku`, `name`, `description`, `category_id`, `price`, `cost`, `stock`, `min_stock`, `unit`) VALUES
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
('RTH002', 'Tisu Basah', 'Tisu basah anti bakteri 80 sheets', 5, 12000, 8000, 100, 25, 'pcs');

-- =====================================================
-- SEED DATA: Users
-- Password default: admin123 (hash sederhana untuk demo)
-- Dalam produksi, gunakan password hashing yang lebih aman
-- =====================================================
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `role`) VALUES
('admin', '$2a$10$XQxvN8h3F5z1K2p9L4m6nO.qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6', 'Administrator', 'admin'),
('cashier1', '$2a$10$XQxvN8h3F5z1K2p9L4m6nO.qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6', 'Kasir 1', 'cashier'),
('cashier2', '$2a$10$XQxvN8h3F5z1K2p9L4m6nO.qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6', 'Kasir 2', 'cashier');

-- Catatan: Untuk simplicity dalam demo, password hash di atas adalah placeholder
-- Aplikasi C# akan menggunakan verifikasi password sederhana atau implementasi BCrypt

-- =====================================================
-- VIEW: Product Stock Summary
-- =====================================================
DROP VIEW IF EXISTS `v_product_stock`;
CREATE VIEW `v_product_stock` AS
SELECT 
    p.id,
    p.sku,
    p.name,
    c.name as category_name,
    p.price,
    p.cost,
    p.stock,
    p.min_stock,
    CASE 
        WHEN p.stock <= p.min_stock THEN 'Low Stock'
        WHEN p.stock = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- =====================================================
-- VIEW: Sales Summary
-- =====================================================
DROP VIEW IF EXISTS `v_sales_summary`;
CREATE VIEW `v_sales_summary` AS
SELECT 
    s.id,
    s.invoice_number,
    s.sale_date,
    cu.name as customer_name,
    u.username as cashier,
    s.subtotal,
    s.discount,
    s.tax,
    s.total,
    s.payment_method,
    s.payment_status
FROM sales s
LEFT JOIN customers cu ON s.customer_id = cu.id
LEFT JOIN users u ON s.user_id = u.id
ORDER BY s.sale_date DESC;

-- =====================================================
-- TRIGGER: Update Stock After Sale
-- =====================================================
DROP TRIGGER IF EXISTS `trg_update_stock_after_sale`;
DELIMITER //
CREATE TRIGGER `trg_update_stock_after_sale`
AFTER INSERT ON `sale_items`
FOR EACH ROW
BEGIN
    UPDATE `products`
    SET `stock` = `stock` - NEW.quantity
    WHERE `id` = NEW.product_id;
END//
DELIMITER ;

-- =====================================================
-- TRIGGER: Update Stock After Purchase Order Received
-- =====================================================
DROP TRIGGER IF EXISTS `trg_update_stock_after_po`;
DELIMITER //
CREATE TRIGGER `trg_update_stock_after_po`
AFTER UPDATE ON `purchase_order_items`
FOR EACH ROW
BEGIN
    IF NEW.received_quantity > OLD.received_quantity THEN
        UPDATE `products`
        SET `stock` = `stock` + (NEW.received_quantity - OLD.received_quantity)
        WHERE `id` = NEW.product_id;
    END IF;
END//
DELIMITER ;

-- =====================================================
-- SEED DATA: Sample Sales (Optional)
-- =====================================================
-- Uncomment jika ingin menambahkan data penjualan contoh
/*
INSERT INTO `sales` (`invoice_number`, `customer_id`, `user_id`, `subtotal`, `discount`, `tax`, `total`, `payment_method`, `amount_paid`, `change_amount`) VALUES
('INV-20250101-001', 1, 2, 25000, 0, 0, 25000, 'cash', 30000, 5000),
('INV-20250101-002', 2, 2, 95000, 5000, 0, 90000, 'qris', 90000, 0);

INSERT INTO `sale_items` (`sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1, 1, 15000, 15000),
(1, 3, 2, 5000, 10000),
(2, 6, 1, 85000, 85000),
(2, 2, 1, 12000, 12000);
*/

-- =====================================================
-- SELESAI
-- Database siap digunakan!
-- =====================================================
