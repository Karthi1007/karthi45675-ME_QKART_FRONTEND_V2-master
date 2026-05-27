import React from "react";

import {
  Stack,
  Button,
} from "@mui/material";

import { Link } from "react-router-dom";

import "./Header.css";

const Header = ({
  children,
  hasHiddenAuthButtons,
}) => {

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
        className="header"
      >

        {/* LOGO */}
        <Link
          to="/"
          className="link"
        >
          <img
            src="logo_dark.svg"
            alt="QKart Logo"
            className="logo"
          />
        </Link>

        {/* SEARCH */}
        <div className="search-desktop">
          {children}
        </div>

        {/* BACK BUTTON */}
        {hasHiddenAuthButtons && (
          <Link
            to="/"
            className="link"
          >
            <Button color="inherit">
              Back to explore
            </Button>
          </Link>
        )}

      </Stack>

      {/* MOBILE SEARCH */}
      <div className="search-mobile">
        {children}
      </div>
    </>
  );
};

export default Header;