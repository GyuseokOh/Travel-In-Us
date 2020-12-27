import React, { Component } from "react";
import { Form } from "react-bootstrap";
import $ from "jquery";
import {} from "jquery.cookie";
import axios from "axios";
import { withRouter } from 'react-router-dom';
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function findname(id, userlist){
    for(var i=0;i<userlist.length;i++){
      if(userlist[i]._id===id){
        return userlist[i].name;
      }
    }
}

class CommentRow extends Component {

   render() {
    return (
      <div className="border-top pt-1 pb-1">
          <div className="row">
              <div className="col-3 col-md-2 col-lg-1 pl-4">{this.props.username}</div>
              <div className="col-9 col-md-10 col-lg-11">
              <div className="comment-show">
                  <div className="comment-text mb-3">{this.props.content}</div>
                      <small className="d-block">
                      (작성일자 : <span>{this.props.createdAt.replace('T',' ').substring(0, 16)}</span>)
                      </small>
                  </div>
              </div>
          </div>
          <div>
              <button
                  style={{display:(($.cookie("login_id")===this.props.writer)||($.cookie("login_email")==='manager1234@gmail.com')) ? 'block-inline' : 'none'}}
                  onClick={this.props.deleteComment.bind(null,this.props.commentid)}
                  type="button"
                  class="combutton"
              >
                삭제
              </button>
          </div>
          <hr></hr>
      </div>
      );
    }
}

class Comment extends React.Component {
    constructor() {
        super();
        this.state = {
            display : "block",
            comList : [],
            comcount : 0,
        };
    }

    componentDidMount() {
        if ($.cookie("login_id")){
            this.setState({
                display: "block"
            });
        } else {
            this.setState({
            display: "none"
        });
        }
        
        this.getCommentList();
    }

    deleteComment = _id => {
      const send_param = {
        headers,
        _id
      };
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axios
          .post("http://localhost:8080/comment/delete", send_param)
          //정상 수행
          .then(returnData => {
            alert("댓글이 삭제 되었습니다.");
            window.location.reload();
          })
          //에러
          .catch(err => {
            console.log(err);
            alert("댓글 삭제 실패");
          });
      }
    };

    getCommentList = () => {
        const send_param = {
          headers,
          _id:this.props.id
        };
        axios
          .post("http://localhost:8080/comment/getCommentList", send_param)
          .then(returnData => {
            console.log(returnData);
            let commentList;
            if (returnData.data.list.length > 0) {
              const comments = returnData.data.list;
              let users=returnData.data.userdata;
              this.setState({comcount:returnData.data.list.length})
              commentList = comments.map(item => (
                <CommentRow
                  key={Date.now() + Math.random() * 500}
                  commentid={item._id}
                  username={findname(item.writer, users)}
                  content={item.content}
                  createdAt={item.createdAt}
                  writer={item.writer}
                  deleteComment={this.deleteComment}
                ></CommentRow>
              ));
              this.setState({
                comList: commentList
              });
            } else {
              commentList = (
                <div style={{textAlign:'center', margin:'10px 10px 50px 10px'}}>댓글이 존재하지 않습니다</div>
              );
              this.setState({
                comList: commentList
              });
              console.log(this.state.comList);
            }
          })
          .catch(err => {
            console.log(err);
          });
      };
    
    writeComment = () => {
        let send_param;
        const commenttext = this.commenttext.value;

        if (commenttext === undefined || commenttext === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        send_param = {
            headers,
            _id : this.props.id,
            writer : $.cookie("login_id"),
            content: commenttext
        };

        axios
        .post("http://localhost:8080/comment/write", send_param)
        //정상 수행
        .then(returnData => {
          if (returnData.data.message) {
            alert(returnData.data.message);
            window.location.reload();
          } else {
            alert("댓글 달기 실패");
          }
        })
        //에러
        .catch(err => {
          console.log(err);
        });
    };

    render() {
        const buttonStyle = {
            marginTop: 10
        };

        return (
        <div>
            <h4 style={{display:'inline'}}>댓글</h4>
            <span>  ({this.state.comcount})</span>
            <div style={{display:this.state.display}}>
              <Form.Group controlId="commentForm">
                <Form.Control
                    maxLength="100"
                    ref={ref => (this.commenttext = ref)}
                    placeholder="댓글을 입력하세요"
                    onChange={this.textChange}
                    onKeyPress={this.pressEnter}
                    value={this.state.newReply}
                />
                <button
                    class='button'
                    style={buttonStyle}
                    onClick={this.writeComment}
                    variant="primary"
                    type="button"
                >
                  댓글 달기
                </button>
              </Form.Group>
            </div>
            <div>{this.state.comList}</div>
        </div>
        );
    }
}

export default withRouter(Comment);