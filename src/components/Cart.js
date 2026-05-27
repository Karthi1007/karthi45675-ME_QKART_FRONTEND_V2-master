import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import "./Cart.css";

/**
 * Generate cart items from products and cart
 */
export const generateCartItemsFrom = (
  cartData,
  productsData
) => {

  if (!cartData) return [];

  const cartItems = cartData.map((item) => {

    const product = productsData.find(
      (p) => p._id === item.productId
    );

    return {
      ...product,
      qty: item.qty,
      productId: item.productId,
    };

  });

  return cartItems;
};

/**
 * Total cart value
 */
export const getTotalCartValue = (
  items = []
) => {

  return items.reduce(
    (total, item) =>
      total + item.cost * item.qty,
    0
  );
};

/**
 * Total cart items quantity
 */
export const getTotalItems = (
  items = []
) => {

  return items.reduce(
    (total, item) =>
      total + item.qty,
    0
  );
};

const Cart = ({
  items = [],
  handleQuantity,
  isReadOnly = false,
}) => {

  if (!items.length) {

    return (
      <Box className="cart empty">
        <ShoppingCartOutlined
          className="empty-cart-icon"
        />

        <Typography>
          Cart is empty. Add more items to the cart to checkout.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="cart">

      {/* CART ITEMS */}
      {items.map((item) => (

        <Box
          key={item.productId}
          className="cart-item"
        >
          <Box
            display="flex"
            alignItems="flex-start"
          >
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />

            <Box
              width="100%"
              ml={2}
            >
              <Typography>
                {item.name}
              </Typography>

              {/* READ ONLY VIEW */}
              {isReadOnly ? (

                <Typography>
                  Qty: {item.qty}
                </Typography>

              ) : (

                <Box
                  display="flex"
                  alignItems="center"
                  mt={1}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantity(
                        item.productId,
                        item.qty - 1
                      )
                    }
                  >
                    <RemoveOutlined />
                  </IconButton>

                  <Typography mx={1}>
                    {item.qty}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() =>
                      handleQuantity(
                        item.productId,
                        item.qty + 1
                      )
                    }
                  >
                    <AddOutlined />
                  </IconButton>
                </Box>

              )}
            </Box>
          </Box>

          <Typography
            mt={1}
            fontWeight="bold"
          >
            ${item.cost * item.qty}
          </Typography>

          <Divider sx={{ mt: 2 }} />
        </Box>

      ))}

      {/* ORDER DETAILS */}
      <Box mt={3}>

        <Typography
          variant="h6"
          gutterBottom
        >
          Order Details
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography>
            Products
          </Typography>

          <Typography>
            {getTotalItems(items)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          mb={1}
        >
          <Typography>
            Subtotal
          </Typography>

          <Typography>
            ${getTotalCartValue(items)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          mb={2}
        >
          <Typography>
            Shipping Charges
          </Typography>

          <Typography>
            Free
          </Typography>
        </Stack>

        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
          mt={2}
        >
          <Typography fontWeight="bold">
            Total
          </Typography>

          <Typography fontWeight="bold">
            ${getTotalCartValue(items)}
          </Typography>
        </Stack>

        {/* HIDE CHECKOUT BUTTON IN READONLY */}
        {!isReadOnly && (

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Checkout
          </Button>

        )}

      </Box>
    </Box>
  );
};

export default Cart;