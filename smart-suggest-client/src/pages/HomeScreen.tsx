import { Container } from '@material-ui/core';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import HomeDetails from '../components/page-specific/HomeDetails';
import { useQuery } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';

const HomeScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['homepage-list'],
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

  return (
    <Layout>
      <div style={{ borderBottom: '1px solid #eee' }}>
        <Container>
          <div>
            <div
              style={{
                gap: '20px',
                padding: '10px 20px',
              }}
              className="flex"
            >
              <Link to="/">Home</Link>
              <Link to="/groceries">Groceries</Link>
            </div>
          </div>
        </Container>
      </div>

      <HomeDetails isLoading={isLoading} data={data} />
    </Layout>
  );
};

export default HomeScreen;
