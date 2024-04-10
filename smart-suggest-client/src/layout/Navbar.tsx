import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  InputBase,
  Box,
  Container,
} from '@material-ui/core';
import { Search, ShoppingCart, AccountCircle } from '@material-ui/icons';

import { useNavigate } from 'react-router-dom';
import useTotalNumber from '../store/useTotalNumber';
import Logo from '../assets/logo.png';

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
            <img
              onClick={() => navigate('/')}
              alt={Logo}
              style={{ height: '40px' }}
              src={Logo}
            />
            <Box display="flex" alignItems="center">
              <InputBase
                color="primary"
                placeholder="Search for items"
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
