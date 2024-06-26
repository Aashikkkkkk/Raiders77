import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import SignIn from './pages/LoginScreen';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AllProductsPage from './pages/AllProductsPage';
import AdminPage from './pages/AdminPage';
import Register from './pages/RegisterScreen';
import AddProductForm from './pages/AddProducts';
import ProductDetails from './pages/ProductDetails';
import ProfilePage from './pages/ProilePage';
import SearchProducts from './pages/SearchProducts';
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomeScreen />,
    },
    {
      path: '/login',
      element: <SignIn />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/cart',
      element: <CartPage />,
    },
    {
      path: '/checkout',
      element: <CheckoutPage />,
    },
    {
      path: '/all-products',
      element: <AllProductsPage />,
    },
    {
      path: '/admin',
      element: <AdminPage />,
    },
    {
      path: '/groceries',
      element: <AllProductsPage />,
    },
    {
      path: '/add-products',
      element: <AddProductForm />,
    },
    {
      path: '/products/:id',
      element: <ProductDetails />,
    },
    {
      path: '/edit-products/:id',
      element: <AddProductForm />,
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    {
      path: '/search',
      element: <SearchProducts />,
    },
  ]);
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
