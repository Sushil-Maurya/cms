import React from "react";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainLayout(props) {
  return (
    <div>
      {props.children}
      <ToastContainer />
    </div>
  );
}

export default MainLayout;
