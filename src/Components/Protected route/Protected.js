import React from "react";
import { useEffect, useState } from "react";
import { getTokenFromSessionStorage } from "../utils/Notifications";
import { useNavigate } from "react-router-dom";

function Protected(props) {
  const [Auth, setAuth] = useState(false);
  const { Component } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (!getTokenFromSessionStorage()) {
      setAuth(true);
      navigate("/");
    } else {
      setAuth(true);
    }
  }, []);
  return (
    <>
      <Component />
    </>
  );
}

export default Protected;
