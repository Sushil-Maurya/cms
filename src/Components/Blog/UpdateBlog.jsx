import React, { useState, useEffect } from "react";
import "./blog.css";
import {
  faAngleDown,
  faAngleUp,
  faEye,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputTags } from "react-bootstrap-tagsinput";
import "react-bootstrap-tagsinput/dist/index.css";
import MenuPage from "../Menu/MenuPage";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Select,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { format } from "date-fns";
import dayjs from "dayjs";
import axios from "axios";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import { useParams } from "react-router-dom";

function UpdateBlog() {
  const [cardVisible, setcardVisible] = useState(true);
  const [Custom, setCustom] = useState(true);
  const [cardAuthor, setcardAuthor] = useState(true);
  const [cardSeo, setcardSeo] = useState(true);
  const [type, setType] = useState(true);
  const [cardSlug, setcardSlug] = useState(true);
  const [discuss, setDiscuss] = useState(true);
  const [tag, setTag] = useState(true);
  const [img, setImg] = useState(true);
  const [cardPublish, setcardPublish] = useState(true);
  const [Auth, setAuth] = useState({});
  const [authorList, setAuthorList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState([]);
  const [blogDetails, setBlogDetails] = useState(null);
  const { blogID } = useParams();
  const [refresh, setrefresh] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

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

  async function updateBlog(values) {
    try {
      let data = values;
      data = { ...data, tags: state };
      data = { ...data, updatedby: Auth.id, blogId: blogID };
      // if (image !== "") {
      //   data = { ...data, avtar: image };
      // }

      let postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/blog/update",
        data,
        config
      );
      let response = postData.data;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getAuthorList() {
    try {
      let value = {
        page: "1",
        limit: "10000000000000",
      };
      const getData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/author/",
        value,
        config
      );
      setAuthorList(getData.data.response.docs);
    } catch (error) {
      throw error;
    }
  }

  async function getBlog() {
    try {
      let value = {
        blogId: blogID,
      };

      const blog = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/blog/find",
        value,
        config
      );
      setBlogDetails(blog.data.data);
    } catch (error) {
      throw error;
    }
  }

  async function getCategoryList() {
    try {
      let value = {
        page: "1",
        limit: "10000000000000",
      };
      const getData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/category/view",
        value,
        config
      );
      setCategoryList(getData.data.response.docs);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (Auth.token) {
      getAuthorList();
      getCategoryList();

      getBlog();
    }
  }, [Auth, refresh]);

  useEffect(() => {
    let token = getTokenFromSessionStorage();
    if (token) {
      let jsondata = JSON.parse(token);
      setAuth(jsondata);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      excerpt: "",
      slug: "",
      authorId: "Please select ",
      categoryId: "",
      seo: {
        name: "",
        text: "",
        keywords: "",
      },
      publish: {
        status: "",
        visibility: "",
        publishedOn: "",
      },
    },
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      let result = await updateBlog(values);
      if (result) {
        showToast(result.message, result.status);
      } else {
        showToast(
          "! Oops Something went wrong. Please try later",
          result.status
        );
      }
      resetForm();
      setState([]);
      refresh ? setrefresh(false) : setrefresh(true);
    },
  });

  useEffect(() => {
    let author = blogDetails;
    console.log(author);
    if (author) {
      formik.setValues({
        title: blogDetails.title,
        description: blogDetails.description,
        excerpt: blogDetails.excerpt,
        slug: blogDetails.slug,
        authorId: blogDetails.authorId._id,
        categoryId: blogDetails.categoryId._id,
        seo: {
          name: blogDetails.seo.name,
          text: blogDetails.seo.text,
          keywords: blogDetails.seo.keywords,
        },
        publish: {
          status: blogDetails.publish.status,
          visibility: blogDetails.publish.visibility,
          publishedOn: blogDetails.publish.publishedOn,
        },
      });
      setState(blogDetails.tags);
    }
  }, [blogDetails, refresh]);

  return (
    <>
      {/* <MenuPage pageTitle="Dashboard22"> */}
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header rounded">
                    <h5 className="card-title">Add Blog</h5>
                  </div>
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="form-group col-md-12">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Title
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="form-group col-md-12">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Description
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            maxRows={8}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div
                    className="card-header rounded d-flex"
                    onClick={() => setcardVisible(!cardVisible)}
                  >
                    <h5 className="card-title pt-2 w-50 ">Excerpt</h5>
                    <span className="d-flex justify-content-end w-50 pt-3">
                      {cardVisible ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                    </span>
                  </div>
                  {cardVisible && (
                    <div className="card-body">
                      <div className="form-group">
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            id="outlined-multiline-flexible"
                            label="Excerpt"
                            multiline
                            maxRows={5}
                            name="excerpt"
                            value={formik.values.excerpt}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-md-12">
                  <div className="card">
                    <div
                      className="card-header rounded d-flex"
                      onClick={() => setCustom(!Custom)}
                    >
                      <h5 className="card-title pt-2 w-50 ">Custom Fields</h5>
                      <span className="d-flex justify-content-end w-50 pt-3">
                        {Custom ? (
                          <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                          <FontAwesomeIcon icon={faAngleDown} />
                        )}
                      </span>
                    </div>
                    {Custom && (
                      <div className=" row card-body ">
                        <div className="form-group col-md-6">
                          <FormControl sx={{ width: "100%" }}>
                            <InputLabel htmlFor="component-outlined">
                              Title
                            </InputLabel>
                            <OutlinedInput
                              id="component-outlined"
                              label="Title"
                              name="title"
                            />
                          </FormControl>
                        </div>
                        <div className="form-group col-md-6">
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              id="outlined-multiline-flexible"
                              label="value"
                              multiline
                              maxRows={5}
                            />
                          </FormControl>
                        </div>
                        <div className="mb-2 form-group">
                          <Button variant="contained">Add Custom Field</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              {/* <div className="col-md-12">
                  <div className="card">
                    <div
                      className="card-header rounded d-flex  rounded"
                      onClick={() => setDiscuss(!discuss)}
                    >
                      <h5 className="card-title pt-2 w-50 ">Discussion</h5>
                      <span className="d-flex justify-content-end w-50 pt-3">
                        {discuss ? (
                          <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                          <FontAwesomeIcon icon={faAngleDown} />
                        )}
                      </span>
                    </div>
                    {discuss && (
                      <div className=" row card-body ">
                        <div className="col">
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox defaultChecked />}
                              label="Allow Comments"
                            />
                          </FormGroup>
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              <div className="col-md-12">
                <div className="card">
                  <div
                    className="card-header rounded d-flex rounded"
                    onClick={() => setcardSlug(!cardSlug)}
                  >
                    <h5 className="card-title pt-2 w-50 ">Slug</h5>
                    <span className="d-flex justify-content-end w-50 pt-3">
                      {cardSlug ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                    </span>
                  </div>
                  {cardSlug && (
                    <div className=" row card-body ">
                      <div className="form-group">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Slug
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="slug"
                            name="slug"
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div
                    className="card-header rounded d-flex"
                    onClick={() => setcardAuthor(!cardAuthor)}
                  >
                    <h5 className="card-title pt-2 w-50 ">Author</h5>
                    <span className="d-flex justify-content-end w-50 pt-3">
                      {cardAuthor ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                    </span>
                  </div>
                  {cardAuthor && (
                    <div className="card-body">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel htmlFor="demo-dialog-native">
                          Author
                        </InputLabel>
                        <Select
                          native
                          id="validationCustom05"
                          name="authorId"
                          value={formik.values.authorId}
                          onChange={(event) => {
                            formik.handleChange(event);
                            formik.setFieldValue(
                              "authorId",
                              event.target.value
                            );
                          }}
                          label="Author"
                        >
                          <option data-display="Select">Please select</option>
                          {authorList.map((arr) => (
                            <option key={arr._id} value={arr._id}>
                              {arr.authorName}
                            </option>
                          ))}
                          \
                        </Select>
                      </FormControl>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div
                    className="card-header rounded d-flex"
                    onClick={() => setcardSeo(!cardSeo)}
                  >
                    <h5 className="card-title pt-2 w-50 ">Seo</h5>
                    <span className="d-flex justify-content-end w-50 pt-3">
                      {cardSeo ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                      )}
                    </span>
                  </div>
                  {cardSeo && (
                    <div className=" row card-body ">
                      <div className="form-group">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Blog Title
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="Blog Title"
                            placeholder="Blog Title"
                            name="seo.name"
                            value={formik.values.seo.name}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="form-group col-md-6">
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel htmlFor="component-outlined">
                            Keywords
                          </InputLabel>
                          <OutlinedInput
                            id="component-outlined"
                            label="Keywords"
                            placeholder="Enter meta keywords"
                            name="seo.keywords"
                            value={formik.values.seo.keywords}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="form-group col-md-6">
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            id="outlined-multiline-flexible"
                            label="Descriptions"
                            multiline
                            maxRows={3}
                            placeholder="Enter meta descriptions"
                            name="seo.text"
                            value={formik.values.seo.text}
                            onChange={formik.handleChange}
                          />
                        </FormControl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-md-12">
              <div className="card">
                <div
                  className="card-header rounded d-flex"
                  onClick={() => setcardPublish(!cardPublish)}
                >
                  <h5 className="card-title pt-2 w-50 ">Publish</h5>
                  <span className="d-flex justify-content-end w-50 pt-3">
                    {cardPublish ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </span>
                </div>
                {cardPublish && (
                  <div className="card-body mb-0">
                    <div className="form-group">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel htmlFor="demo-dialog-native">
                          <FontAwesomeIcon icon={faKey} /> Status
                        </InputLabel>
                        <Select
                          native
                          id="validationCustom05"
                          name="publish.status"
                          value={formik.values.publish.status}
                          onChange={(event) => {
                            formik.handleChange(event);
                            formik.setFieldValue(
                              "publish.status",
                              event.target.value
                            );
                          }}
                          label="keyStatus"
                        >
                          <option aria-label="None" value="" />
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Private">Private</option>
                          <option value="Pendding">Pendding</option>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="form-group">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel htmlFor="demo-dialog-native">
                          <FontAwesomeIcon icon={faEye} /> Visibility:
                        </InputLabel>
                        <Select
                          native
                          id="validationCustom05"
                          name="publish.visibility"
                          value={formik.values.publish.visibility}
                          onChange={(event) => {
                            formik.handleChange(event);
                            formik.setFieldValue(
                              "publish.visibility",
                              event.target.value
                            );
                          }}
                          label="Visibility key"
                        >
                          <option aria-label="None" value="" />
                          <option value="Public">Public</option>
                          <option value="Password Protected">
                            Password Protected
                          </option>
                          <option value="Private">Private</option>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="form-group">
                      <div className="form-group">
                        <FormControl sx={{ width: "100%" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <div className="date">
                                <DesktopDatePicker
                                  sx={{ minWidth: "100%" }}
                                  label="Published on:"
                                  value={dayjs(
                                    formik.values.publish.publishedOn
                                  )}
                                  onChange={(date) => {
                                    if (dayjs.isDayjs(date)) {
                                      formik.setFieldValue(
                                        "publish.publishedOn",
                                        date.format("YYYY-MM-DD")
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </DemoContainer>
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                    </div>
                    <Button variant="contained" type="submit">
                      Publish
                    </Button>
                  </div>
                  // </div>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div
                  className="card-header rounded d-flex"
                  onClick={() => setType(!type)}
                >
                  <h5 className="card-title pt-2 w-50 ">Categories</h5>
                  <span className="d-flex justify-content-end w-50 pt-3">
                    {type ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </span>
                </div>
                {type && (
                  <div className="card-body ">
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel htmlFor="demo-dialog-native">
                        Category
                      </InputLabel>
                      <Select
                        native
                        id="validationCustom05"
                        name="categoryId"
                        value={formik.values.categoryId}
                        onChange={(event) => {
                          formik.handleChange(event);
                          formik.setFieldValue(
                            "categoryId",
                            event.target.value
                          );
                        }}
                        label="Category"
                      >
                        <option data-display="Select">Please select</option>
                        {categoryList.map((arr) => (
                          <option key={arr._id} value={arr._id}>
                            {arr.categoryName}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div
                  className="card-header rounded d-flex"
                  onClick={() => setTag(!tag)}
                >
                  <h5 className="card-title pt-2 w-50 ">tags</h5>
                  <span className="d-flex justify-content-end w-50 pt-3">
                    {tag ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </span>
                </div>
                {tag && (
                  <div className="card-body ">
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        label="Tags"
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
                )}
              </div>
            </div>
            <div className="col-md-12">
              <div className="card">
                <div
                  className="card-header rounded d-flex"
                  onClick={() => setImg(!img)}
                >
                  <h5 className="card-title pt-2 w-50 ">Featured Image</h5>
                  <span className="d-flex justify-content-end w-50 pt-3">
                    {img ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faAngleDown} />
                    )}
                  </span>
                </div>
                {img && (
                  <div className="card-body ">
                    <div className="form-group">
                      <img
                        className="card-img-top"
                        src="https://demo.w3cms.in/cryptozone/public/images/noimage.jpg"
                        alt=""
                      />
                      <div className="form-file mt-2">
                        <input
                          type="file"
                          className="form-control form-control-file"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* </MenuPage> */}
    </>
  );
}

export default UpdateBlog;
