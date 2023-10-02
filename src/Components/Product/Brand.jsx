import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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
function Brand() {
  const [brandList, setBrandList] = useState([]);
  const [Auth, setAuth] = useState({});
  const [open, setOpen] = useState(false);
  const [Parent, setParent] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [moduleUpdate, setModuleUpdate] = useState(false);
  const [updateopen, setupdateopen] = useState(false);
  const [updateData, setUpdateData] = useState({
    parentId: "",
    slug: "",
    brandName: "",
    description: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [itemID, setItemID] = useState("");

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
  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
    refresh ? setRefresh(false) : setRefresh(true);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };
    console.log(val);
    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/brand/status",
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
    const updatedList = [...brandList];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      brandID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  const getList = async () => {
    try {
      const postdata = await axios.get(
        "https://panelserver.digitalkrantiindia.com/api/brand/list",
        config
      );
      // console.log(postdata.data.response)
      setParent(postdata.data.response);
    } catch (error) {
      throw error;
    }
  };

  async function getBrandList() {
    let value = {
      brandID: "",
      page: spage,
      limit: itemsPerPage,
    };
    const postData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/brand/",
      value,
      config
    );
    // console.log(postData.data.response.docs);
    setBrandList(postData.data.response.docs);
    setTotalPage(postData.data.response.totalPages);
  }

  async function UpdateCreateBrand(values) {
    try {
      if (moduleUpdate) {
        const postvalue = {
          ...values,
          brandID: itemID,
          updatedby: Auth.id,
          brandImage: imageUrl,
        };
        console.log(postvalue);
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/brand/update",
          postvalue,
          config
        );
        return response.data;
      } else {
        let val = values;
        val = { ...val, createdby: Auth.id, brandImage: imageUrl };
        console.log(val);
        const response = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/brand/create",
          val,
          config
        );
        console.log(response.data);
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
        "https://panelserver.digitalkrantiindia.com/api/brand/delete",
        value,
        config
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (e) => {
    console.log(e.currentTarget);
    const value = { brandID: e.currentTarget.id, updatedby: Auth.id };
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
      brandName: brandList[i].brandName,
      parentId: brandList[i].parentId,
      slug: brandList[i].slug,
      description: brandList[i].description,
    }));
    setItemID(brandList[i]._id);
  }

  useEffect(() => {
    if (Auth.token) {
      getList();
      getBrandList();
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
      parentId: "",
      slug: "",
      brandName: "",
      description: "",
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await UpdateCreateBrand(values);

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
      brandName: moduleUpdate ? updateData.brandName : "",
      parentId: moduleUpdate ? updateData.parentId : "",
      slug: moduleUpdate ? updateData.slug : "",
      description: moduleUpdate ? updateData.description : "",
    });
  }, [updateData, moduleUpdate]);
  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title m-2">Brands</h4>
          <button className="btn btn-success" onClick={handleClickOpen}>
            Add
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-responsive-md">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Slug</th>
                  <th>Created by</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {
                <tbody>
                  {brandList.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.brandName}</td>

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
            {brandList.length && (
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
                      {arr.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Brand</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="brand"
                  name="brandName"
                  value={formik.values.brandName}
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
                    alt="Uploaded Image"
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
            <div style={{ paddingTop: "10px" }}>
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
                      {arr.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="component-outlined">Category</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  label="Category"
                  name="brandName"
                  value={formik.values.brandName}
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
                    alt="Uploaded Image"
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
    </>
  );
}

export default Brand;
