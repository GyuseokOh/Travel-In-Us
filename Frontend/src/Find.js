import React, { Component } from "react";
import { Table, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
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
    return (
      <tr>
        <td>
          <NavLink
            style={{fontWeight:'bold'}}          
            to={{ pathname: "/board/detail", query: { _id: this.props._id } }}
          >
            {this.props.title}
          </NavLink>
        </td>
        <td>
            {this.props.username}
        </td>
        <td>
            {this.props.createdAt.substring(0, 10)}
        </td>
        <td>
            {this.props.recommendation}
        </td>
        <td>
            <NavLink to={`/map/${this.props.address}`}>
              {this.props.address}
            </NavLink>          
        </td>
      </tr>
    );
  }
}

class FindForm extends Component {

  state = {
    boardList: []
  };

  findBoardList = () => {
    const findvalue = this.findvalue.value;

    if (findvalue === "" || findvalue === undefined) {
      alert("검색어를 입력해주세요.");
      this.findvalue.focus();
      return;
    }

    const send_param = {
      headers,
      word:findvalue
    };
    axios
      .post("http://localhost:8080/board/findBoardList", send_param)
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
            ></BoardRow>
          ));
          this.setState({
            boardList: boardList
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="5" style={{textAlign:'center'}}>검색 결과가 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardList: boardList
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {

    const divStyle = {
      margin: "30px 50px 0px 50px"
    };

    const formStyle = {
      margin: "0px 50px 50px 50px"
    };
    const searchbuttonStyle = {
      marginTop: 10
    };

    return (
      <div>
        <div style={divStyle}>
          <NavLink to="/">
            <button class='button' style={{float:'right'}}>
                목록으로
            </button>
          </NavLink>
        </div>
        <Form style={formStyle}>
          <Form.Group controlId="findForm">
            <h3 style={{float:'left'}}>키워드 검색</h3>
            <Form.Control
              maxLength="100"
              ref={ref => (this.findvalue = ref)}
              placeholder="검색어를 입력해주세요"
            />
            <button
              class='button'
              style={searchbuttonStyle}
              onClick={this.findBoardList}
              type="button"
            >
              검색
            </button>
          </Form.Group>
        </Form>
        <div style={divStyle}>
            <Table hover style={{backgroundColor:"#F9FFFF"}}>
              <thead style={{backgroundColor:"#BEEFFF"}}>
                <tr>
                  <th>글 제목</th>
                  <th>작성자 이름</th>
                  <th>날짜</th>
                  <th>추천수</th>
                  <th>장소</th>
                </tr>
              </thead>
              <tbody>{this.state.boardList.length!==0 ? this.state.boardList : <tr><td colSpan="5" style={{textAlign:'center'}}>검색어를 입력해주세요.</td></tr>}</tbody>
            </Table>
          </div>
      </div>
    );
  }
}

export default FindForm;
