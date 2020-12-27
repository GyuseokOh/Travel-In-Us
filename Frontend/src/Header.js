import React, { Component } from "react";
import { Navbar, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class Header extends Component {

  state = {
    loginDisplay:"block",
    logoutDisplay:"inline-block"
  };

  componentDidMount() {
    if ($.cookie("login_id")) {
      this.setState({
        loginDisplay: "none",
        logoutDisplay: "block"
      });
    } else {
      this.setState({
        loginDisplay: "block",
        logoutDisplay: "none"
      });
    }
  }

  logout = () => {
    axios
      .get("http://localhost:8080/member/logout", {
        headers
      })
      .then(returnData => {
        if (returnData.data.message) {
          $.removeCookie("login_id");
          $.removeCookie("login_email");
          $.removeCookie("login_name");
          alert("로그아웃 되었습니다!");
          window.location.href = "/";
        }
      });
  };
  render() {
    
    const slides = [
      { title: 'First item', description: 'Lorem ipsum',image:"./img/main1.png"},
      { title: 'Third item', description: 'Lorem ipsum',image:"./img/main2.png"},
      { title: 'Second item', description: 'Lorem ipsum',image:"./img/main3.png"},
      { title: 'Third item', description: 'Lorem ipsum',image:"./img/main4.png"}
    ];

    const buttonStyle = {
      margin: "0px 0px 0px 10px",
      display: "block"
    };

    const loginbuttonStyle = {
      margin: "0px 0px 0px 10px",
      display: this.state.loginDisplay
    };

    const logoutbuttonStyle = {
      margin: "0px 0px 0px 10px",
      display: this.state.logoutDisplay
    };
      return (
        <div>
          <Navbar style={{margin:"0px 20px 0px 30px"}}>
            <Navbar.Brand href="/" style={{fontWeight:"bold", fontStyle:"italic"}}>Travel In Us</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <NavLink to="/map/main">
                <button class='button' style={buttonStyle}>
                  지도
                </button>
              </NavLink>
              <NavLink to="/login">
                <button class='recbutton' style={loginbuttonStyle}>
                  로그인
                </button>
              </NavLink>
              <button class='delbutton' style={logoutbuttonStyle} onClick={this.logout} >
                "{$.cookie("login_name")}"로그아웃
              </button>
            </Navbar.Collapse>
          </Navbar>
          <Slider autoplay={5500} infinite={true} nextButton={null} previousButton={null}>
            {slides.map((slide, index) => <div key={index}>
              <Image src={slide.image} fluid/>
            </div>)}
          </Slider>
        </div>
      );
  }
}

export default Header;
