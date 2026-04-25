using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using AMSA.POS.Desktop.Views;
using AMSA.POS.Desktop.ViewModels;
using AMSA.POS.Desktop.Services;

namespace AMSA.POS.Desktop
{
    public partial class App : Application
    {
        private readonly IServiceProvider _serviceProvider;

        public App()
        {
            var services = new ServiceCollection();
            ConfigureServices(services);
            _serviceProvider = services.BuildServiceProvider();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Services
            services.AddSingleton<IDatabaseService, DatabaseService>();
            services.AddSingleton<IProductService, ProductService>();
            services.AddSingleton<ICustomerService, CustomerService>();
            services.AddSingleton<IVendorService, VendorService>();
            services.AddSingleton<ICategoryService, CategoryService>();
            services.AddSingleton<ISaleService, SaleService>();
            services.AddSingleton<IPurchaseOrderService, PurchaseOrderService>();
            services.AddSingleton<IUserService, UserService>();

            // ViewModels
            services.AddSingleton<MainWindowViewModel>();

            // Views
            services.AddSingleton<MainWindow>();
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();
        }
    }
}
