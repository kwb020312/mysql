const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = (passport) => {
    console.log('===========KakaoStrategy=================');
   passport.use(new KakaoStrategy({
       clientID: process.env.KAKAO_ID,
       callbackURLL: '/auth/kakao/callback',
   }, async (accessToken, refreshToken, profile, done) => {
       console.log('------------------------------------');
       console.log(profile);
       console.log('------------------------------------');
    //    try {
    //     //    const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });

    //        if (exUser) {
    //            done(null, exUser);
    //        } else {
    //            const newUser = await User.create({
    //             email: profile._json && profile._json.kaccount_email,
    //             nick: profile.dispalyName,
    //             snsId: profile.id,
    //             provider: 'kakao',
    //         });
    //         done(null, newUser);
    //     }
    //    } catch (error) {
    //        console.error(error);
    //        done(error);
    //    }
   }));
};