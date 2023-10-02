import React, { useState } from "react";
import MenuPage from "../Menu/MenuPage";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

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
import { useEffect } from "react";

/////////

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

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

function ProductCategory() {
  const [categoryList, setCategoryList] = useState([]);
  const [Auth, setAuth] = useState({});
  const [open, setOpen] = useState(false);
  const [Parent, setParent] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [updateopen, setupdateopen] = useState(false);
  const [updateData, setUpdateData] = useState({
    slug: "",
    categoryName: "",
    description: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [itemID, setItemID] = useState("");
  const [previousImage, setPreviousImage] = useState("");

  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
  };

  function generateSlug(text) {
    return text.replace(/\s+/g, "-").toLowerCase();
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // const handleChange = (event) => {
  //   setParent(event.target.value);
  // };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };

    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/product/category/status",
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
    const updatedList = [...categoryList];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      categoryID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  function getModule(i) {
    setUpdateData((prevData) => ({
      ...prevData,
      categoryName: categoryList[i].categoryName,
      parentId: categoryList[i].parentId,
      slug: categoryList[i].slug,
      description: categoryList[i].description,
    }));
    setItemID(categoryList[i]._id);
    categoryList[i].categoryImage
      ? setPreviousImage(categoryList[i].categoryImage)
      : setPreviousImage("");
  }

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

  async function deleteData(value) {
    try {
      let response = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/category/delete",
        value,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (e) => {
    const value = { categoryID: e.currentTarget.id };
    let result = await deleteData(value);
    if (result) {
      showToast(result.message, result.status);
      refresh ? setRefresh(false) : setRefresh(true);
    } else {
      showToast("! Oops Something went wrong. Please try later", result.status);
    }
  };

  const getList = async () => {
    try {
      const postdata = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/category/"
      );
      setParent(postdata.data.data);
    } catch (error) {
      throw error;
    }
  };

  async function getCategoryList() {
    let value = {
      page: spage,
      limit: itemsPerPage,
    };
    const postData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/product/category/",
      value,
      config
    );
    setCategoryList(postData.data.response.docs);
    setTotalPage(postData.data.response.totalPages);
  }

  async function UpdateCreateCategory(values) {
    try {
      if (moduleUpdate) {
        const postvalue = {
          ...values,
          categoryID: itemID,
          updatedby: Auth.id,
          categoryImage: imageUrl,
        };
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/product/category/update",
          postvalue,
          config
        );
        return response.data;
      } else {
        let val = values;
        val = { ...val, createdby: Auth.id };
        if (imageUrl) {
          val = { ...val, categoryImage: imageUrl };
        }
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/product/category/create",
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

  useEffect(() => {
    if (Auth.token) {
      getList();
      getCategoryList();
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
      categoryName: "",
      description: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await UpdateCreateCategory(values);

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
        setImageUrl(null);
      } catch (error) {
        showToast(error.message, "warning");
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      categoryName: moduleUpdate ? updateData.categoryName : "",
      slug: moduleUpdate ? updateData.slug : "",
      description: moduleUpdate ? updateData.description : "",
    });
  }, [updateData, moduleUpdate]);

  return (
    // <MenuPage pageTitle="Dashboard22">
    <div className="f1">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title m-2">Category</h4>
          <button className="btn btn-success" onClick={handleClickOpen}>
            Add
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-responsive-md">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Created by</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {
                <tbody>
                  {categoryList.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.categoryName}</td>

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
            {categoryList.length && (
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
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{"Category Create"}</DialogTitle>
          <DialogContent>
            {/* <div style={{ paddingTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Parent</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="parentId"
                  value={formik.values.parentId}
                  onChange={formik.handleChange}
                  label="Parent"
                >
                  <MenuItem value={""}>No Parent</MenuItem>
                  {Parent.map((arr) => (
                    <MenuItem key={arr._id} value={arr._id}>
                      {arr.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Category</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Category"
                  name="categoryName"
                  value={formik.values.categoryName}
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
            <div style={{ paddingTop: "10px" }}>
              <Stack direction="row" alignItems="center" spacing={5}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    height="90"
                    width="100"
                    style={{ objectFit: "cover", border: "2px solid #000" }}
                  />
                )}
                <label htmlFor="upload-image">
                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <Button variant="contained" component="span">
                    Upload Image
                  </Button>
                </label>
              </Stack>
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
            {/* <div style={{ paddingTop: "10px" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Parent</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="parentId"
                  value={formik.values.parentId}
                  onChange={formik.handleChange}
                  label="Parent"
                >
                  <MenuItem value={""}>No Parent</MenuItem>
                  {Parent.map((arr) => (
                    <MenuItem key={arr._id} value={arr._id}>
                      {arr.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Category</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Category"
                  name="categoryName"
                  value={formik.values.categoryName}
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
            <div style={{ paddingTop: "10px" }}>
              <Stack direction="row" alignItems="center" spacing={5}>
                {imageUrl && (
                  <img
                    src={previousImage !== "" ? "" : imageUrl}
                    alt="mountains"
                    height="90"
                    width="100"
                    style={{ objectFit: "cover", border: "2px solid #000" }}
                  />
                )}
                <label htmlFor="upload-image">
                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <Button variant="contained" component="span">
                    Upload Image
                  </Button>
                </label>
              </Stack>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={dilogUpdateClose}>Cancle</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
    // </MenuPage>
  );
}

export default ProductCategory;
