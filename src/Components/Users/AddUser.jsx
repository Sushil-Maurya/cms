import React, { useEffect, useState } from "react";
import "./addUser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import { Formik, useFormik, Form } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import { Select } from "antd";
import axios from "axios";
import MenuPage from "../Menu/MenuPage";

function AddUser() {
  const [image, setImage] = useState();
  const [Role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Auth, setAuth] = useState({});

  function DropdownOptions() {
    let arr = [];
    for (let i = 0; i < Role.length; i++) {
      arr = [...arr, { value: Role[i]._id, label: Role[i].rolename }];
    }
    return arr;
  }

  const handleChange = (e) => {
    console.log(e.target.files);
    const data = new FileReader();
    data.addEventListener("load", () => {
      setImage(data.result);
    });
    data.readAsDataURL(e.target.files[0]);
  };
  const getRoleList = async () => {
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${Auth.token}`,
        "Content-Type": "application/json",
      },
    };
    let value = {
      page: "1",
      limit: "100000",
    };
    const getData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/role/",
      value,
      config
    );

    setRole(getData.data.response.docs);
    setIsLoading(false);
  };

  const addUser = async (values) => {
    try {
      let data = values;
      data = { ...data, createdby: Auth.id };
      if (image !== "") {
        data = { ...data, avtar: image };
      }
      const config = {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
          "Content-Type": "application/json",
        },
      };

      let postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/create",
        data,
        config
      );
      let response = postData.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (Auth.token) {
      getRoleList();
    }
  }, [Auth]);

  useEffect(() => {
    let token = getTokenFromSessionStorage();
    if (token) {
      let jsondata = JSON.parse(token);
      setAuth(jsondata);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      roleid: "Select Role",
      gender: "",
      email: "",
      password: "",
    },

    onSubmit: async (values, { resetForm }) => {
      let result = await addUser(values);
      if (result) {
        showToast(result.message, result.status);
      } else {
        showToast(
          "! Oops Something went wrong. Please try later",
          result.status
        );
      }
      resetForm();
    },
  });

  return (
    <>
      {/* <MenuPage pageTitle="Dashboard22"> */}
      <div id="main-wrapper">
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-3 col-lg-4">
                <div className="clearfix">
                  <div className="card card-bx profile-card author-profile m-b30">
                    <div className="card-body">
                      <div className="p-5">
                        <div className="author-profile">
                          <div className="author-media">
                            <img
                              className="profole-img"
                              src={image}
                              alt=""
                              style={{ height: "130px", width: "130px" }}
                            />
                            <div
                              className="upload-link"
                              title=""
                              data-toggle="tooltip"
                              data-placement="right"
                              data-original-title="update"
                            >
                              <input
                                type="file"
                                className="update-flie"
                                onChange={handleChange}
                              />
                              <CameraAltRoundedIcon />
                            </div>
                          </div>
                          <div className="author-info">
                            <h6 className="title">Nella Vita</h6>
                            <span>Developer</span>
                          </div>
                        </div>
                      </div>
                      <div className="info-list">
                        <ul>
                          <li>
                            <a href="page-error-404.html">Models</a>
                            <span>36</span>
                          </li>
                          <li>
                            <a href="uc-lightgallery.html">Gallery</a>
                            <span>3</span>
                          </li>
                          <li>
                            <a href="page-error-404.html">Lessons</a>
                            <span>1</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-8">
                <div className="card profile-card card-bx m-b30">
                  <div className="card-header">
                    <h6 className="title">Account setup</h6>
                  </div>
                  <form className="profile-form" onSubmit={formik.handleSubmit}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                          />
                        </div>

                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Email address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                          />
                        </div>

                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Password</label>
                          <input
                            type="text"
                            className="form-control"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                          />
                        </div>

                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Gender</label>
                          <select
                            className="default-select form-control"
                            id="validationCustom05"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                          >
                            <option data-display="Select">Please select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="col-sm-6 m-b30">
                          <label className="form-label">Role</label> <br></br>
                          <Select
                            defaultValue="Select Role"
                            size="large"
                            style={{
                              width: "100%",
                            }}
                            name="roleid"
                            value={formik.values.roleid}
                            onChange={(value) =>
                              formik.setFieldValue("roleid", value)
                            }
                            options={DropdownOptions()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn btn-primary">Create</button>
                      <a href="page-register.html" className="btn-link">
                        Forgot your password?
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </MenuPage> */}
    </>
  );
}

export default AddUser;
