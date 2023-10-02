import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Slide,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { getTokenFromSessionStorage, showToast } from "../utils/Notifications";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
function Attribute() {
  const [attributeList, setAttributeList] = useState([]);
  const [Auth, setAuth] = useState({});
  const [open, setOpen] = useState(false);
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [updateopen, setupdateopen] = useState(false);
  const [updateData, setUpdateData] = useState({
    slug: "",
    attributeName: "",
    values: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [itemID, setItemID] = useState("");
  // values fields
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      const newTag = inputValue.trim();
      if (!state.includes(newTag)) {
        setState([...state, newTag]);
      }
      setInputValue("");
    }
  };

  const handleTagDelete = (tagToDelete) => () => {
    const updatedTags = state.filter((tag) => tag !== tagToDelete);
    setState(updatedTags);
  };

  function generateSlug(text) {
    return text.replace(/\s+/g, "-").toLowerCase();
  }

  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
    refresh ? setRefresh(false) : setRefresh(true);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };
    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/attribute/status",
        val,
        config
      );
      const result = postData.data;
      // console.log(result)
      showToast(result.message, result.status);
    } catch (error) {
      throw error;
    }
  }

  async function handleStatusChange(i) {
    const updatedList = [...attributeList];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      attributeID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }


  async function getAttributeList() {
    let value = {
      attributeID: "",
      page: spage,
      limit: itemsPerPage,
    };
    const postData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/attribute/",
      value,
      config
    );
    // console.log(postData.data.response.docs);
    setAttributeList(postData.data.response.docs);
    setTotalPage(postData.data.response.totalPages);
  }

  async function UpdateCreateAttribute(values) {
    try {
      if (moduleUpdate) {
        const postvalue = {
          ...values,
          attributeID: itemID,
          updatedby: Auth.id,
          values: state,
        };
        console.log(postvalue);
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/attribute/update",
          postvalue,
          config
        );
        return response.data;
      } else {
        let val = values;
        val = { ...val, createdby: Auth.id, values: state };
        console.log(val, "333");
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/attribute/create",
          val,
          config
        );
        // console.log(response.data)
        return response.data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async function deleteData(value) {
    try {
      let response = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/attribute/delete",
        value,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (e) => {
    console.log(e.currentTarget);
    const value = { attributeID: e.currentTarget.id, updatedby: Auth.id };
    console.log(value);
    let result = await deleteData(value);
    console.log(result);
    if (result) {
      showToast(result.message, result.status);
      refresh ? setRefresh(false) : setRefresh(true);
    } else {
      showToast("! Oops Something went wrong. Please try later", result.status);
    }
  };

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  const dilogUpdateOpen = (i) => () => {
    setupdateopen(true);
    setModuleUpdate(true);
    getModule(i);
  };

  const dilogUpdateClose = () => {
    setupdateopen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setModuleUpdate(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getModule(i) {
    setUpdateData((prevData) => ({
      ...prevData,
      attributeName: attributeList[i].attributeName,
      slug: attributeList[i].slug,
      values: attributeList[i].values,
    }));
    setItemID(attributeList[i]._id);
    setState(attributeList[i].values);
  }

  useEffect(() => {
    if (Auth.token) {
      getAttributeList();
    }
  }, [Auth, refresh, spage]);

  useEffect(() => {
    let token = getTokenFromSessionStorage();
    if (token) {
      let jsondata = JSON.parse(token);
      setAuth(jsondata);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      slug: "",
      attributeName: "",
      values: state,
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await UpdateCreateAttribute(values);

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
      attributeName: moduleUpdate ? updateData.attributeName : "",
      slug: moduleUpdate ? updateData.slug : "",
      values: moduleUpdate ? updateData.values : "",
    });
  }, [updateData, moduleUpdate]);
  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title m-2">Attributes</h4>
          <button className="btn btn-success" onClick={handleClickOpen}>
            Add
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-responsive-md">
              <thead>
                <tr>
                  <th>Attribute Name</th>
                  <th>Slug</th>
                  <th>Created by</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {
                <tbody>
                  {attributeList.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.attributeName}</td>

                      <td>{arr.slug}</td>
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
                          id={arr._id}
                          onClick={dilogUpdateOpen(i)}
                          className="btn btn-primary shadow btn-xs sharp me-1"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </a>
                        <a
                          href="#d"
                          id={arr._id}
                          onClick={handleDelete}
                          className="btn btn-danger shadow btn-xs sharp me-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              }
            </table>
          </div>
        </div>
        <div className="card-footer ">
          <div className="d-flex justify-content-end  w-100">
            {attributeList.length && (
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
      <Dialog
        keepMounted
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Category Create"}</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Attribute</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="attribute"
                  name="attributeName"
                  value={formik.values.attributeName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("slug", generateSlug(e.target.value));
                  }}
                />
              </FormControl>
            </div>
            <div style={{ paddingTop: "10px" }}>
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
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <TextField
                  label="Values"
                  variant="outlined"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                />
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ flexWrap: "wrap", margin: "5px" }}
                >
                  <div className="chip-container">
                    {state.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={handleTagDelete(tag)}
                        className="chip"
                      />
                    ))}
                  </div>
                </Stack>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* update Dilog */}
      <Dialog
        open={updateopen}
        TransitionComponent={Transition}
        keepMounted
        onClose={dilogUpdateClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Category Update"}</DialogTitle>
          <DialogContent>
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Attribute</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="attribute"
                  name="attributeName"
                  value={formik.values.attributeName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("slug", generateSlug(e.target.value));
                  }}
                />
              </FormControl>
            </div>
            <div style={{ paddingTop: "10px" }}>
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
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <TextField
                  label="Values"
                  variant="outlined"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                />
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ flexWrap: "wrap", margin: "5px" }}
                >
                  <div className="chip-container">
                    {state.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={handleTagDelete(tag)}
                        className="chip"
                      />
                    ))}
                  </div>
                </Stack>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={dilogUpdateClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default Attribute;
