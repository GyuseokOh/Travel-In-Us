import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Comment from './Comment';
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardDetail extends Component {
  state = {
    board: [],
    display:'inline-block'
  };

  componentDidMount() {
    if (this.props.location.query !== undefined) {
      $.cookie("board_data", this.props.location.query._id, { expires: 1 });
      this.getDetail(this.props.location.query._id);
    } else {
      this.getDetail($.cookie("board_data"));
      //window.location.href = "/";
    }

    if ($.cookie("login_id")) {
      this.setState({
          display: "inline-block"
      });
      } else {
      this.setState({
         display: "none"
      });
    }
  }

  deleteBoard = _id => {
    const send_param = {
      headers,
      _id
    };
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post("http://localhost:8080/board/delete", send_param)
        //정상 수행
        .then(returnData => {
          alert("게시글이 삭제 되었습니다.");
          window.location.href = "/";
        })
        //에러
        .catch(err => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }
  };

  recommendBoard = _id => {
    const send_param = {
      headers,
      _id: _id,
      user: $.cookie("login_id")
    };
    axios
      .post("http://localhost:8080/board/recommend", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message===true){
          alert("게시글이 추천되었습니다.");
        }
        else{
          alert("한 게시물에 한 번의 추천만 가능합니다");
        }
        window.location.reload();
      })
      //에러
      .catch(err => {
        console.log(err);
        alert("Error");
      });
  };

  getDetail = (params) => {
    const send_param = {
      headers,
      _id: params
    };
    const recommendStyle ={
      marginLeft: 5,
      display:this.state.display
    }
    const marginBottom = {
      marginLeft: 5
    };
    const buttonStyle = {
      margin: "0px 10px 10px 0px"
    };
    axios
      .post("http://localhost:8080/board/detail", send_param)
      //정상 수행
      .then(returnData => {
        if (returnData.data.board[0]) {
          let board;
          if ($.cookie("login_id")) {
            if(($.cookie("login_id")===returnData.data.board[0].writer)||($.cookie("login_email")==='manager1234@gmail.com')){
              board = (
                <div>
                  <NavLink to="/">
                      <button class='button' style={{margin: "0px 10px 10px 0px"}}>
                        목록으로
                      </button>
                  </NavLink>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th colSpan="4">{returnData.data.board[0].title}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>작성자 : {returnData.data.userdata.name}</td>
                        <td>작성일자 : {returnData.data.board[0].createdAt.replace('T',' ').substring(0, 16)}</td>
                        <td>추천수 : {returnData.data.board[0].recommendation}</td>
                        <td>
                          <NavLink to={`/map/${returnData.data.board[0].address}`}>
                            "{returnData.data.board[0].address}"를 지도에서 보기
                          </NavLink>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4"
                          dangerouslySetInnerHTML={{
                            __html: returnData.data.board[0].content
                          }}
                        ></td>
                      </tr>
                    </tbody>
                  </Table>
                  <div>
                      <NavLink
                        to={{
                          pathname: "/boardWrite",
                          query: {
                            title: returnData.data.board[0].title,
                            content: returnData.data.board[0].content,
                            _id: params
                          }
                        }}
                      >
                        <button class='changebutton'>
                          글 수정
                        </button>
                      </NavLink>
                      <button
                        class='delbutton'
                        style={marginBottom}
                        onClick={this.deleteBoard.bind(
                          null,
                          params
                        )}
                      >
                        글 삭제
                      </button>
                      <button
                        class='recbutton'
                        style={recommendStyle}
                        onClick={this.recommendBoard.bind(
                          null,
                          params
                        )}
                      >
                        추천하기
                      </button>
                  </div>
                  <hr></hr>
                  <div>
                  <Comment id={params}/>
                  </div>
                </div>
              );
            }
            else{
              board = (
                <div>
                  <NavLink to="/">
                    <button class='button' style={buttonStyle} variant="primary">
                      목록으로
                    </button>
                  </NavLink>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th colSpan="4">{returnData.data.board[0].title}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>작성자 : {returnData.data.userdata.name}</td>
                        <td>작성일자 : {returnData.data.board[0].createdAt.replace('T',' ').substring(0, 16)}</td>
                        <td>추천수 : {returnData.data.board[0].recommendation}</td>
                        <td>
                          <NavLink to={`/map/${returnData.data.board[0].address}`}>
                            "{returnData.data.board[0].address}"를 지도에서 보기
                          </NavLink>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4"
                          dangerouslySetInnerHTML={{
                            __html: returnData.data.board[0].content
                          }}
                        ></td>
                      </tr>
                    </tbody>
                  </Table>
                  <div>
                    <button
                      class='button'
                      style={recommendStyle}
                      onClick={this.recommendBoard.bind(
                        null,
                        params
                      )}
                    >
                      추천하기
                    </button>
                    <hr></hr>
                    <div>
                    <Comment id={params}/>
                    </div>
                  </div>
                </div>
              );
            }
          } else {
            board = (
              <div>
                  <NavLink to="/">
                    <button class='button' style={buttonStyle} variant="primary">
                      목록으로
                    </button>
                  </NavLink>
                  <Table striped bordered>
                  <thead>
                    <tr>
                      <th colSpan="4">{returnData.data.board[0].title}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>작성자 : {returnData.data.userdata.name}</td>
                      <td>작성일자 : {returnData.data.board[0].createdAt.replace('T',' ').substring(0, 16)}</td>
                      <td>추천수 : {returnData.data.board[0].recommendation}</td>
                      <td>
                        <NavLink to={`/map/${returnData.data.board[0].address}`}>
                          "{returnData.data.board[0].address}"를 지도에서 보기
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4"
                        dangerouslySetInnerHTML={{
                          __html: returnData.data.board[0].content
                        }}
                      ></td>
                    </tr>
                  </tbody>
                </Table>
                <hr></hr>
                <div>
                  <Comment id={params}/>
                </div>
              </div>
            );
          }
          this.setState({
            board: board
          });
        } else {
          alert("글 상세 조회 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const divStyle = {
      margin: 50
    };
    return <div style={divStyle}>{this.state.board}</div>;
  }
}

export default BoardDetail;
