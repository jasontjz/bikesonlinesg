import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <div className="row justify-content-around mt-5 user-info">
      {/* <div className="col-12 col-md-3"> */}
      {/* <figure className="avatar avatar-profile">
          <img className="rounded-circle img-fluid" src="" alt="" />
        </figure> */}
      {/* </div> */}

      <div className="col-12 col-md-3">
        <h4>Name</h4>
        <p>{user && user.name}</p>

        <h4>Email Address</h4>
        <p>{user && user.email}</p>

        <h4>Member Since</h4>
        <p>{String(user && user.createdAt).substring(0, 10)}</p>

        {user && user.role !== "admin" && (
          <Link to="/orders/me" className="btn btn-danger btn-block mt-5">
            My Orders
          </Link>
        )}
        <Link
          to="/me/update"
          id="btn_edit_profile"
          className="btn btn-primary btn-block my-5"
        >
          Edit Profile
        </Link>

        <Link
          to="/password/update"
          id="btn_change_password"
          className="btn btn-primary btn-block mt-3"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default Profile;
