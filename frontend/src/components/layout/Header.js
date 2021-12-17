import React, { Fragment } from "react";
import { Route, Routes, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";

import Search from "./Search";

import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out");
  };

  return (
    <div id="sticky-navbar">
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img id="logo-header" src="/images/logo_bosg_header.png" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />

          {/* <Routes>
            <Route render={({ history }) => <Search history={history} />} />
          </Routes> */}
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-3">
              <i className="fa fa-shopping-cart mr-2" aria-hidden="true" />
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}
            </span>
          </Link>

          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="/"
                className="btn dropdown-toggle text-black mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {/* <figure className="avatar avatar-nav"> */}
                {/* <img
                    src="../../../public/images/avatar_default.png"
                    alt={user && user.name}
                    className="rounded-circle"
                  /> */}
                {/* </figure> */}
                <span>Welcome, {user && user.name}!</span>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {user && user.role !== "admin" ? (
                  <Link className="dropdown-item" to="">
                    Orders
                  </Link>
                ) : (
                  <div className="dropdown-item" to="/dashboard">
                    Dashboard
                  </div>
                )}
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>

                <Link className="dropdown-item " to="/" onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            // !loading && (
            <Link to="/login" className="btn" id="login_btn">
              <i className="fa fa-user mr-2" aria-hidden="true" />
              Login
            </Link>
            // )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
