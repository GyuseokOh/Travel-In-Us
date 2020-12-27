import React from "react";
import ReactDOM from "react-dom";
import {HashRouter} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Body from "./Body";

ReactDOM.render(
  <HashRouter>
    <Header/>
    <Body/>
  </HashRouter>,
  document.querySelector("body")
);
