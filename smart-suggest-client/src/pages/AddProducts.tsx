import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import Layout from '../layout/Layout';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('');

  const params = useParams();

  const isEdit = params.id ? true : false;

  const { data: singleFruit, isLoading } = useQuery({
    queryKey: ['homepage-list', params.id],
    enabled: isEdit,
    onSuccess: (data: any) => {
      setName(data.name);
      setPrice(data.price);
      setImage(data.image_url);
      setDesc(data.description);
      setQty(data.quantity);
    },
    queryFn: () =>
      privateAxios
        .get(`/api/items/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      editMutation.mutate({
        name,
        price,
        image_url: image,
        description: desc,
        quantity: qty,
      });
    } else {
      mutation.mutate({
        name,
        price,
        image_url: image,
        description: desc,
        quantity: qty,
      });
    }
  };

  const editMutation = useMutation({
    mutationKey: 'edit',
    mutationFn: (data: any) =>
      privateAxios
        .put(`/api/items/${params.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success('Edit successful');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const mutation = useMutation({
    mutationKey: 'add',
    mutationFn: (data: any) =>
      privateAxios
        .post('/api/items', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth.getState().token,
          },
        })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success('Added successful');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" align="center" gutterBottom>
            {isEdit ? 'Edit Product' : 'Add Product'}
          </Typography>
          {isLoading && <p>Loading...</p>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Quantity"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {isEdit ? 'Edit Product' : 'Add Product'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddProductForm;
