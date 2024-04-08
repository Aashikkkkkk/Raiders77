import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  InputBase,
  Box,
  Container,
} from '@material-ui/core';
import { Search, ShoppingCart, AccountCircle } from '@material-ui/icons';

import { useNavigate } from 'react-router-dom';
import useTotalNumber from '../store/useTotalNumber';

const Navbar = () => {
  const cartItemsLength = useTotalNumber((state) => state.totalNo);

  const navigate = useNavigate();
  return (
    <>
      <AppBar
        style={{ borderBottom: '1px solid #eee' }}
        position="static"
        color="inherit"
        elevation={0}
      >
        <Container>
          <Toolbar>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
              variant="h6"
            >
              Smart Suggest
            </Typography>
            <Box display="flex" alignItems="center">
              <InputBase
                color="primary"
                placeholder="Search for products, categories or brands..."
                style={{
                  marginLeft: 60,
                  width: 650,
                  background: '#eee',
                  padding: '5px 14px',
                }}
              />
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton
                onClick={() => {
                  navigate('/login');
                }}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <IconButton
                onClick={() => {
                  navigate('/cart');
                }}
                color="inherit"
              >
                <Badge badgeContent={cartItemsLength} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
