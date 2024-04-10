import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Product } from '../../pages/AllProductsPage';

interface IProps {
  id: number;
  img: string;
  name: string;
  price: string;
  handleCart: (id: number, product: Product) => void;
  handleClick: (e: Event) => void;
}
const ProductCard = (props: IProps) => {
  return (
    <Card style={{ height: '100%', position: 'relative', cursor: 'pointer' }}>
      <CardMedia
        component="img"
        alt="Large Bagged Oranges"
        height="170"
        image={props.img}
        title="Large Bagged Oranges"
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          {props.name}
        </Typography>
        <Typography
          style={{ marginTop: '20px', fontWeight: 'medium' }}
          variant="h5"
          color="error"
          component="p"
        >
          ${props.price}
        </Typography>

        <IconButton
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(e: any) => {
            props.handleCart(props.id, {
              id: props.id,
              name: props.name,
              price: Number(props.price),
              image: props.img,
            });
            props.handleClick(e);
            // dispatch(cartItemsLength + 1);
          }}
          style={{
            position: 'absolute',
            bottom: '40%',
            right: 10,
            background: 'purple',
            height: '30px',
            width: '30px',
            color: '#fff',
          }}
          aria-label="add to cart"
        >
          <Button color="inherit">
            <Add color="inherit" />
          </Button>
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
