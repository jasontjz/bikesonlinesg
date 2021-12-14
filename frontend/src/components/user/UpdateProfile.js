import React, { useEffect, useState, Fragment } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";

import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../actions/userActions";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  let navigate = useNavigate();
  const alert = useAlert();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { isUpdated, error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("user updated successfully");
      dispatch(loadUser());
      navigate("/me");
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    // formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };
  const onChange = (e) => {
    // if (e.target.name === "avatar") {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     if (reader.readyState === 2) {
    //       setAvatarPreview(reader.result);
    //       setAvatar(reader.result);
    //     }
    //   };
    //   reader.readAsDataURL(e.target.files[0]);
    // } else {
    // }
  };
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow-lg"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <h1 className="mt-2 mb-5">Update Profile</h1>

          <div className="form-group">
            <label htmlFor="email_field">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div className='form-group'>
                            <label for='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src=''
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                    />
                                    <label className='custom-file-label' for='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div> */}

          <button
            type="submit"
            id="btn_update_profile"
            className="btn btn-primary btn-block mt-4 mb-3"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
