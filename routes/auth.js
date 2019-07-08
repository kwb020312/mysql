var express = require('express');
const passport = require('passport');
var router = express.Router();

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
   failureRedirect: '/',
}), (req, res) => {
   res.redirect('/');
});

module.exports = router;