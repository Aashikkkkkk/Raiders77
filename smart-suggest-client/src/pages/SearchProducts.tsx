/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Grid, Typography } from '@material-ui/core';
import Layout from '../layout/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';
import ProductCard from '../components/reuse/ProductCard';
import toast from 'react-hot-toast';

const SearchProducts = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchTerm = new URLSearchParams(search).get('name') || '';

  const { data, isLoading, isError, error } = useQuery(['homepage-list-search', searchTerm], () =>
    privateAxios.get(`/api/items/search?name=${searchTerm}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useAuth.getState().token,
      },
    }).then((res) => res.data.items), // Access the items array directly from the response
    {
      onError: (err) => {
        console.error('API call error:', err);
        toast.error('Failed to fetch data. Please try again.');
      }
    }
  );

  const qc = useQueryClient();
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartIsError,
  } = useQuery<any, any>({
    queryKey: ['cartitems-data-handler'],
    retry: 0,
    queryFn: () =>
      privateAxios.get(`/api/carts`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + useAuth.getState().token,
        },
      }).then((res) => res.data)
  });

  const mutation = useMutation({
    mutationKey: ['cart'],
    onError: (error: Error) => {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        'Something went wrong'
      );
    },
    mutationFn: (data: any) =>
      privateAxios.post(`/api/carts`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + useAuth.getState().token,
        },
      }).then((res) => res.data),
    onSuccess: () => {
      toast.success('Added in cart successfully');
      qc.invalidateQueries(['cartitems-notification-count']);
      qc.invalidateQueries(['cartitems-data-handler']);
    },
  });

  const handleAddToCart = (id: string) => {
    if (!cartLoading && !cartIsError) {
      const cart = cartData?.cartItems;
      const item = cart?.find((item: any) => item.item_uuid === id);

      if (item) {
        toast.error('Item already in cart');
      } else {
        mutation.mutate({
          cartItems: [...cart, { item_uuid: id, quantity: 1 }],
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Container>
          <Typography>Error: {error?.message || 'Unknown error'}</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Typography style={{ marginTop: '30px' }} variant="h5">
          Search Products
        </Typography>
        <Typography>Result for "{searchTerm}"</Typography>
        {data && data.length > 0 ? (
          <Grid style={{ marginTop: '30px' }} container>
            {data.map((f: any) => (
              <Grid
                key={f.uuid}
                onClick={() => navigate('/products/' + f.uuid)}
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
              >
                <ProductCard
                  quantity={f.quantity}
                  handleClick={() => {}}
                  handleCart={() => handleAddToCart(f.uuid)}
                  id={f.uuid}
                  name={f.name}
                  price={f.price.toString()}
                  img={f.image_url || 'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk='}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No products found for "{searchTerm}".</Typography>
        )}
      </Container>
    </Layout>
  );
};

export default SearchProducts;
