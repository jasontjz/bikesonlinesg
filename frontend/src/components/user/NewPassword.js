import React, { useEffect, useState, Fragment } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { resetPassword, clearErrors } from "../../actions/userActions";

const NewPassword = ({ match }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  let navigate = useNavigate();
  // useAlert() causes problems
  const alert = useAlert();
  const dispatch = useDispatch();

  const { success, error, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      // console.log(error);
      alert.show(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password has been reset");

      navigate("/login");
    }
  }, [dispatch, error, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    // formData.set("avatar", avatar);

    dispatch(resetPassword(match.params.token, formData));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5" onSubmit={submitHandler}>
        <form className="shadow-lg">
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-block py-3"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
