import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
} from '@material-ui/core';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartItem } from './AllProductsPage';
import { Delete } from '@material-ui/icons';
import useTotalNumber from '../store/useTotalNumber';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 100,
  },
  totalSection: {
    marginTop: theme.spacing(3),
  },
}));

const CartPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useTotalNumber((state) => state.setTotalNo);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {cartItems.map((item) => (
              <Card key={item.id} className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={item.image}
                  title={item.name}
                />
                <CardContent className={classes.cardDetails}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Button onClick={() => removeFromCart(item.id)}>
                      <Delete />
                    </Button>
                  </div>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {item.quantity}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
        <Divider className={classes.totalSection} />
        <Grid
          container
          justifyContent="flex-end"
          className={classes.totalSection}
        >
          <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="flex-end"
          className={classes.totalSection}
        >
          <Button
            onClick={() => {
              navigate('/checkout');
            }}
            variant="contained"
            color="primary"
          >
            Checkout
          </Button>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CartPage;
