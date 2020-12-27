import React, { Component } from "react";
import CKEditor from "ckeditor4-react";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardWriteForm extends Component {
  state = {
    data: ""
  };

  componentDidMount() {
    if (this.props.location.query !== undefined) {
      this.boardTitle.value = this.props.location.query.title;
    }
  }

  componentWillMount(){
    if (this.props.location.query !== undefined) {
      this.setState({
        data: this.props.location.query.content
      });
    }
  }

  writeBoard = () => {
    let url;
    let send_param;

    const boardTitle = this.boardTitle.value;
    const boardContent = this.state.data;
    const address = this.address.value;
    const tag = this.tag.value;

    if (boardTitle === undefined || boardTitle === "") {
      alert("글 제목을 입력해주세요.");
      return;
    } else if (boardContent === undefined || boardContent === "") {
      alert("글 내용을 입력해주세요.");
      return;
    }else if (address === undefined || address === "") {
      alert("주소를 입력해 주세요.");
      return;
    }
    
    if (this.props.location.query !== undefined) {
      url = "http://localhost:8080/board/update";
      send_param = {
        headers,
        "_id" : this.props.location.query._id,
        "title": boardTitle,
        "content": boardContent,
        "address": address,
        "tag": tag
      };
    } else {
      url = "http://localhost:8080/board/write";
      send_param = {
        headers,
        "_id" : $.cookie("login_id"),
        "title": boardTitle,
        "content": boardContent,
        "address": address,
        "tag": tag
      };
    }

    axios
      .post(url, send_param)
      //정상 수행
      .then(returnData => {
        if (returnData.data.message) {
          alert(returnData.data.message);
          window.location.href = "/";
        } else {
          alert("글쓰기 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  onEditorChange = evt => {
    this.setState({
      data: evt.editor.getData()
    });
  };

  render() {
    const divStyle = {
      margin: 50
    };
    const titleStyle = {
      marginBottom: 5
    };
    const buttonStyle = {
      marginTop: 5
    };

    return (
      <div style={divStyle} className="App">
        <h2 style={{float:'left'}}>새 글 작성</h2>
        <NavLink to="/">
          <button class='button' style={{float:'right'}}>
            목록으로
          </button>
        </NavLink>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          ref={ref => (this.boardTitle = ref)}
        />
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="주소"
          ref={ref => (this.address = ref)}
        />
        <select class='form-control' ref={ref => (this.tag = ref)}>
          <option>
            도시
          </option>
          <option>
            바다
          </option>
          <option>
            산
          </option>
          <option>
            외국
          </option>
        </select>
        <CKEditor
          data={this.state.data}
          onChange={this.onEditorChange}
        ></CKEditor>
        <button class='button' style={buttonStyle} onClick={this.writeBoard}>
          저장하기
        </button>
      </div>
    );
  }
}

export default BoardWriteForm;
