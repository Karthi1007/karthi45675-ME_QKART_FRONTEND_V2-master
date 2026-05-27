import React, { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import axios from "axios";

import { useSnackbar } from "notistack";

import {
  Link,
  useHistory,
} from "react-router-dom";
import "./Login.css";
import Header from "./Header";
import { config } from "../App";

const Login = () => {
  const history = useHistory();

  const { enqueueSnackbar } =
    useSnackbar();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      username: "",
      password: "",
    });

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Save login data
  const persistLogin = (
    token,
    username,
    balance
  ) => {
    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "username",
      username
    );

    localStorage.setItem(
      "balance",
      balance
    );
  };

  // Validate input
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar(
        "Username is a required field",
        {
          variant: "warning",
        }
      );

      return false;
    }

    if (!data.password) {
      enqueueSnackbar(
        "Password is a required field",
        {
          variant: "warning",
        }
      );

      return false;
    }

    return true;
  };

  // Login API
  const login = async () => {
    if (!validateInput(formData)) {
      return;
    }

    setLoading(true);

    try {
      const response =
        await axios.post(
          `${config.endpoint}/auth/login`,
          {
            username:
              formData.username,
            password:
              formData.password,
          }
        );

        enqueueSnackbar(
            "Logged in successfully",
            {
              variant: "success",
            }
          );
          
          persistLogin(
            response.data.token,
            response.data.username,
            response.data.balance
          );
          
          history.push("/");
    } catch (error) {
      if (
        error.response &&
        error.response.status ===
          400
      ) {
        enqueueSnackbar(
          error.response.data.message,
          {
            variant: "error",
          }
        );
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Header
        hasHiddenAuthButtons
      />

      <div className="login-container">
        <div className="login-box">
          <h2 className="title">
            Login
          </h2>

          <Stack spacing={2}>
            <TextField
              label="username"
              name="username"
              fullWidth
              value={
                formData.username
              }
              onChange={
                handleChange
              }
            />

            <TextField
              label="password"
              name="password"
              type="password"
              fullWidth
              value={
                formData.password
              }
              onChange={
                handleChange
              }
            />

            <Button
              variant="contained"
              onClick={login}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "LOGIN TO QKART"
              )}
            </Button>
          </Stack>

          <p className="secondary-action">
            Don't have an
            account?{" "}
            <Link to="/register">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
