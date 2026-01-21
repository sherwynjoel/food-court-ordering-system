import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme/theme';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrderStatusPage from './pages/OrderStatusPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:id" element={<OrderStatusPage />} />
            </Routes>
          </Box>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
