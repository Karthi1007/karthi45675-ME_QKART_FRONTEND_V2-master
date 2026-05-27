import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.querySelector("#root")
);