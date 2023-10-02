import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Select } from "antd";
import "./permissions.css";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Button from "@mui/material/Button";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import MenuPage from "../Menu/MenuPage";

function Permissions() {
  const [permissions, setPermissions] = useState({
    create: false,
    update: false,
    view: false,
    delete: false,
  });

  const [role, setRole] = useState([]);
  const [modules, setModule] = useState([]);
  const [handlepermission, setHandelpermission] = useState([]);
  const [roleID, setRoleID] = useState();
  const [Auth, setAuth] = useState({});

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  const response = async () => {
    let values = {
      page: "1",
      limit: "5000",
    };
    const getdata = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/rmodules/",
      values,
      config
    );
    setModule(getdata.data.response.docs);
    const role = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/role/",
      values,
      config
    );
    setRole(role.data.response.docs);
  };

  let putData = async () => {
    let newData = [];
    for (let i = 0; i < modules.length; i++) {
      let data = modules[i].function[0];
      data = { ...data, key: modules[i].slug };
      newData.push(data);
    }
    setHandelpermission(newData);
  };

  useEffect(() => {
    if (Auth.token) {
      response();
    }
  }, [Auth]);

  async function submit() {
    try {
      let arr = [];

      for (let i = 0; i < modules.length; i++) {
        arr = [...arr, modules[i].function[0]];
      }
      let postValue = {
        roleID: roleID,
        permission: arr,
        createdby: Auth.id,
      };

      if (roleID === undefined || roleID === "") {
        showToast("!please Select Role", false);
      } else {
        const post = await axios.post(
          "https://panelserver.digitalkrantiindia.com/api/access/create",
          postValue,
          config
        );
        const result = await post.data;
        if (result) {
          showToast(result.message, result.status);
        } else {
          showToast(
            "! Oops Something went wrong. Please try later",
            result.status
          );
        }
      }
    } catch (error) {
      showToast("! ERR_BAD_REQUEST", "warning");
    }
  }

  useEffect(() => {
    putData();
  }, [modules]);

  const handlePermissionChange = (permissionKey, moduleIndex) => (event) => {
    const updatedModules = [...modules]; // Create a shallow copy of the modules array
    const selectedModule = updatedModules[moduleIndex]; // Get the selected module
    selectedModule.function[0][permissionKey] = event.target.checked;
    setModule(updatedModules);
  };

  const handleChange = (value) => {
    setRoleID(value);
  };

  function DropdownOptions() {
    let arr = [];
    for (let i = 0; i < role.length; i++) {
      arr = [...arr, { value: role[i]._id, label: role[i].rolename }];
    }
    return arr;
  }

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
      <Box component="main" sx={{}}>
        <Container sx={{ width: "90%", ml: 5, mt: 3 }}>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 50,
            }}
          >
            <div className="box-text">
              <h5>Permissions</h5>
            </div>
            <div className="text-right">
              <Select
                defaultValue="Select Role"
                style={{
                  width: 120,
                }}
                onChange={handleChange}
                options={DropdownOptions()}
              />
            </div>
          </Paper>
        </Container>
        {/* <div className="card-body">
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((arr, i) => (
                    <tr key={arr._id}>
                      <td></td>
                      <td>
                        <div className="options">
                          <FormControlLabel
                            label="Create"
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                checked={arr.function[0].create}
                                onChange={handlePermissionChange("create", i)}
                              />
                            }
                            labelPlacement="top"
                            style={{ color: "blue" }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="options">
                          <FormControlLabel
                            label="Update"
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                checked={arr.function[0].update}
                                onChange={handlePermissionChange("update", i)}
                              />
                            }
                            labelPlacement="top"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="options">
                          <FormControlLabel
                            label="view"
                            control={<IOSSwitch sx={{ m: 1 }} />}
                            labelPlacement="top"
                            checked={arr.function[0].view}
                            onChange={handlePermissionChange("view", i)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="options">
                          <FormControlLabel
                            label="Delete"
                            control={<IOSSwitch sx={{ m: 1 }} />}
                            labelPlacement="top"
                            checked={arr.function[0].delete}
                            onChange={handlePermissionChange("delete", i)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}

        {modules.map((arr, i) => {
          return (
            <>
              <Container sx={{ width: "90%", ml: 5, mt: 3 }}>
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // backgroundColor: "rgb(228,226,226)",
                    // borderRadius: "30px",
                  }}
                >
                  <div
                    style={{
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      width: "30%",
                    }}
                  >
                    <p className="text">{arr.modelname}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "80%",
                      padding: "2%",
                    }}
                  >
                    <div className="options">
                      <FormControlLabel
                        label="Create"
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            checked={arr.function[0].create}
                            onChange={handlePermissionChange("create", i)}
                          />
                        }
                        labelPlacement="top"
                        style={{ color: "blue" }}
                      />
                    </div>
                    <div className="options">
                      <FormControlLabel
                        label="Update"
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            checked={arr.function[0].update}
                            onChange={handlePermissionChange("update", i)}
                          />
                        }
                        labelPlacement="top"
                      />
                    </div>
                    <div className="options">
                      <FormControlLabel
                        label="view"
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        labelPlacement="top"
                        checked={arr.function[0].view}
                        onChange={handlePermissionChange("view", i)}
                      />
                    </div>
                    <div className="options">
                      <FormControlLabel
                        label="Delete"
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        labelPlacement="top"
                        checked={arr.function[0].delete}
                        onChange={handlePermissionChange("delete", i)}
                      />
                    </div>
                  </div>
                </Paper>
              </Container>
            </>
          );
        })}
        <Container sx={{ width: "90%", ml: 5, mt: 3 }}>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 60,
            }}
          >
            <div className="box-text"></div>
            <div className="text-right">
              <Button
                variant="contained"
                onClick={() => {
                  submit();
                }}
              >
                Save
              </Button>
            </div>
          </Paper>
        </Container>
      </Box>
      {/* </MenuPage> */}
    </>
  );
}

export default Permissions;
