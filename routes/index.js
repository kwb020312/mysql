var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '111111',
  database        : 'kimwoobin'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM emp;',function(err, results){
      console.log(`------`);
      console.log(results);

      res.render('index', { results : results});

      conn.release();
    });
  });
});

module.exports = router;
