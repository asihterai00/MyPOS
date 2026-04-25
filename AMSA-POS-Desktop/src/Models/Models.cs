namespace AMSA.POS.Desktop.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Alias1 { get; set; } = string.Empty;
        public string Alias2 { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int? CategoryId { get; set; }
        public int? VendorId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string PhotoPath { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int DeleteStatus { get; set; }
        public DateTime? DeleteDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        
        // Helper properties for UI
        public decimal Price { get; set; }
        public decimal Stock { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }

    public class ProductUnit
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UnitName { get; set; } = string.Empty;
        public int UnitLevel { get; set; } = 1;
        public decimal ConversionFactor { get; set; } = 1.0000m;
        public bool IsBaseUnit { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal Price { get; set; }
        public decimal Stock { get; set; }
        public decimal MinStock { get; set; }
        public decimal SafetyStock { get; set; }
        public int RedPct { get; set; }
        public int YellowPct { get; set; }
        public int GreenPct { get; set; }
        public string Barcode { get; set; } = string.Empty;
        public int DeleteStatus { get; set; }
        public DateTime? DeleteDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public int DeleteStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public int DeleteStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class Vendor
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public int DeleteStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string PhotoPath { get; set; } = string.Empty;
        public DateTime? LastLogin { get; set; }
        public int TotalLoginSeconds { get; set; }
        public int DeleteStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
    }

    public class UserLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public DateTime LoginTime { get; set; }
        public DateTime? LogoutTime { get; set; }
        public int? DurationSeconds { get; set; }
    }

    public class Purchase
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public int? UserId { get; set; }
        public int? VendorId { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public int DeleteStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<PurchaseItem> Items { get; set; } = new();
    }

    public class PurchaseItem
    {
        public int Id { get; set; }
        public int? PurchaseId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public int DeleteStatus { get; set; }
    }

    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int? CashierId { get; set; }
        public int? CustomerId { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string PayMethod { get; set; } = string.Empty;
        public decimal CashReceived { get; set; }
        public decimal ChangeAmount { get; set; }
        public int DeleteStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<TransactionItem> Items { get; set; } = new();
    }

    public class TransactionItem
    {
        public int Id { get; set; }
        public int? TransactionId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public int DeleteStatus { get; set; }
    }

    // Helper models for backward compatibility with existing code
    public class Sale
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int? CustomerId { get; set; }
        public int? UserId { get; set; }
        public DateTime SaleDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
        public decimal ChangeAmount { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public List<SaleItem> Items { get; set; } = new();
    }

    public class SaleItem
    {
        public int Id { get; set; }
        public int? SaleId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public decimal Discount { get; set; }
    }

    public class PurchaseOrder
    {
        public int Id { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public int? VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<PurchaseOrderItem> Items { get; set; } = new();
    }

    public class PurchaseOrderItem
    {
        public int Id { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }
}
