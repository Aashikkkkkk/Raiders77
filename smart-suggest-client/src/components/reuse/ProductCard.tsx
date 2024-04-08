import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Product } from '../../pages/AllProductsPage';
import useTotalNumber from '../../store/useTotalNumber';

interface IProps {
  id: number;
  img: string;
  name: string;
  price: string;
  handleCart: (id: number, product: Product) => void;
  handleClick: () => void;
}
const ProductCard = (props: IProps) => {
  const dispatch = useTotalNumber((state) => state.setTotalNo);
  const cartItemsLength = useTotalNumber((state) => state.totalNo);
  return (
    <Card style={{ height: '100%', position: 'relative' }}>
      <CardMedia
        component="img"
        alt="Large Bagged Oranges"
        height="170"
        image={props.img}
        title="Large Bagged Oranges"
      />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          {props.name}
        </Typography>
        <Typography
          style={{ marginTop: '20px' }}
          variant="body2"
          color="textSecondary"
          component="p"
        >
          ${props.price}
        </Typography>

        <IconButton
          onClick={() => {
            props.handleCart(props.id, {
              id: props.id,
              name: props.name,
              price: Number(props.price),
              image: props.img,
            });
            props.handleClick();
            dispatch(cartItemsLength + 1);
          }}
          style={{ position: 'absolute', bottom: 0, right: 1 }}
          aria-label="add to cart"
        >
          <Button variant="contained">
            <ShoppingCart />
          </Button>
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
