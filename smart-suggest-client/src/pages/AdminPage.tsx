import { Button, Container, Typography } from '@material-ui/core';
import Layout from '../layout/Layout';
import CustomTable from '../components/reuse/Table';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { privateAxios } from '../intercepts/axiosIntercepts';
import useAuth from '../store/useAuth';
export interface TableData {
  uuid: string;
  name: string;
  price: string;
  status: string;
}

const AdminPage = () => {
  const { data: fruits, isLoading } = useQuery({
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
  const tableHeaders = ['NAME', 'PRICE', 'ACTION'];
  const tableDatas: TableData[] = fruits;
  const navigate = useNavigate();
  return (
    <Layout>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ margin: '30px 0' }} variant="h4">
            Admin Panel
          </Typography>
          <Button onClick={() => navigate('/add-products')}>
            Add Products
          </Button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <CustomTable tableRows={tableDatas} tableHeaders={tableHeaders} />
        )}
      </Container>
    </Layout>
  );
};

export default AdminPage;
