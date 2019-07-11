var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const app = express;

const pool = require('../config/dbconfig');

// 게시판으로 이동할때의 라우터

router.get('/notice', function(req, res, next) {
    pool.getConnection(function(err, conn){
      conn.query('SELECT a.*, (SELECT COUNT(*) FROM comments WHERE n_id=a.id) AS commentCnt FROM notice AS a;',function(err, results){
        res.render('board/notice', { results: results });
        
  
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
        res.render('board/write' ,{ user : req.session.user_id });
  
        
  
        conn.release();
      });
    });
  });

  // 자신의 글을 삭제할때 사용하는 라우터

router.get('/notedel', function(req, res, next) {

  if(req.query.author != req.session.user_id) {
    res.render('/board/error');
  } else {

    pool.getConnection(function(err, conn){
      conn.query(`DELETE FROM notice WHERE id ='${req.query.id}';`,function(err, results){
        console.log('------------------------------------');
        console.log(results);
        console.log('------------------------------------');
        res.redirect('/board/notice');
    
          
    
        conn.release();
      });
    });
  };
  });


// 자신의 글을 수정할때 사용하는 라우터
3
router.get('/update', function(req, res, next) {
  const title = req.query.title;
  const description = req.query.description;
  if(req.query.author != req.session.user_id) {
    res.render('board/error');
  } else {
    pool.getConnection(function(err, conn){
      conn.query(`SELECT * FROM notice WHERE id ='${req.query.id}';`,function(err, results){
        res.render('board/update',{ user: req.session.user_id, results: results , reqid: req.query.id , title : title , description : description});
  
        conn.release();
      });
    });
  };
});

// 자신의 글을 수정할때 사용하는 라우터

router.post('/up', function(req, res, next) {
  const reqid = req.body.reqid;
  const title = req.body.title;
  const description = req.body.description;
  pool.getConnection(function(err, conn){
    conn.query(`UPDATE notice SET title = '${title}', description = '${description}' WHERE id ='${reqid}';`,function(err, results){
      res.redirect('/board/notice');

      

      conn.release();
    });
  });
});

// 자신의 글을 자세히볼때 사용하는 라우터

router.get('/detail', function(req, res, next) {
  const id = req.query.id;
  const title = req.query.title;
  const description = req.query.description;
  const author = req.query.author;
  pool.getConnection(function(err, conn){
    conn.query(`SELECT c.email , c.description FROM notice AS n LEFT JOIN comments AS c ON n.id = c.n_id WHERE n_id =${id};`,function(err, results){
      conn.query(`SELECT count(n_id) AS c FROM comments WHERE n_id = ${id};`,function(err, counter){
        conn.query(`SELECT * FROM notice WHERE id ='${id}';`,function(err, use){
          res.render('board/detail' , {id:id , results : results ,title : title , description : description , counter : counter , use : use , author : author});
        });
     });
      

      

      conn.release();
    });
  });
});


  // 자신의 글을 삭제할때 사용하는 라우터

router.get('/mydel', function(req, res, next) {

    pool.getConnection(function(err, conn){
      conn.query(`DELETE FROM notice WHERE id ='${req.query.id}';`,function(err, results){
        res.redirect('/board/notice');
  
        
  
        conn.release();
      });
    });
  });

  // 댓글을 등록할 때 사용하는 라우터

  router.post('/comment', function(req, res, next) {
    const n_id = req.body.n_id;
    const comment = req.body.comment;
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;
    pool.getConnection(function(err, conn){
      conn.query(`INSERT INTO comments (n_id , email , description) VALUES ('${n_id}','${req.session.user_id}','${comment}');`,function(err, results){
        res.redirect(`/board/detail?id=${n_id}&title=${title}&description=${description}&author=${author}`);
        
  
        conn.release();
      });
    });
  });



module.exports = router;
