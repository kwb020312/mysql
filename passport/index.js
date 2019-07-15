// const local = require('./localStrategy');
const express = require('express');
const kakao = require('./kakaoStrategy');
const pool = require('../config_test/dbconfig');

module.exports = (passport) => {
    console.log(`----- index start -----`);   

    // serializeUser는 사용자 정보를 세션에 저장하는 것
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    // deserializeUser 란 serializeUser 의 값을 물려받아 '매번' 호출해준다
    passport.deserializeUser((user, done) => {

        console.log('---------------deserializeUser---------------------');
        console.log(user);
        console.log('------------------------------------');

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            
            connection.query(`SELECT * FROM player WHERE email='${user.email}'`, function (error, results, fields){               
                                
                done(null, user);

                connection.release();
                if (error) throw error;

            })
        });        
    });

    // ※ 즉, serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, deserializeUser는
    // 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것입니다. 세션에 불필요한 데이터를 담아두지 않기
    // 위한 과정입니다.

    // local(passport);
    kakao(passport);
}