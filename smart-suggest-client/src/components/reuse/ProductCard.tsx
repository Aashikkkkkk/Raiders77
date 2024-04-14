import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

const ProductCard = (props: any) => {
  return (
    <Card style={{ height: '100%', position: 'relative', cursor: 'pointer' }}>
      <CardMedia
        onError={(e) => {
          e.currentTarget.src =
            'https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=';
        }}
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
              image: props.image_url,
              totalQty:props.quantity
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
