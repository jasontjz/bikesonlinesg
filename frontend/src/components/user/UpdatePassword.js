import React, { useEffect, useState, Fragment } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";

import { updatePassword, clearErrors } from "../../actions/userActions";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  // useAlert() causes problems
  const alert = useAlert();
  const dispatch = useDispatch();

  const { isUpdated, error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password updated successfully");

      navigate("/me");
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", password);
    // formData.set("avatar", avatar);

    dispatch(updatePassword(formData));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mt-2 mb-5">Update Password</h1>
          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            id="btn_update_password"
            className="btn btn-primary btn-block mt-4 mb-3"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
