/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Grid, Typography } from '@material-ui/core';
import Layout from '../layout/Layout';
import ProductCard from '../components/reuse/ProductCard';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  totalQty: number;
}

export interface CartItem extends Product {
  quantity: number;
}

const AllProductsPage = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: fruits, isLoading } = useQuery({
    queryKey: ['homepage-list-all'],
    queryFn: () =>
      privateAxios
        .get(`/api/items`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data),
    retry: 5,
  });

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
      qc.invalidateQueries(['cartitems-notification-count']);
      qc.invalidateQueries(['cartitems-data-handler']);
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
          cartItems: [...updatedCart, { item_uuid: id, quantity: 1 }],
        });
      }
    } else {
      if (!cartLoading) {
        mutation.mutate({
          cartItems: [{ item_uuid: id, quantity: 1 }],
          
        });
      }
    }
  };

  return (
    <Layout>
      <Container>
        <Typography style={{ margin: '30px 0' }} variant="h4">
          All Products
        </Typography>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Grid container spacing={3}>
            {fruits.map((f: any) => (
              <Grid
                onClick={() => navigate('/products/' + f.uuid)}
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
              >
                <ProductCard
                  quantity={f.quantity}
                  handleClick={handleClick}
                  handleCart={handleAddToCart}
                  id={f.uuid}
                  name={f.name}
                  price={f.price.toString()}
                  img={
                    f.image_url ||
                    'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk='
                  }
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default AllProductsPage;
