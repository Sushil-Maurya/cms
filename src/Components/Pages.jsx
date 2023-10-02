import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login/Login";
import PermissionUpdate from "./Permissions/PermissionUpdate";
import RolePermissions from "./Permissions/RolePermissions";
import Permissions from "./Permissions/Permissions";
import Module from "./Permissions/Module";
import Roles from "./Roles/Roles";
import AllUsers from "./Users/AllUsers";
import Dashboard from "./Dashboard/Dashboard";
import AddUser from "./Users/AddUser";
import UpdateUser from "./Users/UpdateUser";
import Protected from "./Protected route/Protected";
import { useState } from "react";
import { useEffect } from "react";
import { getTokenFromSessionStorage } from "./utils/Notifications";
import Category from "./Blog/Category";
import AddTags from "./Blog/AddTags";
import Author from "./Blog/Author";
import AddBlog from "./Blog/AddBlog";
import AllBlogs from "./Blog/AllBlogs";
import UpdateBlog from "./Blog/UpdateBlog";
import CkEditor from "./Editor/CkEditor";
import ProductAdd from "./Product/ProductAdd";
import Brand from "./Product/Brand";
import Attribute from "./Product/Attribute";
import Color from "./Product/Color";
import Product from "./Product/Product";
import ProductUpdate from "./Product/ProductUpdate";
import ProductCategory from "./Product/ProductCategory";

function Pages() {
  const [Auth, setAuth] = useState(false);
  useEffect(() => {
    if (getTokenFromSessionStorage()) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Protected Component={Dashboard} />}>
          <Route path="/dashboard/role" element={<Roles />} />
          <Route path="/dashboard/blog/create" element={<AddBlog />} />
          <Route path="/dashboard/blog/" element={<AllBlogs />} />
          <Route
            path="/dashboard/blog/update/:blogID"
            element={<UpdateBlog />}
          />
          <Route path="/dashboard/permission" element={<RolePermissions />} />
          <Route
            path="/dashboard/permission/create"
            element={<Permissions />}
          />
          <Route
            path="/dashboard/permission/update/:userId"
            element={<PermissionUpdate />}
          />
          <Route path="/dashboard/permission/module" element={<Module />} />

          <Route path="/dashboard/users" element={<AllUsers />} />
          <Route path="/dashboard/user/add" element={<AddUser />} />
          <Route
            path="/dashboard/user/update/:userId"
            element={<UpdateUser />}
          />
          <Route path="/dashboard/blog/category" element={<Category />} />
          <Route path="/dashboard/blog/tag" element={<AddTags />} />
          <Route path="/dashboard/blog/author" element={<Author />} />
          <Route path="/dashboard/edit/ckedit" element={<CkEditor />} />
          <Route path="/dashboard/product/add" element={<ProductAdd />} />
          <Route path="/dashboard/product/category" element={<ProductCategory />} />
          <Route path="/dashboard/product/brand" element={<Brand />} />
          <Route path="/dashboard/product/attribute" element={<Attribute />} />
          <Route path="/dashboard/product/color" element={<Color/>} />
          <Route path="/dashboard/product/" element={<Product/>} />
          <Route
            path="/dashboard/product/update/:productID"
            element={<ProductUpdate />}
          />
        </Route>
        <Route
          path="/"
          element={
            Auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={Auth ? <Navigate to="/dashboard" /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default Pages;
