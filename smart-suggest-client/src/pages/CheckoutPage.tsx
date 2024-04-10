/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  Box,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Layout from '../layout/Layout';
import useTotalNumber from '../store/useTotalNumber';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  summary: {
    marginTop: theme.spacing(3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  successIcon: {
    fontSize: 80,
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const CheckoutPage = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { clearAll } = useTotalNumber((state) => state);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsOrderPlaced(true);
      clearAll();
    }, 2000);
  };

  const handleModalClose = () => {
    setIsOrderPlaced(false);
  };

  const total = 99.99; // Replace with your actual total

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            type="username"
            id="username"
          />
          <TextField
            type="email"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="address"
            label="Address"
            type="address"
            id="address"
          />
          <Button
            style={{ marginTop: '30px' }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Place Order'}
          </Button>
        </Box>
        <Card className={classes.summary}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body1">Total: ${total.toFixed(2)}</Typography>
          </CardContent>
        </Card>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className={classes.modal}
          open={isOrderPlaced}
          onClose={handleModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isOrderPlaced}>
            <Box className={classes.modalContent}>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleModalClose}
              >
                <CloseIcon />
              </IconButton>
              <CheckCircleOutlineIcon className={classes.successIcon} />
              <Typography variant="h5" id="modal-title" gutterBottom>
                Order Placed Successfully
              </Typography>
              <Typography variant="body1" id="modal-description">
                Thank you for your order!
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
