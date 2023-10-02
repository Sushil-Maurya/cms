import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Collapse } from "antd";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Formik, useFormik } from "formik";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import MenuPage from "../Menu/MenuPage";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
////
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const { Panel } = Collapse;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
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
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
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

function Author() {
  const [authorList, setAuthorList] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateopen, setupdateopen] = useState(false);
  const [updateData, setUpdateData] = useState({
    authorName: "",
    description: "",
  });
  const [itemID, setItemID] = useState("");
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [Auth, setAuth] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [status, setStatus] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };

    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/author/status",
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
    const updatedList = [...authorList];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      authorId: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  function getModule(i) {
    setUpdateData((prevData) => ({
      ...prevData,
      authorName: authorList[i].authorName,
      description: authorList[i].description,
    }));
    setItemID(authorList[i]._id);
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

  const getAuthorList = async () => {
    let value = {
      page: spage,
      limit: itemsPerPage,
    };
    const postData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/author/",
      value,
      config
    );

    setAuthorList(postData.data.response.docs);
    setTotalPage(postData.data.response.totalPages);
  };

  async function UpdateCreateRole(values) {
    try {
      if (moduleUpdate) {
        const postvalue = { ...values, authorId: itemID, updatedby: Auth.id };
        console.log(postvalue);
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/author/update",
          postvalue,
          config
        );

        return response.data;
      } else {
        let val = values;
        val = { ...val, createdby: Auth.id };
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/author/create",
          val,
          config
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async function deleteData(value) {
    try {
      let response = await axios.delete(
        "https://panelserver.digitalkrantiindia.com/api/author/delete",

        {...config,
        data: value}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (e) => {
    const value = { authorId: e.currentTarget.id };
    let result = await deleteData(value);
    console.log(result);
    if (result) {
      showToast(result.message, result.status);
      refresh ? setRefresh(false) : setRefresh(true);
    } else {
      showToast("! Oops Something went wrong. Please try later", result.status);
    }
  };

  useEffect(() => {
    if (Auth.token) {
      getAuthorList();
    }
  }, [Auth, refresh, spage]);

  const formik = useFormik({
    initialValues: {
      authorName: "",
      description: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await UpdateCreateRole(values);

        if (result) {
          showToast(result.message, result.status);
          refresh ? setRefresh(false) : setRefresh(true);
        } else {
          showToast(
            "! Oops Something went wrong. Please try later",
            result.status
          );
        }

        resetForm();
        setOpen(false);
        setupdateopen(false);
      } catch (error) {
        showToast(error.message, "warning");
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      authorName: moduleUpdate ? updateData.authorName : "",
      description: moduleUpdate ? updateData.description : "",
    });
  }, [updateData, moduleUpdate]);

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
      <div className="f1">
        <div className="card overflow-auto">
          <div className="card-header d-flex justify-content-between align-items-center ">
            <h4 className="card-title m-2">Author</h4>
            <button className="btn btn-success" onClick={handleClickOpen}>
              Add
            </button>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <form onSubmit={formik.handleSubmit}>
                <DialogTitle>{"Author Create"}</DialogTitle>
                <DialogContent>
                  <div style={{ paddingTop: "10px" }}>
                    <FormControl sx={{ width: "400px" }}>
                      <InputLabel htmlFor="component-outlined">Name</InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        label="Name"
                        name="authorName"
                        value={formik.values.authorName}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <TextField
                      sx={{ width: "400px" }}
                      id="outlined-multiline-flexible"
                      label="Description"
                      multiline
                      maxRows={4}
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancle</Button>
                  <Button type="submit">Save</Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
          <div className="card-body ">
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {authorList.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.authorName}</td>
                      <td>{arr.createdby ? arr.createdby.name : ""}</td>
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
                          <FontAwesomeIcon icon={faEdit} id={arr._id} />
                        </a>
                        <a
                          href="#d"
                          id={arr._id}
                          onClick={handleDelete}
                          className="btn btn-danger shadow btn-xs sharp me-1"
                        >
                          <FontAwesomeIcon icon={faTrash} id={arr._id} />
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
              {authorList.length && (
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
      {/* </Container> */}
      <Dialog
        open={updateopen}
        TransitionComponent={Transition}
        keepMounted
        onClose={dilogUpdateClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Author Update"}</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Name</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Name"
                  name="authorName"
                  value={formik.values.authorName}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <TextField
                sx={{ width: "400px" }}
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                maxRows={4}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={dilogUpdateClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* </MenuPage> */}
    </>
  );
}

export default Author;
