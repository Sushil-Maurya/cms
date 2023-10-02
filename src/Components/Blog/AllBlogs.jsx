import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import MenuPage from "../Menu/MenuPage";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { showToast, getTokenFromSessionStorage } from "../utils/Notifications";
import { useNavigate } from "react-router-dom";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function AllBlogs() {
  const [blogList, setBlogList] = useState([]);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const [Auth, setAuth] = useState({});
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [refresh, setRefresh] = useState(false);

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

  const getList = async () => {
    try {
      let value = {
        page: spage,
        limit: itemsPerPage,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
          "Content-Type": "application/json",
        },
      };
      let getData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/blog/",
        value,
        config
      );
      setBlogList(getData.data.response.docs);
      setTotalPage(getData.data.response.totalPages);
    } catch (error) {}
  };

  const handleClick = (e) => {
    let ID = e.currentTarget.id;
    navigate(`/dashboard/blog/update/${ID}`);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };
    const config = {
      headers: {
        Authorization: `Bearer ${Auth.token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/blog/status",
        val,
        config
      );
      const result = postData.data;
      showToast(result.message, result.status);
    } catch (error) {
      throw error;
    }
  }

  async function deleteData(value) {
    try {
      let response = await axios.delete(
        "https://panelserver.digitalkrantiindia.com/api/blog/delete",

        {...config,
       data: value}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (e) => {
    const value = { blogId: e.currentTarget.id };
    let result = await deleteData(value);
    console.log(result);
    if (result) {
      showToast(result.message, result.status);
      refresh ? setRefresh(false) : setRefresh(true);
    } else {
      showToast("! Oops Something went wrong. Please try later", result.status);
    }
  };

  async function handleStatusChange(i) {
    const updatedList = [...blogList];

    // Toggle the status of the module at index i
    updatedList[i].status = !updatedList[i].status;

    // Update the listvalue state with the modified array
    let values = {
      blogId: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    status ? setStatus(false) : setStatus(true);
    // setBlogList(updatedList);
    // window.location.reload();
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
    if (Auth.token) {
      getList();
    }
  }, [status, Auth, spage, refresh]);

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
      <Container sx={{ width: "90%", ml: 5, mt: 3 }}>
        <div className="f1">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title m-2">All Blogs</h4>
              <button
                className="btn btn-success"
                onClick={() => {
                  navigate("/dashboard/blog/create");
                }}
              >
                Add
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogList.map((arr, i) => (
                      <tr key={arr._id}>
                        <td>{arr.title}</td>
                        <td>{arr.authorId ? arr.authorId.authorName : ""}</td>
                        <td>
                          <IOSSwitch
                            id={arr._id}
                            sx={{ m: 1 }}
                            checked={arr.status ? true : false}
                            onChange={() => handleStatusChange(i)}
                          />
                        </td>
                        <td>{arr.createdby ? arr.createdby.name : ""}</td>
                        <td>
                          <a
                            id={arr._id}
                            onClick={(e) => handleClick(e)}
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
                </table>
              </div>
            </div>
            <div className="card-footer ">
              <div className="d-flex justify-content-end  w-100">
                {blogList.length && (
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
      </Container>
      {/* </MenuPage> */}
    </>
  );
}

export default AllBlogs;
