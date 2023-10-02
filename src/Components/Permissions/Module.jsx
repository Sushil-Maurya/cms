import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Formik, useFormik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  fas,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

//////
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import MenuPage from "../Menu/MenuPage";
///
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Module() {
  const [open, setOpen] = React.useState(false);
  const [listvalue, setListvalue] = useState([]);
  const [updateopen, setupdateopen] = useState(false);
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [Auth, setAuth] = useState({});
  const [updateData, setUpdateData] = useState({
    modelname: "",
    slug: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [itemID, setItemID] = useState("");
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);

  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  function handleDelete(e) {
    console.log(e.currentTarget.id);
  }

  const list = async () => {
    let value = {
      page: spage,
      limit: itemsPerPage,
    };
    let listData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/rmodules/ ",
      value,
      config
    );
    setListvalue(listData.data.response.docs);
    setTotalPage(listData.data.response.totalPages);
  };

  function getModule(i) {
    setUpdateData((prevData) => ({
      ...prevData,
      modelname: listvalue[i].modelname,
      slug: listvalue[i].slug,
    }));

    setItemID(listvalue[i]._id);
  }

  const handleClickOpen = () => {
    setModuleUpdate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dilogUpdateOpen = (i) => () => {
    setupdateopen(true);
    setModuleUpdate(true);
    getModule(i);
  };

  const dilogUpdateClose = () => {
    setupdateopen(false);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...val, updatedby: Auth.id };

    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/rmodules/status",
        val,
        config
      );
      const result = postData.data;
      showToast(result.message, result.status);
    } catch (error) {
      throw error;
    }
  }

  async function handleStatusChange(i) {
    const updatedList = [...listvalue];

    // Toggle the status of the module at index i
    updatedList[i].status = !updatedList[i].status;

    // Update the listvalue state with the modified array
    let values = {
      // updatedby: null,
      moduleID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  async function postModel(values) {
    try {
      if (moduleUpdate) {
        const postvalue = { ...values, moduleID: itemID, updatedby: Auth.id };
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/rmodules/update",
          postvalue,
          config
        );

        return response.data;
      } else {
        let val = values;
        val = { ...val, createdby: Auth.id };
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/rmodules/create",
          val,
          config
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  }

  const formik = useFormik({
    initialValues: {
      modelname: "",
      slug: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await postModel(values);

        if (result) {
          showToast(result.message, result.status);
          list();
        } else {
          showToast(
            "! Oops Something went wrong. Please try later",
            result.status
          );
        }

        // Reset the form fields
        resetForm();
        setOpen(false);
        setupdateopen(false);
        refresh ? setRefresh(false) : setRefresh(true);
      } catch (error) {
        // Handle error gracefully, display error message or take other actions
        showToast("! ERR_BAD_REQUEST", "warning");
      }
    },
  });

  useEffect(() => {
    if (Auth.token) {
      list();
    }
  }, [Auth, refresh]);

  useEffect(() => {
    // Update Formik values when updateData changes
    formik.setValues({
      modelname: moduleUpdate ? updateData.modelname : "",
      slug: moduleUpdate ? updateData.slug : "",
    });
  }, [updateData, moduleUpdate]);
  // useEffect(() => {
  //   showToast("This is a success toast!", "success");
  // });

  // console.log(moduleUpdate);

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "rgb(55, 35, 26)",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  useEffect(() => {
    let token = getTokenFromSessionStorage();
    if (token) {
      let jsondata = JSON.parse(token);
      setAuth(jsondata);
    }
  }, []);

  return (
    <>
      {/* <MenuPage pageTitle="Dashboard22"> */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Module"}</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "4px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Module</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Module"
                  name="modelname"
                  value={formik.values.modelname}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <br />
              <br />
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Slug</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <div className="f1">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center ">
            <h4 className="card-title m-2">Modules </h4>
            <button className="btn btn-success" onClick={handleClickOpen}>
              Add
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th>Model Name</th>
                    <th>Slug</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listvalue.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.modelname}</td>
                      <td>{arr.slug}</td>
                      <td>{}</td>
                      <td>
                        <IOSSwitch
                          id={arr._id}
                          sx={{ m: 1 }}
                          checked={arr.status ? true : false}
                          onChange={() => handleStatusChange(i)}
                        />
                      </td>
                      <td>
                        <a
                          href="#d"
                          id={arr._id}
                          onClick={dilogUpdateOpen(i)}
                          className="btn btn-primary shadow btn-xs sharp me-1"
                        >
                          <FontAwesomeIcon icon={(fas, faEdit)} id={arr._id} />
                        </a>
                        <a
                          href="#d"
                          className="btn btn-danger shadow btn-xs sharp me-1"
                          onClick={handleDelete}
                          id={arr._id}
                        >
                          <FontAwesomeIcon icon={(fas, faTrash)} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer ">
            <div className="d-flex justify-content-end  w-100">
              {listvalue.length && (
                <nav className="align-middle">
                  <ul className="pagination">
                    <li
                      className="page-item page-indicator "
                      onClick={() => pageClick(spage - 1)}
                    >
                      <a className="page-link" href="#a">
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </a>
                    </li>
                    {spage > 2 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    {[...Array(totalPage)].map((_, i) => {
                      if (i + 1 === spage) {
                        return (
                          <li
                            className="page-item active"
                            key={i}
                            onClick={() => pageClick(i + 1)}
                          >
                            <a className="page-link" href="#a">
                              {i + 1}
                            </a>
                          </li>
                        );
                      }
                      if (i + 1 >= spage - 1 && i + 1 <= spage + 1) {
                        return (
                          <li
                            className="page-item"
                            key={i}
                            onClick={() => pageClick(i + 1)}
                          >
                            <a className="page-link" href="#a">
                              {i + 1}
                            </a>
                          </li>
                        );
                      }
                      return null;
                    })}
                    {spage < totalPage - 1 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li
                      className="page-item page-indicator"
                      onClick={() => pageClick(spage + 1)}
                    >
                      <a className="page-link" href="#a">
                        <FontAwesomeIcon icon={faAngleRight} />
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={updateopen}
        TransitionComponent={Transition}
        keepMounted
        onClose={dilogUpdateClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Module Update"}</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "4px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Module</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Module"
                  name="modelname"
                  value={formik.values.modelname}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <br />
              <br />
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Slug</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={dilogUpdateClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* <div class="card" style={{ borderRadius: "8px" }}>
            <div class="card-body">
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th>
                        <strong>Model Name</strong>
                      </th>
                      <th>
                        <strong>Slug</strong>
                      </th>
                      <th>
                        <strong>Created By</strong>
                      </th>

                      <th>
                        <strong>Status</strong>
                      </th>
                      <th>
                        <strong></strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listvalue.map((arr, i) => (
                      <>
                        {" "}
                        <tr>
                          <td>{arr.modelname}</td>
                          <td>{arr.slug}</td>
                          <td>{}</td>
                          <td>{arr.status === 1 ? true : false}</td>
                          <td>
                            <div className="d-flex">
                              <a
                                href="#"
                                className="btn btn-primary shadow btn-xs sharp me-1"
                              >
                                <FontAwesomeIcon icon={(fas, faPencil)} />
                              </a>
                              <a
                                href="#"
                                className="btn btn-danger shadow btn-xs sharp"
                              >
                                <FontAwesomeIcon icon={(fas, faTrash)} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
      {/* </MenuPage> */}
    </>
  );
}

export default Module;
