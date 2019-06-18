const mysql = require('mysql');

// 내 DB 의 값 가져오기
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '111111',
    database        : 'kimwoobin',
    dateStrings     : 'date'
  });

  module.exports = pool;