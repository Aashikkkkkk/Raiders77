import { Button, Container, Typography } from '@material-ui/core';
import Layout from '../layout/Layout';
import CustomTable from '../components/reuse/Table';
import { useNavigate } from 'react-router-dom';
export interface TableData {
  id: string;
  name: string;
  price: string;
  status: string;
}

const AdminPage = () => {
  const tableHeaders = ['id', 'name', 'price', 'status', 'Action'];
  const tableDatas: TableData[] = [
    { id: '1', name: 'Apple', price: '100', status: 'Pending' },
    { id: '2', name: 'Orange', price: '200', status: 'Approved' },
  ];
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

        <CustomTable tableRows={tableDatas} tableHeaders={tableHeaders} />
      </Container>
    </Layout>
  );
};

export default AdminPage;
