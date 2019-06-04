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

//  처음 로그인을 시도하는 페이지 ( 회원가입은 현재 미포함)
router.get('/login', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM player ;`,function(err, results){
      console.log(`로그인 체크할준비가 완료됨.`);
      let count = 1;
      res.render('login', { });
      conn.release();
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
      // 현재 ID 만을 DB 에 있는지 확인할 수 있음
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
