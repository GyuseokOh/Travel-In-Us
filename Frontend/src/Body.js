import React, { Component } from "react";
import Login from "./Login";
import Join from "./Join";
import Board from "./Board";
import Boardwrite from "./Boardwrite";
import Boarddetail from "./Boarddetail";
import Find from "./Find";
import Map from './Map/Map';
import { Route, Switch } from "react-router-dom";
import {} from "jquery.cookie";

class Body extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/boardWrite" component={Boardwrite}></Route>
          <Route path="/board/detail" component={Boarddetail}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/join" component={Join}></Route>
          <Route path='/find' component={Find}></Route>
          <Route path='/map/:address' component={Map}></Route>
          <Route exact path="/" component={Board}></Route>
        </Switch>
      </div>
    );
  }
}

export default Body;
