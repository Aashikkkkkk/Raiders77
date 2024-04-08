import { Container, Grid, Snackbar } from '@material-ui/core';
import { ArrowRightAltSharp } from '@material-ui/icons';
import ProductCard from '../reuse/ProductCard';
import { fruits } from '../../expressions/fruitExp';
import { Link } from 'react-router-dom';
import { Product, CartItem } from '../../pages/AllProductsPage';
import React, { useState } from 'react';
import { Alert } from '@mui/material';

const HomeDetails = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);
  const handleClick = () => {
    setOpen(true);
  };
  const handleAddToCart = (id: number, product: Product) => {
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newCart: CartItem[] = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Added succssfully
        </Alert>
      </Snackbar>
      <div
        style={{
          padding: '10px 20px',
        }}
      >
        <img
          className="home-details-image"
          src="https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />

        <div
          className="flex"
          style={{ justifyContent: 'space-between', marginTop: '20px' }}
        >
          <p>New Products</p>
          <Link
            to="/all-products"
            className="flex"
            style={{ alignItems: 'center' }}
          >
            View All <ArrowRightAltSharp />
          </Link>
        </div>
        <Grid container spacing={3}>
          {fruits.map((f) => (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <ProductCard
                handleClick={handleClick}
                handleCart={handleAddToCart}
                id={f.id}
                name={f.name}
                price={f.price.toString()}
                img={f.image}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default HomeDetails;
