const bcrypt = require("bcrypt-nodejs");

module.exports =  function hash(data) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        // Hash password using bycrpt module
        if (err) return reject(err);

        bcrypt.hash(data, salt, null, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    });
  };
