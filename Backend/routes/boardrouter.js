const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const User = require("../schemas/user");
const Recommend = require("../schemas/recommend");

router.post("/delete", async (req, res) => {
  try {
    await Board.deleteMany({
      _id: req.body._id
    });

    await Comment.deleteMany({
      contentid: req.body._id
    });

    await Recommend.deleteMany({
      contentid: req.body._id
    });
    
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/update", async (req, res) => {
  try {
    await Board.update(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          address: req.body.address,
          tag: req.body.tag
        }
      }
    );
    res.json({ message: "게시글이 수정 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/write", async (req, res) => {
  try {
    let obj;

    obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content,
      address: req.body.address,
      recommendation : 0,
      tag: req.body.tag
    };

    const board = new Board(obj);
    await board.save();
    res.json({ message: "게시글이 업로드 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({}, null, {
      sort: { createdAt: -1 }
    });
    const user= await User.find();
    res.json({ list: board, userdata: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardListFromId", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ writer: _id }, null, {
      sort: { createdAt: -1 }
    });
    const user= await User.findOne({_id : _id});
    res.json({ list: board, userdata: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardListFromRec", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ recommendation : { $gte : 5} }, null, {
      sort: { createdAt: -1 }
    });
    console.log(board);
    //const user= await User.findOne({_id: _id});
    const user= await User.find();
    res.json({ list: board, userdata: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/findBoardList", async (req, res) => {
  try {
    const word = req.body.word;
    const board = await Board.find({$or:[{content:{$regex:word}},{address:{$regex:word}},{title:{$regex:word}}]}, null, {
      sort: { createdAt: -1 }
    });
    const user= await User.find();
    res.json({ list: board, userdata: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ _id });
    const user= await User.findOne({_id : board[0].writer});
    res.json({ board:board, userdata:user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/recommend", async (req, res) => {
  try {
    const user=req.body.user;
    const contentid=req.body._id;
    let obj;

    obj = {
      user: user,
      contentid: contentid
    };

    const check=await Recommend.findOne({user:user, contentid:contentid});
    if(check!=null){
      res.json({message:false});
    }
    else{
      const count=await (await Recommend.find({contentid:contentid})).length;
      const recommend = new Recommend(obj);
      await recommend.save();
      res.json({ message: true });

      await Board.update(
        { _id: contentid },
        {
          $set: {
            recommendation: count+1
          }
        }
      );
    }

  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
