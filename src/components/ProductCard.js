import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart = () => {} }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="card-media"
      />
      <CardContent>
        <Typography variant="body1">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{product.cost}
        </Typography>
        <Rating
          value={product.rating}
          readOnly
          name={`${product.name}-rating`}
          aria-label={`${product.rating} stars`}
        />
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          onClick={() => handleAddToCart(product)}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;