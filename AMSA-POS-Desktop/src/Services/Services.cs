using System.Data;
using Dapper;
using AMSA.POS.Desktop.Models;

namespace AMSA.POS.Desktop.Services
{
    public class ProductService : IProductService
    {
        private readonly IDatabaseService _dbService;

        public ProductService(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT p.id, p.sku, p.name, p.description, p.price, p.cost, p.stock, p.min_stock, p.unit, p.image_url, p.is_active, p.category_id,
                       c.name as CategoryName 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.Id 
                ORDER BY p.name";
            var products = await connection.QueryAsync<Product, Category, Product>(
                sql,
                (product, category) =>
                {
                    product.CategoryName = category?.Name ?? string.Empty;
                    return product;
                },
                splitOn: "CategoryName"
            );
            return products.ToList();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT p.id, p.sku, p.name, p.description, p.price, p.cost, p.stock, p.min_stock, p.unit, p.image_url, p.is_active, p.category_id,
                       c.name as CategoryName 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.Id 
                WHERE p.id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Product>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Product product)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                INSERT INTO products (name, sku, price, cost, stock, category_id, image_url, description, unit) 
                VALUES (@Name, @Sku, @Price, @Cost, @Stock, @CategoryId, @ImageUrl, @Description, @Unit);
                SELECT LAST_INSERT_ID();";
            return await connection.ExecuteScalarAsync<int>(sql, product);
        }

        public async Task<int> UpdateAsync(Product product)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE products SET 
                    name = @Name, sku = @Sku, price = @Price, cost = @Cost, 
                    stock = @Stock, category_id = @CategoryId, image_url = @ImageUrl,
                    description = @Description, unit = @Unit
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, product);
        }

        public async Task<int> DeleteAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "DELETE FROM products WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task UpdateStockAsync(int productId, int quantity)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE products SET 
                    stock = stock + @Quantity
                WHERE id = @ProductId";
            await connection.ExecuteAsync(sql, new { ProductId = productId, Quantity = quantity });
        }
    }

    public class CustomerService : ICustomerService
    {
        private readonly IDatabaseService _dbService;

        public CustomerService(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<Customer>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM customers ORDER BY name";
            return (await connection.QueryAsync<Customer>(sql)).ToList();
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM customers WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Customer>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Customer customer)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                INSERT INTO customers (name, phone, email, address, points) 
                VALUES (@Name, @Phone, @Email, @Address, @Points);
                SELECT LAST_INSERT_ID();";
            return await connection.ExecuteScalarAsync<int>(sql, customer);
        }

        public async Task<int> UpdateAsync(Customer customer)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE customers SET 
                    name = @Name, phone = @Phone, email = @Email, address = @Address, points = @Points
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, customer);
        }

        public async Task<int> DeleteAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "DELETE FROM customers WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }
    }

    public class VendorService : IVendorService
    {
        private readonly IDatabaseService _dbService;

        public VendorService(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<Vendor>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM vendors ORDER BY name";
            return (await connection.QueryAsync<Vendor>(sql)).ToList();
        }

        public async Task<Vendor?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM vendors WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Vendor>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Vendor vendor)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                INSERT INTO vendors (name, contact_person, phone, email, address) 
                VALUES (@Name, @ContactPerson, @Phone, @Email, @Address);
                SELECT LAST_INSERT_ID();";
            return await connection.ExecuteScalarAsync<int>(sql, vendor);
        }

        public async Task<int> UpdateAsync(Vendor vendor)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE vendors SET 
                    name = @Name, contact_person = @ContactPerson, phone = @Phone, email = @Email, address = @Address
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, vendor);
        }

        public async Task<int> DeleteAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "DELETE FROM vendors WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }
    }

    public class CategoryService : ICategoryService
    {
        private readonly IDatabaseService _dbService;

        public CategoryService(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM categories ORDER BY name";
            return (await connection.QueryAsync<Category>(sql)).ToList();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM categories WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Category>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Category category)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                INSERT INTO categories (name, description) 
                VALUES (@Name, @Description);
                SELECT LAST_INSERT_ID();";
            return await connection.ExecuteScalarAsync<int>(sql, category);
        }

        public async Task<int> UpdateAsync(Category category)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE categories SET 
                    name = @Name, description = @Description
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, category);
        }

        public async Task<int> DeleteAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "DELETE FROM categories WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }
    }

    public class SaleService : ISaleService
    {
        private readonly IDatabaseService _dbService;
        private readonly IProductService _productService;

        public SaleService(IDatabaseService dbService, IProductService productService)
        {
            _dbService = dbService;
            _productService = productService;
        }

        public async Task<List<Sale>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT s.id, s.invoice_number, s.customer_id, s.user_id, s.sale_date, s.subtotal, s.discount, s.tax, s.total, 
                       s.payment_method, s.payment_status, s.amount_paid, s.change_amount, s.notes,
                       c.name as CustomerName 
                FROM sales s 
                LEFT JOIN customers c ON s.customer_id = c.id 
                ORDER BY s.sale_date DESC";
            var sales = await connection.QueryAsync<Sale, Customer, Sale>(
                sql,
                (sale, customer) =>
                {
                    sale.CustomerName = customer?.Name ?? string.Empty;
                    return sale;
                },
                splitOn: "CustomerName"
            );

            var salesList = sales.ToList();
            foreach (var sale in salesList)
            {
                var itemsSql = "SELECT * FROM sale_items WHERE sale_id = @SaleId";
                sale.Items = (await connection.QueryAsync<SaleItem>(itemsSql, new { sale.Id })).ToList();
            }

            return salesList;
        }

        public async Task<Sale?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT s.id, s.invoice_number, s.customer_id, s.user_id, s.sale_date, s.subtotal, s.discount, s.tax, s.total, 
                       s.payment_method, s.payment_status, s.amount_paid, s.change_amount, s.notes,
                       c.name as CustomerName 
                FROM sales s 
                LEFT JOIN customers c ON s.customer_id = c.id 
                WHERE s.id = @Id";
            var sale = await connection.QueryFirstOrDefaultAsync<Sale, Customer, Sale>(
                sql,
                (s, customer) =>
                {
                    s.CustomerName = customer?.Name ?? string.Empty;
                    return s;
                },
                splitOn: "CustomerName"
            );

            if (sale != null)
            {
                var itemsSql = "SELECT * FROM sale_items WHERE sale_id = @SaleId";
                sale.Items = (await connection.QueryAsync<SaleItem>(itemsSql, new { sale.Id })).ToList();
            }

            return sale;
        }

        public async Task<int> CreateAsync(Sale sale)
        {
            using var connection = _dbService.CreateConnection();
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                var invoiceNumber = await GenerateInvoiceNumberAsync();
                sale.InvoiceNumber = invoiceNumber;

                var sql = @"
                    INSERT INTO sales (invoice_number, customer_id, user_id, subtotal, tax, discount, total, payment_method, payment_status, amount_paid, change_amount, notes) 
                    VALUES (@InvoiceNumber, @CustomerId, @UserId, @Subtotal, @Tax, @Discount, @Total, @PaymentMethod, @PaymentStatus, @AmountPaid, @ChangeAmount, @Notes);
                    SELECT LAST_INSERT_ID();";
                
                var saleId = await connection.ExecuteScalarAsync<int>(sql, sale, transaction);
                sale.Id = saleId;

                foreach (var item in sale.Items)
                {
                    var itemSql = @"
                        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal, discount) 
                        VALUES (@SaleId, @ProductId, @Quantity, @Price, @Total, @Discount)";
                    await connection.ExecuteAsync(itemSql, new
                    {
                        SaleId = saleId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = item.Price,
                        Total = item.Total,
                        Discount = item.Discount
                    }, transaction);

                    // Update stock
                    await _productService.UpdateStockAsync(item.ProductId, -item.Quantity);
                }

                transaction.Commit();
                return saleId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<string> GenerateInvoiceNumberAsync()
        {
            var prefix = "INV";
            var date = DateTime.Now.ToString("yyyyMMdd");
            
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT invoice_number FROM sales 
                WHERE invoice_number LIKE @Prefix 
                ORDER BY invoice_number DESC 
                LIMIT 1";
            
            var lastInvoice = await connection.QueryFirstOrDefaultAsync<string>(
                sql, 
                new { Prefix = $"{prefix}{date}%" }
            );

            if (string.IsNullOrEmpty(lastInvoice))
                return $"{prefix}{date}0001";

            var lastNumber = int.Parse(lastInvoice.Substring(lastInvoice.Length - 4));
            return $"{prefix}{date}{(lastNumber + 1):D4}";
        }
    }

    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IDatabaseService _dbService;
        private readonly IProductService _productService;

        public PurchaseOrderService(IDatabaseService dbService, IProductService productService)
        {
            _dbService = dbService;
            _productService = productService;
        }

        public async Task<List<PurchaseOrder>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT po.id, po.po_number, po.vendor_id, po.order_date, po.expected_date, po.status, po.total_amount, po.notes,
                       v.name as VendorName 
                FROM purchase_orders po 
                LEFT JOIN vendors v ON po.vendor_id = v.id 
                ORDER BY po.order_date DESC";
            
            var orders = await connection.QueryAsync<PurchaseOrder, Vendor, PurchaseOrder>(
                sql,
                (order, vendor) =>
                {
                    order.VendorName = vendor?.Name ?? string.Empty;
                    return order;
                },
                splitOn: "VendorName"
            );

            var ordersList = orders.ToList();
            foreach (var order in ordersList)
            {
                var itemsSql = "SELECT * FROM purchase_order_items WHERE po_id = @OrderId";
                order.Items = (await connection.QueryAsync<PurchaseOrderItem>(itemsSql, new { order.Id })).ToList();
            }

            return ordersList;
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT po.id, po.po_number, po.vendor_id, po.order_date, po.expected_date, po.status, po.total_amount, po.notes,
                       v.name as VendorName 
                FROM purchase_orders po 
                LEFT JOIN vendors v ON po.vendor_id = v.id 
                WHERE po.id = @Id";
            
            var order = await connection.QueryFirstOrDefaultAsync<PurchaseOrder, Vendor, PurchaseOrder>(
                sql,
                (o, vendor) =>
                {
                    o.VendorName = vendor?.Name ?? string.Empty;
                    return o;
                },
                splitOn: "VendorName"
            );

            if (order != null)
            {
                var itemsSql = "SELECT * FROM purchase_order_items WHERE po_id = @OrderId";
                order.Items = (await connection.QueryAsync<PurchaseOrderItem>(itemsSql, new { order.Id })).ToList();
            }

            return order;
        }

        public async Task<int> CreateAsync(PurchaseOrder order)
        {
            using var connection = _dbService.CreateConnection();
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                var poNumber = await GeneratePONumberAsync();
                order.PONumber = poNumber;

                var sql = @"
                    INSERT INTO purchase_orders (po_number, vendor_id, order_date, expected_date, status, total_amount, notes) 
                    VALUES (@PONumber, @VendorId, @OrderDate, @ExpectedDate, @Status, @TotalAmount, @Notes);
                    SELECT LAST_INSERT_ID();";
                
                var orderId = await connection.ExecuteScalarAsync<int>(sql, order, transaction);
                order.Id = orderId;

                foreach (var item in order.Items)
                {
                    var itemSql = @"
                        INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, subtotal, received_quantity) 
                        VALUES (@PurchaseOrderId, @ProductId, @Quantity, @Cost, @Total, 0)";
                    await connection.ExecuteAsync(itemSql, new
                    {
                        PurchaseOrderId = orderId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Cost = item.Cost,
                        Total = item.Total
                    }, transaction);
                }

                transaction.Commit();
                return orderId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<string> GeneratePONumberAsync()
        {
            var prefix = "PO";
            var date = DateTime.Now.ToString("yyyyMMdd");
            
            using var connection = _dbService.CreateConnection();
            var sql = @"
                SELECT po_number FROM purchase_orders 
                WHERE po_number LIKE @Prefix 
                ORDER BY po_number DESC 
                LIMIT 1";
            
            var lastPO = await connection.QueryFirstOrDefaultAsync<string>(
                sql, 
                new { Prefix = $"{prefix}{date}%" }
            );

            if (string.IsNullOrEmpty(lastPO))
                return $"{prefix}{date}0001";

            var lastNumber = int.Parse(lastPO.Substring(lastPO.Length - 4));
            return $"{prefix}{date}{(lastNumber + 1):D4}";
        }
    }

    public class UserService : IUserService
    {
        private readonly IDatabaseService _dbService;

        public UserService(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<User>> GetAllAsync()
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM users ORDER BY username";
            return (await connection.QueryAsync<User>(sql)).ToList();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM users WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(User user)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                INSERT INTO users (username, password_hash, full_name, role, is_active) 
                VALUES (@Username, @PasswordHash, @FullName, @Role, @IsActive);
                SELECT LAST_INSERT_ID();";
            return await connection.ExecuteScalarAsync<int>(sql, user);
        }

        public async Task<int> UpdateAsync(User user)
        {
            using var connection = _dbService.CreateConnection();
            var sql = @"
                UPDATE users SET 
                    full_name = @FullName, role = @Role, is_active = @IsActive
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, user);
        }

        public async Task<int> DeleteAsync(int id)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "DELETE FROM users WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            using var connection = _dbService.CreateConnection();
            var sql = "SELECT * FROM users WHERE username = @Username AND is_active = TRUE";
            var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { Username = username });
            
            // Simple password check (in production, use proper hashing)
            if (user != null && user.PasswordHash == password)
                return user;
            
            return null;
        }
    }
}
