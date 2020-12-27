const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const User = require("../schemas/user");
const Comment = require("../schemas/comment");

router.post("/delete", async (req, res) => {
  try {
    await Comment.remove({
      _id: req.body._id
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/write", async (req, res) => {
  try {
    let obj;

    obj = {
      contentid: req.body._id,
      writer: req.body.writer,
      content: req.body.content
    };

    const comment = new Comment(obj);
    await comment.save();
    res.json({ message: "댓글이 입력되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getCommentList", async (req, res) => {
  try {
    const _id = req.body._id;
    const comment = await Comment.find({contentid:_id}, null, {
      sort: { createdAt: 1 }
    });
    const user= await User.find();
    res.json({ list: comment, userdata: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
