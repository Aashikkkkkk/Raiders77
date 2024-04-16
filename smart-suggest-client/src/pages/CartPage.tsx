/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Layout from '../layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ProductCard from '../components/reuse/ProductCard';

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
  const qc = useQueryClient();

  const [totlaPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEdit, SetIsEdit] = useState(false);
  const [showingData, setShowingData] = useState<any>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const decreaseHandler = (id: number) => {};
  const increaseHandler = (id: number) => {};

  const handleClick = (e: Event) => {
    e.stopPropagation();
  };
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
      qc.invalidateQueries({ queryKey: ['cartitems-data'] });
      qc.invalidateQueries(['cartitems-notification-count']);
      SetIsEdit(false);
    },
  });
  const handleAddToCart = (id: number) => {
    if (!isLoading && !isError) {
      const cart = data?.cartItems;
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
          cartItems: [...updatedCart, { item_uuid: id, quantity: 1 }],
        });
      }
    } else {
      if (!isLoading) {
        mutation.mutate({
          cartItems: [{ item_uuid: id, quantity: 1 }],
        });
      }
    }
  };

  const saveHandler = () => {
    const dataToSave = showingData?.map((el) => {
      return {
        item_uuid: el?.item_uuid,
        quantity: el?.quantity,
      };
    });
    mutation.mutate({
      cartItems: dataToSave,
    });
  };
  const deleteMutate = useMutation({
    mutationKey: 'DeleteCart',
    mutationFn: () => {
      return privateAxios
        .delete(`/api/carts`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    onSuccess: () => {
      toast.success('Successfully deleted');
      qc.invalidateQueries({ queryKey: ['cartitems-data'] });
      qc.invalidateQueries(['cartitems-notification-count']);
    },
    onError: (error: Error) => {
      console.log(error.message);
      toast.error(error.message || 'Something went wrong');
    },
  });
  const clearCart = () => {
    deleteMutate.mutate();
  };
  const itemDeleteHandler = (id: string) => {
    SetIsEdit(true);
    const filterItem = showingData?.filter((el) => el.item_uuid != id);
    setShowingData(filterItem);
  };

  const qtyEditHandler = (id: string, type: string) => {
    SetIsEdit(true);
    if (type === 'increase') {
      const filterItem = showingData?.map((el) => {
        if (el.item_uuid === id && el?.quantity < el?.item?.quantity) {
          return { ...el, quantity: el?.quantity + 1 };
        } else {
          return el;
        }
      });
      setShowingData(filterItem);
    } else {
      const filterItem = showingData?.map((el) => {
        if (el.item_uuid === id && el?.quantity > 1) {
          return { ...el, quantity: el?.quantity - 1 };
        } else {
          return el;
        }
      });
      setShowingData(filterItem);
    }
  };
  const { data, isLoading, isError, error } = useQuery<any, any>({
    queryKey: ['cartitems-data'],
    retry: 1,
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

  useEffect(() => {
    if (data && !isLoading) {
      setShowingData(data?.cartItems);
    }
  }, [data, isLoading]);
  useEffect(() => {
    setTotalPrice(
      data?.cartItems?.reduce(
        (acc, item) => acc + item.item.price * item.quantity,
        0
      )
    );
  }, [data]);

  const checkOutMutate = useMutation({
    mutationKey: 'checkOut',

    mutationFn: () => {
      return privateAxios
        .post(
          '/api/carts/checkout',

          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + useAuth.getState().token,
            },
          }
        )
        .then((res) => res.data);
    },
    onSuccess: () => {
      handleOpen();
      // toast.success('Successfully checked out');
      qc.invalidateQueries({ queryKey: ['cartitems-data'] });
      qc.invalidateQueries(['cartitems-notification-count']);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });

  return (
    <Layout>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Successfull Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your order is checkout successfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="lg" className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Your Cart
        </Typography>
        {isError ? (
          <Typography variant="h5" gutterBottom>
            {error?.response?.data?.message ||
              error?.message ||
              'Something went wrong'}
          </Typography>
        ) : isLoading ? (
          <Typography variant="h5" gutterBottom>
            Loading...
          </Typography>
        ) : (
          <>
            <Grid spacing={3} container>
              <Grid item xs={8}>
                <TableContainer>
                  <Table aria-label="shopping cart">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>

                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Available Quantity</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                       <TableCell align="right">Subtotal</TableCell>
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {showingData?.length <= 0 ? (
                        <Typography style={{ marginTop: '30px' }} variant="h5">
                          Your cart is empty
                        </Typography>
                      ) : (
                        showingData?.map((row) => (
                          <TableRow key={row?.item?.name}>
                            <TableCell
                              style={{
                                display: 'flex',
                                gap: '1px',
                                alignItems: 'center',
                              }}
                            >
                              <Button
                                onClick={() =>
                                  itemDeleteHandler(row?.item?.uuid)
                                }
                              >
                                X
                              </Button>
                              <div>
                                <img
                                  style={{ height: '70px', width: '70px' }}
                                  src={row?.item?.image_url}
                                />
                              </div>
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {row?.item?.name}
                            </TableCell>
                            <TableCell align="right">
                              ${Number(row?.item?.price).toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              {row?.item?.quantity}
                            </TableCell>
                            <TableCell align="center">
                              <ButtonGroup
                                variant="outlined"//this is quantity increase and decrease outline guide
                                aria-label="Basic button group" //quantity visual represnation for user
                              >
                                <Button
                                  onClick={() =>
                                    qtyEditHandler(row?.item?.uuid, 'decrease')
                                  }
                                >
                                  -
                                </Button>
                                <Button
                                  disableElevation
                                  disableRipple
                                  disableTouchRipple
                                >
                                  {row?.quantity}
                                </Button>
                                <Button
                                  onClick={() =>
                                    qtyEditHandler(row?.item?.uuid, 'increase')
                                  }
                                >
                                  +
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                            <TableCell align="right">
                              $
                              {(
                                Number(row?.quantity) * Number(row?.item?.price)
                              ).toFixed(2)}
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
                    <Typography variant="h6">Cart Totals</Typography>
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
                      <Typography>${totlaPrice?.toFixed(2)}</Typography>
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
                      <Typography>${totlaPrice?.toFixed(2)}</Typography>
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
                      disabled={data.cartItems.length === 0}
                      onClick={() => {
                        if (data.cartItems.length > 0) {
                          checkOutMutate.mutate();
                        }
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

            <div>
              <Button
                onClick={clearCart}
                variant="contained"
                style={{ marginTop: '20px' }}
              >
                Clear All
              </Button>
              {isEdit && (
                <>
                  <Button
                    onClick={saveHandler}
                    variant="contained"
                    color="primary"
                    style={{ margin: '20px 0 0 20px' }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      SetIsEdit(false);
                      setShowingData(data?.cartItems);
                    }}
                    variant="contained"
                    color="secondary"
                    style={{ margin: '20px 0 0 20px' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>

            <Divider style={{ margin: '20px 0' }} />

            <Typography variant="h5">Recommended Products</Typography>
            <Grid container>
              {data?.recommendedItems?.length === 0 ? (
                <Typography variant="h6">No recommended products to display</Typography>
              ) : (
                data?.recommendedItems?.map((f) => (
                  <Grid
                    onClick={() => navigate('/products/' + f.uuid)}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                  >
                    <ProductCard
                      handleClick={handleClick}
                      handleCart={handleAddToCart}
                      id={f?.uuid}
                      name={f?.name}
                      price={f?.price?.toString()}
                      img={f?.image_url}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default CartPage;
