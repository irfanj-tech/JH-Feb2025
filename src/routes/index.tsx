import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "components/Main";
import Login from "components/Login";
import Signup from "components/Signup";
import Details from "components/Details";
import NotFound from "components/NotFound";
import {PATH} from 'consts';

const RoutesComponent: React.FC = () => {
  return (
      <Routes>
        <Route path={PATH.INDEX} element={<Main />} />
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.SIGNUP} element={<Signup />} />
        <Route path={PATH.ARTICLE_DETAIL} element={<Details />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default RoutesComponent;
