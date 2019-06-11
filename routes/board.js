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

// 게시판으로 이동할때의 라우터

router.get('/notice', function(req, res, next) {

    pool.getConnection(function(err, conn){
      conn.query('SELECT * FROM notice;',function(err, results){
        res.render('notice', { results: results });
  
        
  
        conn.release();
      });
    });
  });

  // write 페이지에서 notice 페이지로 정보를 전송할떄의 라우터

router.post('/notice2', function(req, res, next) {
    const title = req.body.title;
    const description = req.body.description;
    const author = req.session.user_id;
    pool.getConnection(function(err, conn){
      conn.query(`INSERT INTO notice (title,description,author) VALUES ('${title}','${description}','${author}');`,function(err, results){
        res.redirect('/board/notice');
  
        
  
        conn.release();
      });
    });
  });

  // 글을 작성할때 사용하는 라우터

router.get('/write', function(req, res, next) {

    pool.getConnection(function(err, conn){
      conn.query('SELECT * FROM notice;',function(err, results){
        res.render('write' ,{ user : req.session.user_id });
  
        
  
        conn.release();
      });
    });
  });

  // 자신의 글을 삭제할때 사용하는 라우터

router.get('/notedel', function(req, res, next) {

    pool.getConnection(function(err, conn){
      conn.query(`SELECT * FROM notice WHERE author ='${req.session.user_id}';`,function(err, results){
        console.log('------------------------------------');
        console.log(results);
        console.log('------------------------------------');
        res.render('notedel' ,{ user : req.session.user_id , results : results});
  
        
  
        conn.release();
      });
    });
  });

  // 자신의 글을 삭제할때 l사용하는 라우터

router.get('/mydel', function(req, res, next) {

    pool.getConnection(function(err, conn){
      conn.query(`DELETE FROM notice WHERE title ='${req.query.title}';`,function(err, results){
        res.redirect('/board/notice');
  
        
  
        conn.release();
      });
    });
  });

module.exports = router;