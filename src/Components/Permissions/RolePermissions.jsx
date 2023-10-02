import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import "./RolePermission.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MenuPage from "../Menu/MenuPage";
import { getTokenFromSessionStorage, showToast } from "../utils/Notifications";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

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
function RolePermissions() {
  const [permissions, setPermissions] = useState([]);
  const [Auth, setAuth] = useState({});
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
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

  const handleClick = (e) => {
    // setRoleID(event.currentTarget.id);
    let ID = e.currentTarget.id;
    navigate(`/dashboard/permission/update/${ID}`);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };
    console.log(val);
    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/access/status",
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
    const updatedList = [...permissions];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      accessID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  const getdata = async () => {
    const value = {
      page: spage,
      limit: itemsPerPage,
    };
    const details = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/access/",
      value,
      config
    );
    setPermissions(details.data.response.docs);
    // console.log(permissions[0].roleID.rolename);
    setTotalPage(details.data.response.totalPages);
  };

  useEffect(() => {
    if (Auth.token) {
      getdata();
    }
  }, [Auth, refresh]);

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
        <div className="card">
          <div className="card-header " style={{ backgroundColor: "white" }}>
            <h4 className="card-title m-2">Permissions</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.roleID.rolename}</td>
                      <td>{arr.createdby.name}</td>
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
                          id={arr.roleID._id}
                          onClick={(e) => handleClick(e)}
                          className="btn btn-primary shadow btn-xs sharp me-1 "
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </a>
                        <a
                          href="#d"
                          className="btn btn-danger shadow btn-xs sharp me-1"
                        >
                          <FontAwesomeIcon icon={faTrash} id={arr.roleID._id} />
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
              {permissions.length && (
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
      {/* </MenuPage> */}
    </>
  );
}

export default RolePermissions;
