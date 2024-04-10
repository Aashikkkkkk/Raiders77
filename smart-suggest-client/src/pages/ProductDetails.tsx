import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import { fruits } from '../expressions/fruitExp';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { ShoppingBag } from '@mui/icons-material';
import { CartItem } from './AllProductsPage';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  total: {
    padding: '20px 30px',
  },
  button: {
    backgroundColor: 'green',
    color: 'white',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },
}));
const ProductDetails = () => {
  const classes = useStyles();
  const params = useParams();

  const { id } = params;
  const singleFruit = fruits.filter((fruit) => fruit.id === Number(id))[0];
  const [selectedImage, setSelectedImage] = useState(singleFruit.image);
  const [indexImage, setIndexImage] = useState(0);
  const [initialQty, setInitialQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);

  const handleIncrease = () => {
    setInitialQty(initialQty + 1);
  };

  const handleDecrease = () => {
    if (initialQty > 1) {
      setInitialQty(initialQty - 1);
    }
  };
  const navigate = useNavigate();

  const handleCart = () => {
    const existingProduct = cart.find((item) => item.id === Number(id));

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === Number(id)
          ? { ...item, quantity: item.quantity + initialQty }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newCart: CartItem[] = [
        ...cart,
        { quantity: initialQty, ...singleFruit },
      ];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const handleImageChange = (image: string) => {
    setSelectedImage(image);
  };
  return (
    <Layout>
      <div style={{ borderBottom: '1px solid #eee' }}>
        <Container>
          <div>
            <div
              style={{
                gap: '20px',
                padding: '10px 20px',
              }}
              className="flex"
            >
              <Link to="/">Home</Link>
              <Link to="/groceries">Groceries</Link>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div
          style={{
            gap: '20px',
            padding: '10px 20px',
            color: 'gray',
            alignItems: 'center',
          }}
          className="flex"
        >
          <Link to="/">Home &gt;</Link>
          <Link to="/groceries">Groceries &gt;</Link>
          <Typography variant="subtitle2">{singleFruit.name}</Typography>
        </div>

        <div style={{ display: 'flex' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={selectedImage}
              alt="Apple"
              style={{ maxWidth: '500px' }}
            />
            <Box style={{ display: 'flex', marginLeft: '100px' }} mt={2}>
              <IconButton
                style={{
                  border: indexImage === 0 ? '1px solid blue' : '',
                  borderRadius: 0,
                }}
                onClick={() => {
                  setIndexImage(0);
                  handleImageChange(singleFruit.image);
                }}
              >
                <img
                  src={selectedImage}
                  alt="Apple"
                  style={{ maxWidth: '50px' }}
                />
              </IconButton>
              <IconButton
                style={{
                  border: indexImage === 1 ? '1px solid blue' : '',
                  borderRadius: 0,
                }}
                onClick={() => {
                  setIndexImage(1);
                  handleImageChange(singleFruit.image);
                }}
              >
                <img
                  src={selectedImage}
                  alt="Apple"
                  style={{ maxWidth: '50px' }}
                />
              </IconButton>
              <IconButton
                style={{
                  border: indexImage === 2 ? '1px solid blue' : '',
                  borderRadius: 0,
                }}
                onClick={() => {
                  setIndexImage(2);
                  handleImageChange(singleFruit.image);
                }}
              >
                <img
                  src={selectedImage}
                  alt="Apple"
                  style={{ maxWidth: '50px' }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box style={{ flex: 1 }}>
            <Typography variant="h4">{singleFruit.name}</Typography>
            <Typography variant="subtitle1">Id: {id}</Typography>
            <Divider style={{ marginTop: '10px' }} />
            <Typography
              style={{ marginTop: '10px' }}
              color="textSecondary"
              variant="subtitle1"
            >
              {singleFruit.name}
            </Typography>
            <Typography style={{ marginTop: '10px' }} variant="h4">
              $ {singleFruit.price}
            </Typography>
            <Divider style={{ marginTop: '10px' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '30px',
              }}
            >
              <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={handleDecrease}>-</Button>
                <Button disableElevation disableRipple disableTouchRipple>
                  {initialQty}
                </Button>
                <Button onClick={handleIncrease}>+</Button>
              </ButtonGroup>

              <Button
                onClick={() => {
                  handleCart();
                  navigate('/cart');
                }}
                className={classes.button}
                variant="contained"
              >
                <ShoppingBag style={{ marginRight: '5px' }} /> Add to Cart
              </Button>
            </div>
          </Box>
        </div>
      </Container>
    </Layout>
  );
};

export default ProductDetails;
