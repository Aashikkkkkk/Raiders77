import { Container } from '@material-ui/core';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import HomeDetails from '../components/page-specific/HomeDetails';

const HomeScreen = () => {
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

      <HomeDetails />
    </Layout>
  );
};

export default HomeScreen;
