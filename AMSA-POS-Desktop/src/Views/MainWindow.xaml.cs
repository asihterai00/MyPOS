using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using MahApps.Metro.Controls;
using AMSA.POS.Desktop.ViewModels;
using AMSA.POS.Desktop.Models;

namespace AMSA.POS.Desktop.Views
{
    public partial class MainWindow : MetroWindow
    {
        private MainWindowViewModel? _viewModel;

        public MainWindow(MainWindowViewModel viewModel)
        {
            InitializeComponent();
            _viewModel = viewModel;
            DataContext = viewModel;
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            if (_viewModel != null)
            {
                await _viewModel.LoadDataCommand.ExecuteAsync(null);
            }
        }

        private void AddProductButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.DataContext is Product product && _viewModel != null)
            {
                _viewModel.AddToCartCommand.Execute(product);
            }
        }

        private void ProductCard_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (sender is Border border && border.DataContext is Product product && _viewModel != null)
            {
                _viewModel.AddToCartCommand.Execute(product);
            }
        }
    }
}
