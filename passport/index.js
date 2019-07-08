const kakao = require('./kakaoStrategy');

module.exports = (passport) => {
   passport.serializeUser((user, done) => {
       done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
    //    User.find({ where: { id } })
    //        .then(user => done(null, user))
    //        .catch(err => done(err));
   });

   kakao(passport);
};