    
const express = require('express');
const passport = require('passport');

const router = express.Router();

// 카카오 인증 해주세요.
router.get('/kakao', passport.authenticate('kakao'));

// 성공했으면 이쪽으로!
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;