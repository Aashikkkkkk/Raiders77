import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  InputBase,
  Box,
  Container,
  Button,
} from '@material-ui/core';
import { Search, ShoppingCart, AccountCircle } from '@material-ui/icons';

import { useNavigate } from 'react-router-dom';

import Logo from '../assets/logo.png';
import useAuth from '../store/useAuth';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';

const Navbar = () => {
  const auth = useAuth((state: { token: string | null }) => state.token);

  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartIsError,
  } = useQuery<any, any>({
    queryKey: ['cartitems-notification-count'],
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                color="primary"
                placeholder="Search for items"
                style={{
                  marginLeft: 60,
                  width: 650,
                  background: '#eee',
                  padding: '5px 14px',
                }}
              />
              <IconButton
                onClick={() => {
                  if (searchQuery) {
                    navigate(`/search?name=${searchQuery}`);
                  }
                }}
                color="inherit"
              >
                <Search />
              </IconButton>
              <IconButton
                onClick={() => {
                  auth
                    ? user.isAdmin
                      ? navigate('/admin')
                      : navigate('/profile')
                    : navigate('/login');
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
                <Badge
                  badgeContent={
                    !cartLoading && !cartIsError
                      ? cartData?.cartItems?.length
                      : 0
                  }
                  color="secondary"
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
              {auth && <Button onClick={logout}>Logout</Button>}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
