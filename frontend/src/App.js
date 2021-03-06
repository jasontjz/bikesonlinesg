import { useEffect } from "react";
import { useSelector } from "react-redux";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Cart from "./components/cart/Cart";

import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import NewPasswordToken from "./components/user/NewPasswordToken";

import ProtectedRoute from "./components/route/ProtectedRoute";

import { loadUser } from "./actions/userActions";
import store from "./store";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />

        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/search/:keyword" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} exact />

            <Route path="/cart" element={<Cart />} exact />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} exact />
            <Route
              path="/password/reset/:token"
              element={<NewPasswordToken />}
              exact
            />
            <Route path="/password/reset" element={<NewPassword />} exact />

            {/* Routes to Protect */}
            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  {" "}
                  <Profile />{" "}
                </ProtectedRoute>
              }
              exact
            />
            <Route
              path="/me/update"
              element={
                <ProtectedRoute>
                  {" "}
                  <UpdateProfile />{" "}
                </ProtectedRoute>
              }
              exact
            />
            <Route
              path="/password/update"
              element={
                <ProtectedRoute>
                  {" "}
                  <UpdatePassword />{" "}
                </ProtectedRoute>
              }
              exact
            />
            {/* <Route path="/me" element={<Profile />} exact /> */}
            {/* <Route path="/me/update" element={<UpdateProfile />} exact />
            <Route path="/password/update" element={<UpdatePassword />} exact /> */}
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
