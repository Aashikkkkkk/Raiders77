/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Grid, Typography } from '@material-ui/core';
import { ArrowRightAltSharp } from '@material-ui/icons';
import ProductCard from '../reuse/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { privateAxios } from '../../intercepts/axiosIntercepts';
import useAuth from '../../store/useAuth';
import toast from 'react-hot-toast';

const HomeDetails = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const handleClick = (e: Event) => {
    e.stopPropagation();
  };

  const mutation = useMutation({
    mutationKey: ['cart'],

    onError: (error: any) => {
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
      qc.invalidateQueries(['cartitems-data-handler-homepage']);
    },
  });

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartIsError,
  } = useQuery<any, any>({
    queryKey: ['cartitems-data-handler-homepage'],
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
    if (!cartIsError) {
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
    <Container>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Grid container>
            {data?.slice(0, 10)?.map((f: any) => (
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
      </div>
    </Container>
  );
};

export default HomeDetails;
