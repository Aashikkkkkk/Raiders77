import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Box,
  Snackbar,
} from '@material-ui/core';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartItem, Product } from './AllProductsPage';

import useTotalNumber from '../store/useTotalNumber';
import ProductCard from '../components/reuse/ProductCard';
import { fruits } from '../expressions/fruitExp';
import { Alert } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  total: {
    padding: '20px 30px',
  },
  button: {
    width: '100%',
    margin: '20px 0 10px 0',
    backgroundColor: 'green',
    color: 'white',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
}));

const CartPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useTotalNumber((state) => state.setTotalNo);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { clearAll } = useTotalNumber((state) => state);
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cartItems);
  }, []);
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const removeFromCart = (id: number) => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartItems.filter((item: CartItem) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    dispatch(updatedCart.length);
  };
  const decreaseHandler = (id: number) => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartItems.map((item: CartItem) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };
  const [open, setOpen] = useState(false);
  const handleClick = (e: Event) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleAddToCart = (id: number, product: Product) => {
    const existingProduct = cartItems.find((item) => item.id === id);

    if (existingProduct) {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      dispatch(updatedCart.length);
    } else {
      const newCart: CartItem[] = [...cartItems, { ...product, quantity: 1 }];
      setCartItems(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      dispatch(newCart.length);
    }
  };

  const clearCart = () => {
    clearAll();
    setCartItems([]);
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
  const increaseHandler = (id: number) => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cartItems.map((item: CartItem) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };
  function createData(
    name: string,
    price: number,
    quantity: number,
    image: string,
    id: number
  ) {
    return { name, price, quantity, subtotal: price * quantity, image, id };
  }

  const rows = cartItems.map((product) =>
    createData(
      product.name,
      product.price,
      product.quantity,
      product.image,
      product.id
    )
  );
  return (
    <Layout>
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
      <Container maxWidth="lg" className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Your Cart
        </Typography>

        <Grid spacing={3} container>
          <Grid item xs={8}>
            <TableContainer>
              <Table aria-label="shopping cart">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>

                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>

                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length <= 0 ? (
                    <Typography style={{ marginTop: '30px' }} variant="h5">
                      Your cart is empty
                    </Typography>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell
                          style={{
                            display: 'flex',
                            gap: '1px',
                            alignItems: 'center',
                          }}
                        >
                          <Button onClick={() => removeFromCart(row.id)}>
                            X
                          </Button>
                          <div>
                            <img
                              style={{ height: '70px', width: '70px' }}
                              src={row.image}
                            />
                          </div>
                        </TableCell>

                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">
                          ${row.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <ButtonGroup
                            variant="outlined"
                            aria-label="Basic button group"
                          >
                            <Button onClick={() => decreaseHandler(row.id)}>
                              -
                            </Button>
                            <Button
                              disableElevation
                              disableRipple
                              disableTouchRipple
                            >
                              {row.quantity}
                            </Button>
                            <Button onClick={() => increaseHandler(row.id)}>
                              +
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                        <TableCell align="right">
                          ${row.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={4}>
            <Box className={classes.total} component={Paper}>
              <Box>
                <Typography variant="h6">Cart totals</Typography>
                <div
                  style={{
                    marginTop: '20px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="textSecondary" variant="body1">
                    Subtotal:
                  </Typography>
                  <Typography>${total.toFixed(2)}</Typography>
                </div>

                <Divider />
                <div
                  style={{
                    marginTop: '20px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="textSecondary" variant="body1">
                    Total:
                  </Typography>
                  <Typography>${total.toFixed(2)}</Typography>
                </div>
                <Divider />
              </Box>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    if (cartItems.length > 0) navigate('/checkout');
                  }}
                  variant="contained"
                  className={classes.button}
                >
                  Proceed to checkout
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>

        <Button
          onClick={clearCart}
          variant="contained"
          style={{ marginTop: '20px' }}
        >
          Clear All
        </Button>
        <Divider style={{ margin: '20px 0' }} />

        <Typography variant="h5">Recommended Products</Typography>
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
      </Container>
    </Layout>
  );
};

export default CartPage;
