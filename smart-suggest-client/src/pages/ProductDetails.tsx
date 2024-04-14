/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from 'react-router-dom';
import Layout from '../layout/Layout';

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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';
import toast from 'react-hot-toast';

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
  const { data: singleFruit, isLoading } = useQuery({
    queryKey: ['homepage-list', id],

    queryFn: () =>
      privateAxios
        .get(`/api/items/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data),
  });

  const [selectedImage, setSelectedImage] = useState(singleFruit?.image_url);
  useEffect(() => {
    setSelectedImage(singleFruit?.image_url);
  }, [singleFruit]);
  const [indexImage, setIndexImage] = useState(0);
  const [initialQty, setInitialQty] = useState(1);

  const handleIncrease = () => {
    if (initialQty < singleFruit?.quantity) {
      setInitialQty(initialQty + 1);
    } else {
      toast.error('Maximum quantity exceeded');
    }
  };

  const handleDecrease = () => {
    if (initialQty > 1) {
      setInitialQty(initialQty - 1);
    } else {
      toast.error('Minimum quantity exceeded');
    }
  };
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['cart'],

    onError: (error: Error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
      );
    },
    mutationFn: (data: any) => {
      return privateAxios
        .post(`/api/carts`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast.success('Added in cart successfully');
      qc.invalidateQueries(['cartitems-notification-count']);
    },
  });
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartIsError,
  } = useQuery<any, any>({
    queryKey: ['cartitems-data-handler'],
    retry: 0,
    queryFn: () => {
      return privateAxios
        .get(`/api/carts`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data);
    },
  });
  const handleAddToCart = (id: number) => {
    if (!cartLoading && !cartIsError) {
      const cart = cartData?.cartItems;
      const item = cart?.filter((item: any) => item.item_uuid === id);

      const updatedCart = cart.map((el) => {
        return {
          item_uuid: el?.item?.uuid,
          quantity: el?.quantity,
        };
      });

      if (item[0]) {
        toast.error('Item already in cart');
      } else {
        mutation.mutate({
          cartItems: [...updatedCart, { item_uuid: id, quantity: initialQty }],
        });
      }
    } else {
      if (!cartLoading) {
        mutation.mutate({
          cartItems: [{ item_uuid: id, quantity: initialQty }],
        });
      }
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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
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
            <Typography variant="subtitle2">{singleFruit?.name}</Typography>
          </div>

          <div style={{ display: 'flex' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                onError={(e) => {
                  e.currentTarget.src =
                    'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';
                }}
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
                    handleImageChange(singleFruit?.image_url);
                  }}
                >
                  <img
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';
                    }}
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
                    handleImageChange(singleFruit?.image_url);
                  }}
                >
                  <img
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';
                    }}
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
                    handleImageChange(singleFruit?.image_url);
                  }}
                >
                  <img
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';
                    }}
                    src={selectedImage}
                    alt="Apple"
                    style={{ maxWidth: '50px' }}
                  />
                </IconButton>
              </Box>
            </Box>

            <Box style={{ flex: 1 }}>
              <Typography variant="h4">{singleFruit?.name}</Typography>
              <Typography variant="subtitle1">Id: {id}</Typography>
              <Typography variant="subtitle1">
                Total Quantity: {singleFruit?.quantity}
              </Typography>
              <Divider style={{ marginTop: '10px' }} />
              <Typography
                style={{ marginTop: '10px' }}
                color="textSecondary"
                variant="subtitle1"
              >
                {singleFruit?.name}
              </Typography>
              <Typography style={{ marginTop: '10px' }} variant="h4">
                $ {singleFruit?.price}
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
                    handleAddToCart(singleFruit?.uuid);
                  }}
                  className={classes.button}
                  variant="contained"
                >
                  <ShoppingBag style={{ marginRight: '5px' }} /> Add to Cart
                </Button>
              </div>
            </Box>
          </div>

          <div style={{ margin: '40px' }}>
            <Typography variant="h5">Description</Typography>
            <Typography style={{ marginTop: '20px' }} variant="body1">
              {singleFruit?.description}
            </Typography>
          </div>
        </Container>
      )}
    </Layout>
  );
};

export default ProductDetails;
