const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const connect = require("./schemas");

const crypto = require("crypto");
const User = require("./schemas/user");

connect();

const corsOptions = {
  origin: true,
  credentials: true
};

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "dhrbtjr",
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/comment", require("./routes/commentRouter"));

//관리자 아이디 설정
async function setManager() {
  try {
    let user = await User.findOne({email:'manager1234@gmail.com'});

    if(user){
      return;
    }
    else{
      crypto.randomBytes(64, (err, buf) => {
        if (err) {
          console.log(err);
        } else {
          crypto.pbkdf2(
            '1q2w3e4r!!',
            buf.toString("base64"),
            100000,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } else {
                buf.toString("base64");
                obj = {
                  email: 'manager1234@gmail.com',
                  name: '관리자',
                  password: key.toString("base64"),
                  salt: buf.toString("base64"),
                  authorization: true
                };
                user = new User(obj);
                await user.save();
              }
            }
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}

setManager();

app.listen(8080, () => {
  console.log("Listen Server!");
});
