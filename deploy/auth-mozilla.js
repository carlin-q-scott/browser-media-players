var jwt = require('jsonwebtoken');

var issuedAt = Math.floor(Date.now() / 1000);
var payload = {
  iss: process.env.iss,
  jti: Math.random().toString(),
  iat: issuedAt,
  exp: issuedAt + 60,
};

var token = jwt.sign(payload, process.env.secret, {
  algorithm: 'HS256',  // HMAC-SHA256 signing algorithm
});

console.log(token);