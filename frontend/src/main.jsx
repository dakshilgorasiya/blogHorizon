import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Header, Footer } from "./components";
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  CompleteProfile,
  ViewBlogPage,
  ProfilePage,
  CreateBlogPage,
  BookmarkBlog
} from "./pages";
import Layout from "./Layout.jsx";
import { View } from "lucide-react";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout />}>
      <Route path="" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/view-blog/:id" element={<ViewBlogPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/create-blog" element={<CreateBlogPage />} />
      <Route path="/edit-blog/:id" element={<CreateBlogPage update={true} />} />
      <Route path="/bookmark" element={<BookmarkBlog />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
