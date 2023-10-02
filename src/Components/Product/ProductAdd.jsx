import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import {
  Chip,
  OutlinedInput,
  MenuItem,
  Select,
  Stack,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableHead,
  Button,
  IconButton,
} from "@mui/material";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import axios from "axios";
import { useFormik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Clear } from "@mui/icons-material";

const names = ["red", "blue", "green", "pink"];

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 23,
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
    height: 20,
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
function ProductAdd() {
  const [colorName, setColorName] = useState([]);
  const [category, setCategory] = useState([]);
  const [Attributes, setAttributes] = useState([]);
  const [attributeList, setattributeList] = useState([]);
  const [Auth, setAuth] = useState({});
  const [varientData, setVarentData] = useState([]);
  const [Filter, setfilter] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [brand, setBrand] = useState([]);
  const [varientFieldData, setVarentFieldData] = useState([]);

  const [showTable, setShowTable] = useState(Array(nameList.length).fill(false));

  const handleTable = (i) => {
    const newTable = [...showTable];
    newTable[i] = !newTable[i];
    setShowTable(newTable);
  }


  function insertdata() {
    return nameList.map((name) => ({
      name: name,
      amount: "",
      sku: "",
      quantity: "",
      photo: null,
    }));
  }
  // console.log(varientFieldData.photo)

  const handleDelete = (i) => {
    const Images = [...varientFieldData];
    // console.log(Images[i].photo)
    Images[i].photo = null;
    setVarentFieldData(Images);
    // console.log(varientFieldData)
    const fileInput = document.getElementById("component");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDeleteImg = () => {
    // console.log(e.target);
    formik.setFieldValue('seoTags.metaImage', null);
    const metaFileInput = document.getElementById("metaImage");
    if (metaFileInput) {
      metaFileInput.value = "";
    }
  }

  function handleFileUpload(i, arr, e) {
    const updatedFieldValues = [...varientFieldData];
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      updatedFieldValues[i][arr] = reader.result;
      setVarentFieldData(updatedFieldValues);
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    let data = insertdata();
    setVarentFieldData(data);
  }, [nameList]);

  const handleFieldValueChange = (i, arr, value) => {
    const updatedFieldValues = [...varientFieldData];
    updatedFieldValues[i][arr] = value;
    setVarentFieldData(updatedFieldValues);
  };

  async function createProduct(values) {
    try {
      let val = values;
      let data = {
        colours: colorName,
        attributes: Attributes,
        varientData: varientData,
        nameList: nameList,
      };
      val = {
        ...val,
        createdby: Auth.id,
        varientHelper: data,
        productVarient: varientFieldData,
      };
      let response = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/product/create",
        val,
        config
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    function insertName() {
      let namedata = colorName;

      for (let j = 0; j < Filter.length; j++) {
        let dataname = [];
        Filter[j].forEach((arr) => {
          namedata.forEach((color) => {
            let s = `${color}-${arr.name}`;
            dataname = [...dataname, s];
          });
        });
        namedata = dataname;
      }
      setNameList(namedata);
    }
    insertName();
  }, [Filter, colorName, Attributes, varientData]);

  useEffect(() => {
    function datafilter() {
      let data = [];
      for (let i = 0; i < Attributes.length; i++) {
        let value = varientData.filter((arr) => arr.content === Attributes[i]);
        if (value.length !== 0) {
          data = [...data, value];
        }
      }
      setfilter(data);
    }
    datafilter();
  }, [varientData]);

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  async function getattributeList() {
    try {
      let postData = await axios.get(
        "https://panelserver.digitalkrantiindia.com/api/attribute/list",

        config
      );
      setattributeList(postData.data.response);
    } catch (error) {
      throw error;
    }
  }

  async function getCategories() {
    try {
      let postData = await axios.get(
        "https://panelserver.digitalkrantiindia.com/api/product/category/list",

        config
      );
      setCategory(postData.data.response);
    } catch (error) {
      throw error;
    }
  }

  async function getBrand() {
    try {
      let postData = await axios.get(
        "https://panelserver.digitalkrantiindia.com/api/brand/list",

        config
      );
      setBrand(postData.data.response);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (Auth.token) {
      getattributeList();
      getCategories();
      getBrand();
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
      productName: "",
      brandID: "",
      categoryID: "",
      unit: "",
      weight: "",
      productDescription: "",
      lowStockQuantityWarning: "",
      seoTags: {
        metaTitle: "",
        description: "",
        metaImage: "",
      },
      productStockPrice: {
        unitPrice: "",
        setPoint: "",
        discount: "",
        discounttype: "Flat",
        externalLink: "",

        externalLinkButton: "",
      },
      productVideos: {
        videoProvider: "",
        videoLink: "",
      },
      shipConfig: {
        freeShipping: true,
        flatRate: false,
        multipleProducts: false,
      },
      stockVisibilityState: {
        showStockQuantity: false,
        showStockWithTextOnly: false,
        hideStock: false,
      },
      cashOnDelivery: {
        Status: false,
      },
    },

    onSubmit: async (values, { resetForm }) => {
      let result = await createProduct(values);
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

  const handleField = (e) => {
    const updatedFieldValues = [...varientFieldData];
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      let img = reader.result;
      formik.setFieldValue("seoTags.metaImage", img);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Product Information</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="product"
                      label="Product Name"
                      name="productName"
                      value={formik.values.productName}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl required size="small" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="category *">Category</InputLabel>
                    <Select
                      native
                      label="Category *"
                      id="category *"
                      name="categoryID"
                      value={formik.values.categoryID}
                      onChange={(event) => {
                        formik.handleChange(event);
                        formik.setFieldValue("categoryID", event.target.value);
                      }}
                    >
                      <option data-display="Select"></option>
                      {category.map((arr) => (
                        <option key={arr._id} value={arr._id}>
                          {arr.categoryName}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="validationCustom0">Brand</InputLabel>
                    <Select
                      native
                      required
                      label="Brand"
                      id="validationCustom0"
                      name="brandID"
                      value={formik.values.brandID}
                      onChange={(event) => {
                        formik.handleChange(event);
                        formik.setFieldValue("brandID", event.target.value);
                      }}
                    >
                      <option data-display="Select"></option>
                      {brand.map((arr) => (
                        <option key={arr._id} value={arr._id}>
                          {arr.brandName}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-outlined"
                      label="Unit"
                      name="unit"
                      value={formik.values.unit}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-weight"
                      label="Weight (In Kg)"
                      name="weight"
                      value={formik.values.weight}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Product Videos</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group col-md-12">
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="validationCusto">Video Provider</InputLabel>
                    <Select
                      native
                      required
                      id="validationCusto"
                      label="Video Provider"
                      name="productVideos.videoProvider"
                      value={formik.values.productVideos.videoProvider}
                      onChange={(event) => {
                        formik.handleChange(event);
                        formik.setFieldValue(
                          "productVideos.videoProvider",
                          event.target.value
                        );
                      }}
                    >
                      <option data-display="Select"></option>
                      <option key={"Youtube"} value={"Youtube"}>
                        Youtube
                      </option>
                      <option key={"Dailymotion"} value={"Dailymotion"}>
                        Dailymotion
                      </option>
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      size="small"
                      id="video"
                      label="Video Link"
                      name="productVideos.videoLink"
                      value={formik.values.productVideos.videoLink}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Product Variation</h6>
              </div>
              <div className="card-body p-3">
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel htmlFor= 'color' >Colours</InputLabel>
                  <Select
                    multiple
                    inputProps={{
                      id: 'color',
                    }}
                    name="colorName"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    input={<OutlinedInput label="Colours" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value, i) => (
                          console.log(selected),
                          <Chip
                            key={value}
                            size="small"
                            label={value}
                            onDelete={() =>
                              setColorName(
                                colorName.filter((item) => item !== value)
                              )
                            }
                            deleteIcon={
                              <CancelIcon
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                            }
                          />
                        ))}
                      </Stack>
                    )}
                  >
                    {names.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {name}
                        {colorName.includes(name) ? (
                          <CheckIcon color="info" />
                        ) : null}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="card-body p-3">
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel htmlFor ='select-attribute'>Attributes</InputLabel>
                  <Select
                    multiple
                    inputProps={{
                      id: "select-attribute"
                    }}
                    value={Attributes}
                    name="Attributes"
                    onChange={(e) => {
                      setAttributes(e.target.value);
                    }}
                    input={<OutlinedInput label="Attributes" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            size="small"
                            label={value}
                            onDelete={() => {
                              setAttributes(
                                Attributes.filter((item) => item !== value)
                              );
                            }}
                            deleteIcon={
                              <CancelIcon
                                onMouseDown={(event) => event.stopPropagation()}
                              />
                            }
                          />
                        ))}
                      </Stack>
                    )}
                  >
                    {attributeList.map((name, i) => (
                      <MenuItem
                        key={i}
                        value={name.attributeName}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {name.attributeName}
                        {Attributes.includes(name.attributeName) ? (
                          <CheckIcon color="info" />
                        ) : null}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {Attributes.length !== 0
                ? Attributes.map((arr, i) => {
                    const selectedValuesForAttribute = varientData.filter(
                      (item) => item.content === arr
                    );

                    const attribute = attributeList.find(
                      (attr) => attr.attributeName === arr
                    );

                    return (
                      <div className="card-body p-3" key={i}>
                        <FormControl size="small" sx={{ width: "100%" }}>
                          <InputLabel>{arr}</InputLabel>
                          <Select
                            multiple
                            value={selectedValuesForAttribute}
                            onChange={(e) => {
                              const selected = e.target.value;
                              const updatedVarientData = varientData.filter(
                                (item) => item.content !== arr
                              );
                              selected.forEach((value) => {
                                if (
                                  !updatedVarientData.some(
                                    (item) => item.name === value.name
                                  )
                                ) {
                                  updatedVarientData.push({
                                    name: value.name,
                                    content: arr,
                                  });
                                }
                              });
                              setVarentData(updatedVarientData);
                            }}
                            input={<OutlinedInput label={arr} />}
                            renderValue={(selected) => (
                              <Stack gap={1} direction="row" flexWrap="wrap">
                                {selected.map((value) => (
                                  <Chip
                                    key={value.name}
                                    size="small"
                                    label={value.name}
                                    onDelete={() => {
                                      setVarentData(
                                        varientData.filter(
                                          (item) => item !== value
                                        )
                                      );
                                    }}
                                    deleteIcon={
                                      <CancelIcon
                                        onMouseDown={(event) =>
                                          event.stopPropagation()
                                        }
                                      />
                                    }
                                  />
                                ))}
                              </Stack>
                            )}
                          >
                            {attribute?.values.map((name, i) => (
                              <MenuItem
                                key={i}
                                value={{
                                  name: name,
                                  content: attribute.attributeName,
                                }}
                                sx={{ justifyContent: "space-between" }}
                              >
                                {name}
                                {selectedValuesForAttribute.some(
                                  (item) => item.name === name
                                ) ? (
                                  <CheckIcon color="info" />
                                ) : null}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    );
                  })
                : ""}
            </div>

            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Product price + stock</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="Unit price"
                      label="Unit price"
                      name="productStockPrice.unitPrice"
                      value={formik.values.productStockPrice.unitPrice}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group col-md-12">
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          required
                          size="small"
                          id="discount"
                          label="Discount"
                          name="productStockPrice.discount"
                          value={formik.values.productStockPrice.discount}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group col-md-12">
                      <FormControl size="small" sx={{ width: "100%" }}>
                        <Select
                          native
                          required
                          id="flate"
                          name="productStockPrice.discounttype"
                          value={formik.values.productStockPrice.discounttype}
                          onChange={(event) => {
                            formik.handleChange(event);
                            formik.setFieldValue(
                              "productStockPrice.discounttype",
                              event.target.value
                            );
                          }}
                        >
                          <option key={"dd"} value={"Flat"}>
                            Flat
                          </option>
                          <option key={"vvvb"} value={"Percent"}>
                            Percent
                          </option>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="setpoint"
                      label="Set Point"
                      name="productStockPrice.setPoint"
                      value={formik.values.productStockPrice.setPoint}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>

                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-ex"
                      label="External link"
                      name="productStockPrice.externalLink"
                      value={formik.values.productStockPrice.externalLink}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-button"
                      label="External link button text"
                      name="productStockPrice.externalLinkButton"
                      value={formik.values.productStockPrice.externalLinkButton}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                {/* varient table */}
                {nameList.map((arr, i) => {
                  return (
                    <div className="form-group col-md-12">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ border: "1px solid #bbbdc4" }}
                              align="center"
                            >
                              Variant
                            </TableCell>

                            <TableCell
                              sx={{ border: "1px solid #bbbdc4", width: "5%" }}
                              align="center"
                            >
                              Variant Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow >
                            <TableCell sx={{ border: "1px solid #bbbdc4" }}>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleTable(i)}
                              >
                                {showTable[i] ? (
                                  <RemoveIcon sx={{ color: "red" }} />
                                ) : (
                                  <AddIcon color="primary" />
                                )}
                              </IconButton>
                              {arr}
                            </TableCell>
                            <TableCell sx={{ border: "1px solid #bbbdc4" }}>
                              <FormControl sx={{ width: "100%" }}>
                                <TextField
                                  required
                                  size="small"
                                  id="component-outlined"
                                  value={
                                    varientFieldData.length > 0
                                      ? varientFieldData[i]?.amount
                                      : "" || ""
                                  }
                                  onChange={(e) =>
                                    handleFieldValueChange(
                                      i,
                                      "amount",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      {showTable[i]  && (
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                variant="head"
                                sx={{ border: "1px solid #bbbdc4" }}
                              >
                                SKU
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bbbdc4" }}>
                                <FormControl sx={{ width: "100%" }}>
                                  <TextField
                                    required
                                    size="small"
                                    id="component-outlined"
                                    value={
                                      varientFieldData.length > 0
                                        ? varientFieldData[i]?.sku
                                        : "" || ""
                                    }
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        i,
                                        "sku",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                variant="head"
                                sx={{
                                  border: "1px solid #bbbdc4",
                                  width: "20%",
                                }}
                              >
                                Quantity
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bbbdc4" }}>
                                <FormControl sx={{ width: "100%" }}>
                                  <TextField
                                    required
                                    size="small"
                                    id="component-outlined"
                                    value={
                                      varientFieldData.length > 0
                                        ? varientFieldData[i]?.quantity
                                        : "" || ""
                                    }
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        i,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                variant="head"
                                sx={{
                                  border: "1px solid #bbbdc4",
                                  width: "20%",
                                }}
                              >
                                Photo
                              </TableCell>
                              <TableCell sx={{ border: "1px solid #bbbdc4" }}>
                                <FormControl sx={{ width: "100%" }}>
                                  <input
                                    className="form-control form-control-file"
                                    type="file"
                                    id="component"
                                    onChange={(e) => {
                                      handleFileUpload(i, "photo", e);
                                    }}
                                  />
                                </FormControl>
                                {varientFieldData[i]?.photo ? (
                                  <div
                                    style={{
                                      position: "relative",
                                      display: "inline-block",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <img
                                      className="card-img-top"
                                      src={
                                        varientFieldData.length > i
                                          ? varientFieldData[i].photo
                                          : ""
                                      }
                                      alt=""
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                        marginTop: "4px",
                                        border: "1px solid",
                                        position: "relative",
                                      }}
                                    />
                                    <IconButton
                                      sx={{
                                        padding: 0,
                                        position: "absolute",
                                        top: 0,
                                        right: "-10px",
                                        zIndex: 1,
                                      }}
                                      aria-label="delete"
                                      onClick={() => handleDelete(i)}
                                    >
                                      <Clear
                                        sx={{
                                          backgroundColor: "#f7f3f3",
                                          borderRadius: "50%",
                                        }}
                                      />
                                    </IconButton>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">SEO Meta Tags</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-meta"
                      label="Meta Title"
                      name="seoTags.metaTitle"
                      value={formik.values.seoTags.metaTitle}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="outlined-multiline-flexible"
                      label="Description"
                      name="seoTags.description"
                      multiline
                      maxRows={8}
                      value={formik.values.seoTags.description}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
                <div className="form-group">
                  <div className="form-file mt-2">
                    <input
                      type="file"
                      className="form-control form-control-file"
                      id="metaImage"
                      onChange={handleField}
                    />
                  </div>
                  {formik.values.seoTags.metaImage ? (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        className="card-img-top"
                        src={formik.values.seoTags.metaImage}
                        alt=""
                        style={{
                          height: "100px",
                          width: "100px",
                          marginTop: "4px",
                          border: "1px solid",
                          position: "relative",
                        }}
                      />
                      <IconButton
                        sx={{
                          padding: 0,
                          position: "absolute",
                          top: 0,
                          right: "-10px",
                          zIndex: 1,
                        }}
                        aria-label="delete"
                        onClick={handleDeleteImg}
                      >
                        <Clear
                          sx={{
                            backgroundColor: "#f7f3f3",
                            borderRadius: "50%",
                          }}
                        />
                      </IconButton>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Stock Visibility State</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="free">
                    Free Shipping
                  </label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id='free'
                        name="shipConfig.freeShipping"
                        checked={formik.values.shipConfig.freeShipping}
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="flat">Flat Rate</label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id='flat'
                        name="shipConfig.flatRate"
                        checked={formik.values.shipConfig.flatRate}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "shipConfig.freeShipping",
                            false
                          );
                          formik.setFieldValue(
                            "shipConfig.flatRate",
                            e.target.checked
                          );
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="show stock multiple">
                    Is Product Quantity Mulitiply
                  </label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id="show stock multiple"
                        name="shipConfig.multipleProducts"
                        checked={formik.values.shipConfig.multipleProducts}
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Low Stock Quantity Warning</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group col-md-12">
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      required
                      size="small"
                      id="component-qn"
                      label="Quantity"
                      name="lowStockQuantityWarning"
                      value={formik.values.lowStockQuantityWarning}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Stock Visibility State</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="show stock qon">
                    Show Stock Quantity
                  </label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id="show stock qon"
                        name="stockVisibilityState.showStockQuantity"
                        checked={
                          formik.values.stockVisibilityState.showStockQuantity
                        }
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="show stock">
                    Show Stock With Text Only
                  </label>
                  <div className="col-md-6" >
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id="show stock"
                        name="stockVisibilityState.showStockWithTextOnly"
                        checked={
                          formik.values.stockVisibilityState
                            .showStockWithTextOnly
                        }
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="stock">Hide Stock</label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        id='stock'
                        name="stockVisibilityState.hideStock"
                        checked={formik.values.stockVisibilityState.hideStock}
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header rounded">
                <h6 className="card-title">Cash On Delivery</h6>
              </div>
              <div className="card-body p-3">
                <div className="form-group row">
                  <label className="col-md-6 col-from-label" htmlFor="status">Status</label>
                  <div className="col-md-6">
                    <label className="col-md-6 col-from-label" htmlFor="status">
                      <IOSSwitch
                        sx={{ m: 0 }}
                        name="cashOnDelivery.Status"
                        id='status'
                        checked={formik.values.cashOnDelivery.Status}
                        onChange={formik.handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div dir="rtl">
              <Button type="submit" variant="contained">
                Save & Publish
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductAdd;
