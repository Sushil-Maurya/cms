import React from "react";
import "./Login.css";
import { MDBCol, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
function Login() {
  const navigate = useNavigate();
  const tostify = (value) => {
    if (value === false) {
      toast.error("Please provide valid data!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.success(" Login Successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const response = async (values) => {
    const getdata = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/login",
      values
    );
    // console.log(getdata.data);
    if (getdata && getdata.data.status) {
      await window.sessionStorage.setItem(
        "detail",
        JSON.stringify(getdata.data)
      );
      tostify(true);
      navigate("/dashboard");
    } else {
      tostify(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, actions) => {
          await response(values);
          actions.resetForm();
        }}
      >
        {(props) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
            className="p-4 background-radial-gradient overflow-hidden align-middle container-fluid "
          >
            <div className="d-flex justify-content-center ">
              <MDBCol
                md="6"
                className="position-relative "
                style={{ width: "180%", margin: "0 auto" }}
              >
                <div
                  id="radius-shape-1"
                  className="position-absolute rounded-circle shadow-5-strong"
                ></div>
                <div
                  id="radius-shape-2"
                  className="position-absolute shadow-5-strong"
                ></div>

                <MDBCard className="my-5 bg-glass" style={{ margin: 4 }}>
                  <MDBCardBody className="p-5">
                    <h1
                      className="my-4 display-3 fw-bold ls-tight px-3"
                      style={{ textDecoration: "underline" }}
                    >
                      Login
                      <br />
                    </h1>

                    <form onSubmit={props.handleSubmit}>
                      <div className="text-fields">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Email
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="Email"
                            name="username"
                            value={props.values.username}
                            onChange={props.handleChange}
                          />
                        </FormControl>
                      </div>
                      <br></br>
                      <br></br>
                      <div className="text-fields">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Password
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="Password"
                            name="password"
                            value={props.values.password}
                            onChange={props.handleChange}
                          />
                        </FormControl>
                      </div>
                      <br></br>
                      <br></br>

                      <Button
                        variant="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        type="submit"
                      >
                        Login
                      </Button>
                    </form>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        )}
      </Formik>
    </>
  );
}

export default Login;
