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

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const params = useParams();
  console.log(params.id);
  const isEdit = params.id ? true : false;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your logic to handle the form submission here
    // For example, you can create a new product object and add it to a list or store it in localStorage
    console.log('Product:', { name, price, image });
    // Reset the form fields
    setName('');
    setPrice('');
    setImage('');
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" align="center" gutterBottom>
            {isEdit ? 'Edit Product' : 'Add Product'}
          </Typography>
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
