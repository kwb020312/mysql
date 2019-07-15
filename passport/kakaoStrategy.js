const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require('../config_test/dbconfig');

// const { User } = require('../models');

module.exports = (passport) => {
    console.log('------------------------------------');
    console.log(`-----Loading ... KakaoStrategy -----`);
    console.log('------------------------------------');

    passport.use(new KakaoStrategy({
      clientID: process.env.KAKAO_ID,
      callbackURL: '/auth/kakao/callback',
    }, async (acessToken, refreshToken, profile, done) => {
      try {
        // 카카오 계정의 아이디, 이메일, 이름 값 등등을 테스트함
        console.log('------------------------------------');
        console.log(`-----profile : ${profile.id}-----`);
        console.log(`-----profile : ${profile._json && profile._json.kaccount_email}-----`);
        console.log(`-----profile : ${profile.displayName}-----`);
        console.log('------------------------------------');
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM player WHERE sns_id='${profile.id}' AND provider='kakao'`, function (error, results, fields) {                
                // 카카오 계정이 있을 떄 처리
                if (results.length > 0) {
                    done(null, results);
                    console.log('--------kakaoStrategy-------------');
                    console.log(results[0].email);
                    console.log('------------------------------------');
                // 카카오 계정이 없을 떄 처리
                } else {
                    connection.query(`INSERT INTO player (email,name,sns_id,provider) VALUES ('${profile._json && profile._json.kaccount_email}','${profile.displayName}','${profile.id}','kakao');`, function (error, results, fields) {
                        
                        // INSERT 성공시 serializeUser 쪽으로 email 넘겨주기(done)
                        if(results > 0){
                            connection.query(`SELECT * FROM player WHERE sns_id='${profile.id}' AND provider='kakao'`,function(error, results, fields) {                                                            
                                done(null, results);
                                console.log('-----------kakaoStrategy---------------');
                                console.log(results[0].email);
                                console.log('------------------------------------');                               
                            })
                        }
                    });
                }

                connection.release();
                if (error) throw error;
            
            });
        });
      } catch (error) {
        console.error(error);
        done(error);
      }
    }));
};