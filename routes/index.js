var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express;

// 내 DB 의 값 가져오기
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '111111',
  database        : 'kimwoobin',
  dateStrings     : 'date'
});

//  기본 로컬호스트를 보는 페이지
router.get('/', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM player;',function(err, results){
      console.log(`------`);
      console.log(results);
      let count = 1;
      res.render('index', { results : results , count : count});

      conn.release();
    });
  });
});

// 회원가입을 하는 페이지로 연결하는 라우터
router.get('/register', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM player;',function(err, results){
      res.render('register', { });

      conn.release();
    });
  });
});

//  처음 로그인을 시도하는 페이지 ( 회원가입은 현재 미포함)
router.post('/login', function(req, res, next) {
  pool.getConnection(function(err, conn){
    const name = req.body.name ;
    const age = req.body.age ;
    const birth = req.body.birth ;
    const adress = req.body.adress ;
    const post = req.body.post ;
    const hobby = req.body.hobby ;
    const phone = req.body.phone ;
    const email = req.body.email ;
    const pw = req.body.pw ;
    conn.query(`
    INSERT INTO player 
    (name,age,birth,adress,post,hobby,phone,email,pw) 
    VALUES ('${name}',${age},'${birth}','${adress}','${post}','${hobby}','${phone}','${email}',md5('${pw}')); 
    `,function(err, results){
      if (err) {throw err;
      } else {
        console.log(`로그인 체크할준비가 완료됨.`);
        res.render('login', { });
        conn.release();
      }
    });
  });
});

// 콘솔로그로 아이디와 비밀번호를 표시하며 DB 에 포함된 아이디 인지 체크한다.
router.post('/lgcheck', function(req, res, next) {
  console.log(`당신의 아이디는 : ${req.body.id} 당신의 비밀번호는 : ${req.body.passwords}`);
  pool.getConnection(function(err, conn){
    const id = req.body.id;
    const password = req.body.passwords;
    conn.query(`SELECT * FROM player WHERE email = '${id}' AND pw = md5('${password}');`,function(err, results){
      console.log(`로그인 체크할준비가 완료됨.`);
      // ID 와 비밀번호를 체크하는 구문
      if(results.length > 0 ) {
        res.send(`
        <center>
          <h1>ID : ${id} </h1>
          <br>
          <br>
          <h1>PW : ${password} </h1>
        </center>
        `);
        console.log(`로그인 되었습니다!`);
      } else {
        console.log('미확인된 정보입니다!');
      }
      
      // console.log(results[9].email);
      res.render('lgcheck', { });
      

      conn.release();
    });
  });
});

module.exports = router;
