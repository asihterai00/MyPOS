using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using AMSA.POS.Desktop.Models;
using AMSA.POS.Desktop.Services;

namespace AMSA.POS.Desktop.ViewModels
{
    public partial class MainWindowViewModel : ObservableObject
    {
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        private readonly ISaleService _saleService;
        private readonly ICustomerService _customerService;
        private readonly IVendorService _vendorService;
        private readonly IPurchaseOrderService _purchaseOrderService;
        private readonly IUserService _userService;

        [ObservableProperty]
        private string _currentView = "POS";

        [ObservableProperty]
        private string _windowTitle = "AMSA POS - Point of Sale System";

        [ObservableProperty]
        private DateTime _currentDateTime = DateTime.Now;

        [ObservableProperty]
        private List<Product> _products = new();

        [ObservableProperty]
        private List<Category> _categories = new();

        [ObservableProperty]
        private Category? _selectedCategory;

        [ObservableProperty]
        private Product? _selectedProduct;

        [ObservableProperty]
        private ObservableCollection<CartLine> _cartLines = new();

        [ObservableProperty]
        private Customer? _selectedCustomer;

        [ObservableProperty]
        private decimal _subtotal;

        [ObservableProperty]
        private decimal _tax;

        [ObservableProperty]
        private decimal _discount;

        [ObservableProperty]
        private decimal _total;

        [ObservableProperty]
        private string _searchQuery = string.Empty;

        [ObservableProperty]
        private bool _isProcessing;

        [ObservableProperty]
        private string? _statusMessage;

        public MainWindowViewModel(
            IProductService productService,
            ICategoryService categoryService,
            ISaleService saleService,
            ICustomerService customerService,
            IVendorService vendorService,
            IPurchaseOrderService purchaseOrderService,
            IUserService userService)
        {
            _productService = productService;
            _categoryService = categoryService;
            _saleService = saleService;
            _customerService = customerService;
            _vendorService = vendorService;
            _purchaseOrderService = purchaseOrderService;
            _userService = userService;

            // Start clock
            UpdateClock();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            try
            {
                Products = await _productService.GetAllAsync();
                Categories = await _categoryService.GetAllAsync();
                
                if (Categories.Any())
                    SelectedCategory = Categories[0];
            }
            catch (Exception ex)
            {
                StatusMessage = $"Error loading data: {ex.Message}";
            }
        }

        [RelayCommand]
        private void UpdateClock()
        {
            CurrentDateTime = DateTime.Now;
        }

        [RelayCommand]
        private void SetView(string viewName)
        {
            CurrentView = viewName;
        }

        [RelayCommand]
        private void FilterByCategory(Category? category)
        {
            SelectedCategory = category;
            // Filtering logic would go here
        }

        [RelayCommand]
        private void AddToCart(Product? product)
        {
            if (product == null) return;

            var existingLine = CartLines.FirstOrDefault(c => c.ProductId == product.Id);
            if (existingLine != null)
            {
                existingLine.Quantity++;
                existingLine.Total = existingLine.Quantity * existingLine.Price;
            }
            else
            {
                CartLines.Add(new CartLine
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Price = product.Price,
                    Quantity = 1,
                    Total = product.Price
                });
            }

            CalculateTotals();
        }

        [RelayCommand]
        private void RemoveFromCart(CartLine? line)
        {
            if (line != null && CartLines.Contains(line))
            {
                CartLines.Remove(line);
                CalculateTotals();
            }
        }

        [RelayCommand]
        private void ClearCart()
        {
            CartLines.Clear();
            CalculateTotals();
        }

        private void CalculateTotals()
        {
            Subtotal = CartLines.Sum(c => c.Total);
            Tax = Subtotal * 0.11m; // 11% tax
            Discount = 0;
            Total = Subtotal + Tax - Discount;
        }

        [RelayCommand]
        private async Task ProcessSaleAsync()
        {
            if (!CartLines.Any())
            {
                StatusMessage = "Cart is empty!";
                return;
            }

            try
            {
                IsProcessing = true;
                StatusMessage = "Processing sale...";

                var sale = new Sale
                {
                    CustomerId = SelectedCustomer?.Id ?? 0,
                    Subtotal = Subtotal,
                    Tax = Tax,
                    Discount = Discount,
                    Total = Total,
                    PaymentMethod = "Cash",
                    Status = "Completed",
                    Items = CartLines.Select(c => new SaleItem
                    {
                        ProductId = c.ProductId,
                        ProductName = c.ProductName,
                        Quantity = c.Quantity,
                        Price = c.Price,
                        Total = c.Total
                    }).ToList()
                };

                await _saleService.CreateAsync(sale);

                StatusMessage = $"Sale completed! Invoice: {sale.InvoiceNumber}";
                ClearCart();
                
                // Reload products to update stock
                Products = await _productService.GetAllAsync();
            }
            catch (Exception ex)
            {
                StatusMessage = $"Error processing sale: {ex.Message}";
            }
            finally
            {
                IsProcessing = false;
            }
        }

        [RelayCommand]
        private void SearchProducts()
        {
            // Search logic would go here
        }
    }

    public partial class CartLine : ObservableObject
    {
        [ObservableProperty]
        private int _productId;

        [ObservableProperty]
        private string _productName = string.Empty;

        [ObservableProperty]
        private decimal _price;

        [ObservableProperty]
        private int _quantity;

        [ObservableProperty]
        private decimal _total;
    }
}
