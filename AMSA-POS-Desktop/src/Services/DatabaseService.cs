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
            _connectionString = "Server=localhost;Port=3306;Database=db_mypos;User=root;Password=;";
        }

        public IDbConnection CreateConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        public async Task InitializeDatabaseAsync()
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            // Database and tables already exist in db_mypos.sql
            // This method can be used for future migrations if needed
        }
    }
}
