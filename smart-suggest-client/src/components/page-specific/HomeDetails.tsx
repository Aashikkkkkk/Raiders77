import { Container, Grid, Snackbar, Typography } from '@material-ui/core';
import { ArrowRightAltSharp } from '@material-ui/icons';
import ProductCard from '../reuse/ProductCard';
import { fruits } from '../../expressions/fruitExp';
import { Link, useNavigate } from 'react-router-dom';
import { Product, CartItem } from '../../pages/AllProductsPage';
import React, { useState } from 'react';
import { Alert } from '@mui/material';
import useTotalNumber from '../../store/useTotalNumber';

const HomeDetails = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useTotalNumber((state) => state.setTotalNo);

  React.useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);
  const handleClick = (e: Event) => {
    e.stopPropagation();
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
      dispatch(updatedCart.length);
    } else {
      const newCart: CartItem[] = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      dispatch(newCart.length);
    }
  };
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Added in cart succssfully
        </Alert>
      </Snackbar>
      <div
        style={{
          padding: '10px 20px',
          position: 'relative',
        }}
      >
        <img
          className="home-details-image"
          src="https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div style={{ position: 'absolute', top: '180px', left: '90px' }}>
          <Typography
            style={{ fontWeight: 'bolder' }}
            color="primary"
            variant="h4"
          >
            Shopping with us for{' '}
          </Typography>
          <Typography
            style={{ fontWeight: 'bolder' }}
            color="primary"
            variant="h4"
          >
            Better Quality and the best
          </Typography>
          <Typography
            style={{ fontWeight: 'bolder' }}
            color="primary"
            variant="h4"
          >
            price
          </Typography>
          <Typography variant="subtitle1">
            We have prepared special discounts for you
          </Typography>
          <Typography style={{ marginTop: '30px' }} variant="h5" color="error">
            
          </Typography>
        </div>

        <div
          className="flex"
          style={{
            justifyContent: 'space-between',
            marginTop: '20px',
            marginBottom: '30px',
          }}
        >
          <Typography variant="body1">Featured Products</Typography>
          <Link
            to="/all-products"
            className="flex"
            style={{ alignItems: 'center' }}
          >
            View All <ArrowRightAltSharp />
          </Link>
        </div>
        <Grid container>
          {fruits.map((f) => (
            <Grid
              onClick={() => navigate('/products/' + f.id)}
              item
              xs={12}
              sm={6}
              md={4}
              lg={2}
            >
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
