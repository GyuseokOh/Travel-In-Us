import React, { Component } from "react";
import { Table, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import './button.css'
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function findname(id, userlist){
  for(var i=0;i<userlist.length;i++){
    if(userlist[i]._id===id){
      return userlist[i].name;
    }
  }
}

class BoardRow extends Component {

  render() {

    function findimg(tag){
      if(tag==='바다'){
        return <Image src='./img/board_sea.png' rounded style={{width:'400px',height:'400px'}}></Image>;
      }
      else if(tag==='도시'){
        return <Image src='./img/board_city.png' rounded style={{width:'400px',height:'400px'}}></Image>;
      }
      else if(tag==='외국'){
        return <Image src='./img/board_foreign.png' rounded style={{width:'400px',height:'400px'}}></Image>;
      }
      else{
        return <Image src='./img/board_mountain.png' rounded style={{width:'400px',height:'400px'}}></Image>;
      }
    }

    return (
      <tr>
        <td style={{fontSize:'17px', fontWeight:"bold"}}>
            <div style={{float:'left',marginLeft:'300px'}}>
            {findimg(this.props.tag)}
            </div>
            <div style={{float:'right', marginRight:"300px", paddingTop:"140px"}}>
              제목 : 
              <NavLink
                style={{fontWeight:'bold'}}
                to={{ pathname: "/board/detail", query: { _id: this.props._id } }}
                >{this.props.title}
              </NavLink>
              <div>
                "{this.props.username}"님
              </div>
              <div> 
                {this.props.createdAt.substring(0, 10)}
              </div>
              <div>
                추천수 : {this.props.recommendation}
              </div>
              <div>
                장소 :     
                <NavLink to={`/map/${this.props.address}`}>
                  {this.props.address}
                </NavLink>
              </div>
            </div>
        </td>
      </tr>
    );
  }
}

class BoardForm extends Component {
  state = {
    boardList: [],
    buttonDisplay:'block',
    title:'전체 글'
  };

  componentDidMount() {
    this.getBoardList();

    if ($.cookie("login_id")) {
      this.setState({
          buttonDisplay: "inline-block"
      });
    } else {
      this.setState({
         buttonDisplay: "none"
      });
    }
  }

  getBoardListrec = () => {
    const send_param = {
      headers
    };
    axios
      .post("http://localhost:8080/board/getBoardListFromRec", send_param)
      .then(returnData => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const boards = returnData.data.list;
          let users=returnData.data.userdata;
          boardList = boards.map(item => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              writer={item.writer}
              username={findname(item.writer, users)}
              createdAt={item.createdAt}
              title={item.title}
              recommendation={item.recommendation}
              address={item.address}
              tag={item.tag}
            ></BoardRow>
          ));
          this.setState({
            boardList: boardList,
            title:'추천 글'
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="5" style={{textAlign:'center'}}>추천할 게시글이 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardList: boardList,
            title:'추천 글'
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getBoardListid = () => {
    const send_param = {
      headers,
      _id: $.cookie("login_id")
    };
    axios
      .post("http://localhost:8080/board/getBoardListFromId", send_param)
      .then(returnData => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const boards = returnData.data.list;
          let writeruser=returnData.data.userdata;
          boardList = boards.map(item => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              writer={item.writer}
              username={writeruser.name}
              createdAt={item.createdAt}
              title={item.title}
              recommendation={item.recommendation}
              address={item.address}
            ></BoardRow>
          ));
          this.setState({
            boardList: boardList,
            title:'내가 쓴 글'
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="5" style={{textAlign:'center'}}>작성한 게시글이 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardList: boardList,
            title:'내가 쓴 글'
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getBoardList = () => {
    const send_param = {
      headers
    };
    axios
      .post("http://localhost:8080/board/getBoardList", send_param)
      .then(returnData => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const boards = returnData.data.list;
          let users=returnData.data.userdata;
          boardList = boards.map(item => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              writer={item.writer}
              username={findname(item.writer, users)}
              createdAt={item.createdAt}
              title={item.title}
              recommendation={item.recommendation}
              address={item.address}
              tag={item.tag}
            ></BoardRow>
          ));
          this.setState({
            boardList: boardList,
            title:'전체 글'
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="5" style={{textAlign:'center'}}>게시글이 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardList: boardList,
            title:'전체 글'
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const divStyle = {
      margin: 50
    };
    
    const buttonStyle = {
      margin: "0px 10px 10px 0px",
      display: this.state.buttonDisplay
    };
      return (
        <div>
          <div style={divStyle}>
            <button class='button' onClick={this.getBoardList} style={{margin: "0px 10px 10px 0px"}}>
              전체 글 보기
            </button>
            <button class='button' onClick={this.getBoardListrec} style={{margin: "0px 10px 10px 0px"}}>
              추천 글 보기
            </button>
            <button class='button' onClick={this.getBoardListid} style={buttonStyle}>
              내 글 보기
            </button>
            <NavLink to="/boardWrite">
                <button class='button' style={{display: this.state.buttonDisplay,float:'right', margin:"0px 0px 0px 10px"}}>
                  글쓰기
                </button>
            </NavLink>
            <NavLink to="/find">
                <button class='button' style={{float:'right'}}>
                  검색
                </button>
            </NavLink>
            <h2>{this.state.title}</h2>
            <Table style={{backgroundColor:"#F9FFFF"}}>
              <tbody style={{textAlign:'center'}}>{this.state.boardList}</tbody>
            </Table>
          </div>
        </div>
      );
  }
}

export default BoardForm;
