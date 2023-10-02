import React, { useState, useEffect } from 'react'
import {
 
  Slide,
  Switch,
} from "@mui/material";
import axios from "axios";
import { getTokenFromSessionStorage, showToast } from "../utils/Notifications";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';


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
function Product() {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const [Auth, setAuth] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [spage, setSpage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [totalPage, setTotalPage] = useState(0);


  const pageClick = (selected) => {
    if (selected >= 1 && selected <= totalPage && selected !== spage)
      setSpage(selected);
    refresh ? setRefresh(false) : setRefresh(true);
  };

  const handleClick = (e) => {
    let ID = e.currentTarget.id;
    navigate(`/dashboard/product/update/${ID}`);
  };

  async function updateStatus(values) {
    let val = values;
    val = { ...values, updatedby: Auth.id };
    // console.log(val)
    try {
      const postData = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/product/status",
        val,
        config
      );
      const result = postData.data;
      // console.log(result, 'status is')
      showToast(result.message, result.status);
    } catch (error) {
      throw error;
    }
  }

  async function handleStatusChange(i) {
    const updatedList = [...productList];

    updatedList[i].status = !updatedList[i].status;

    let values = {
      // updatedby: null,
      productID: updatedList[i]._id,
      status: updatedList[i].status ? "1" : "0",
    };
    await updateStatus(values);
    refresh ? setRefresh(false) : setRefresh(true);
  }

  
  async function getProductList() {
    let value = {
      page: spage,
      limit: itemsPerPage,
    };
    const postData = await axios.post(
      "https://panelserver.digitalkrantiindia.com/api/product/",
      value,
      config
    );
    // console.log(postData.data.response.docs);
    setProductList(postData.data.response.docs);
    setTotalPage(postData.data.response.totalPages);
  }

 
  async function deleteData(value) {
    try {
      let response = await axios.post(
        "https://panelserver.digitalkrantiindia.com/api/product/delete",
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
    const value = { colorID: e.currentTarget.id, updatedby: Auth.id };
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
 

  useEffect(() => {
    if (Auth.token) {
      getProductList();
    }
  }, [Auth, refresh, spage]);

  useEffect(() => {
    let token = getTokenFromSessionStorage();
    if (token) {
      let jsondata = JSON.parse(token);
      setAuth(jsondata);
    }
  }, []);

  return (
    <>
     <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title m-2">All Products</h4>
          <button className="btn btn-success" 
          onClick={() => {
            navigate("/dashboard/product/add");
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
                  <th>Product Name</th>
                  <th>Created by</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {
                <tbody>
                  {productList.map((arr, i) => (
                    <tr key={arr._id}>
                      <td>{arr.productName}</td>
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
              }
            </table>
          </div>
        </div>
        <div className="card-footer ">
          <div className="d-flex justify-content-end  w-100">
            {productList.length && (
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
    </>
  )
}

export default Product