import Layout from '../layout/Layout';
import { Container, Typography } from '@material-ui/core';
import useAuth from '../store/useAuth';

const ProfilePage = () => {
  const auth = useAuth((state) => state.user);
  return (
    <Layout>
      <Container>
        <Typography variant="h6">Profile Page</Typography>
        <Typography variant="body1">Name: {auth?.userName}</Typography>
        <Typography variant="body1">Email: {auth?.email}</Typography>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
