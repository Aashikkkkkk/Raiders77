import { Container, Grid, Snackbar, Typography } from '@material-ui/core';
import Layout from '../layout/Layout';
import ProductCard from '../components/reuse/ProductCard';
import { fruits } from '../expressions/fruitExp';
import { useState } from 'react';
import React from 'react';
import { Alert } from '@mui/material';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const AllProductsPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  React.useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);

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
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
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
    <Layout>
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
      <Container>
        <Typography style={{ margin: '30px 0' }} variant="h4">
          All Products
        </Typography>
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
      </Container>
    </Layout>
  );
};

export default AllProductsPage;
