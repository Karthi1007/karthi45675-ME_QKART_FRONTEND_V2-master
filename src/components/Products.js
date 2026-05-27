import React, { useEffect, useState } from "react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      enqueueSnackbar("Could not fetch products. Please try again later.", {
        variant: "error",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (productsData = []) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartItems = generateCartItemsFrom(response.data, productsData);
      setCart(cartItems);
      return cartItems;
    } catch (e) {
      return [];
    }
  };

  const loadData = async () => {
    const productsData = await fetchProducts();
    if (isLoggedIn) await fetchCart(productsData);
  };

  const performSearch = async (text) => {
    try {
      if (text === "") {
        const productsData = await fetchProducts();
        if (isLoggedIn) await fetchCart(productsData);
        return;
      }

      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setProducts([]);
      } else {
        enqueueSnackbar("Could not fetch products. Please try again later.", {
          variant: "error",
        });
      }
    }
  };

  const debounceSearch = (event, timeoutId) => {
    const value = event.target.value;

    if (timeoutId) clearTimeout(timeoutId);

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const isItemInCart = (productId) =>
    cart.some((item) => item.productId === productId);

  const addToCart = async (product, qty, fromCart = false) => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (!fromCart && isItemInCart(product._id)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: product._id,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCart = generateCartItemsFrom(response.data, products);
      setCart(updatedCart);
    } catch (e) {
      enqueueSnackbar("Could not update cart. Please try again later.", {
        variant: "error",
      });
    }
  };

  const handleQuantity = async (productId, change) => {
    const item = cart.find((c) => c.productId === productId);
    const product = products.find((p) => p._id === productId);

    if (!item || !product) return;

    const updatedQty = item.qty + change;
    await addToCart(product, updatedQty > 0 ? updatedQty : 0, true);
  };

  const handleCheckout = () => {
    history.push("/checkout");
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Header hasHiddenAuthButtons>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          placeholder="Search for items/categories"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Header>

      <Grid container>
        <Grid item xs={12} md={isLoggedIn ? 9 : 12}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              mt={5}
            >
              <CircularProgress />
              <Typography mt={2}>Loading Products...</Typography>
            </Box>
          ) : products.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt={5}
            >
              <SentimentDissatisfiedIcon />
              <Typography variant="h6">No products found</Typography>
            </Box>
          ) : (
            <Grid container spacing={2} padding={2}>
              {products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => addToCart(product, 1)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {isLoggedIn && (
          <Grid item xs={12} md={3}>
            <Cart
              items={cart}
              handleQuantity={handleQuantity}
              handleCheckout={handleCheckout}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Products;
