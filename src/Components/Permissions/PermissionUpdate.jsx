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
import { produce } from "immer";
import CircularProgress from "@mui/material/CircularProgress";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import MenuPage from "../Menu/MenuPage";
import { useParams } from "react-router-dom";

function PermissionUpdate() {
  const [role, setRole] = useState([]);
  const [permission, setPermission] = useState([]);
  const [handlepermission, setHandelpermission] = useState([]);
  const [roleId, setroleId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [Auth, setAuth] = useState({});
  const { userId } = useParams();

  const config = {
    headers: {
      Authorization: `Bearer ${Auth.token}`,
      "Content-Type": "application/json",
    },
  };

  const response = async () => {
    setIsLoading(true);

    let values = {
      roleID: userId,
    };
    const getdata = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/access/find",
      values,
      config
    );
    setPermission(getdata.data.response.docs);
    setHandelpermission(getdata.data.response.docs[0].permissions);
    setroleId(getdata.data.response.docs[0].roleID._id);

    const role = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/role/",
      {
        page: "1",
        limit: "100000",
      },
      config
    );
    setRole(role.data.response.docs);
    setIsLoading(false);
  };

  useEffect(() => {
    if (Auth.token) {
      response();
    }
  }, [Auth]);

  async function submit() {
    try {
      let postValue = {
        roleID: roleId,
        permission: handlepermission,
        accessID: permission[0]._id,
      };
      if (roleId === undefined || roleId === "") {
        console.log("please fill role id");
      } else {
        const post = await axios.put(
          "https://panelserver.digitalkrantiindia.com/api/access/update",
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

  const handlePermissionChange = (permissionKey, moduleIndex) => (event) => {
    setHandelpermission((prevState) =>
      produce(prevState, (draft) => {
        const selectedModule = draft[moduleIndex];
        selectedModule[permissionKey] = event.target.checked;
      })
    );
  };

  const handleChange = (value) => {
    setroleId(value);
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
              {isLoading ? (
                <CircularProgress size={20} thickness={5} /> // Show loader while loading
              ) : (
                <Select
                  defaultValue={
                    permission.length > 0 ? permission[0].roleID.rolename : ""
                  }
                  style={{
                    width: 120,
                  }}
                  onChange={handleChange}
                  options={DropdownOptions()}
                />
              )}
            </div>
          </Paper>
        </Container>

        {handlepermission.map((arr, i) => {
          return (
            <div key={i}>
              <Container sx={{ width: "90%", ml: 5, mt: 3 }}>
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgb(228,226,226)",
                  }}
                >
                  <div
                    style={{
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      width: "30%",
                    }}
                  >
                    <p className="text">{arr.key}</p>
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
                            checked={arr.create}
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
                            checked={arr.update}
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
                        checked={arr.view}
                        onChange={handlePermissionChange("view", i)}
                      />
                    </div>
                    <div className="options">
                      <FormControlLabel
                        label="Delete"
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        labelPlacement="top"
                        checked={arr.delete}
                        onChange={handlePermissionChange("delete", i)}
                      />
                    </div>
                  </div>
                </Paper>
              </Container>
            </div>
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
                Update
              </Button>
            </div>
          </Paper>
        </Container>
      </Box>
      {/* </MenuPage> */}
    </>
  );
}

export default PermissionUpdate;
