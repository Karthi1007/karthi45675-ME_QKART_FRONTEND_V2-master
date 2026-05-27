import { Link } from "react-router-dom";
import {
  Button,
  Stack,
  TextField
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate User Input
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar(
        "Username is a required field",
        { variant: "warning" }
      );
      return false;
    }

    if (data.username.length < 6) {
      enqueueSnackbar(
        "Username must be at least 6 characters",
        { variant: "warning" }
      );
      return false;
    }

    if (!data.password) {
      enqueueSnackbar(
        "Password is a required field",
        { variant: "warning" }
      );
      return false;
    }

    if (data.password.length < 6) {
      enqueueSnackbar(
        "Password must be at least 6 characters",
        { variant: "warning" }
      );
      return false;
    }

    if (
      data.password !== data.confirmPassword
    ) {
      enqueueSnackbar(
        "Passwords do not match",
        { variant: "warning" }
      );
      return false;
    }

    return true;
  };

  // Register API
  const register = async (formData) => {
    const isValid = validateInput(formData);
  
    if (!isValid) {
      return;
    }
  
    try {
      const response = await axios.post(
        `${config.endpoint}/auth/register`,
        {
          username: formData.username,
          password: formData.password
        }
      );
  
      enqueueSnackbar(
        "Registered successfully",
        { variant: "success" }
      );
  
      history.push("/login");
  console.log('response',response)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400
      ) {
        enqueueSnackbar(
          error.response.data.message,
          { variant: "error" }
        );
      } else {
        enqueueSnackbar(
          "Something went wrong",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />

      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>

          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />

          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            className="button"
            variant="contained"
            onClick={() => register(formData)}
          >
            Register Now
          </Button>

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="#">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default Register;