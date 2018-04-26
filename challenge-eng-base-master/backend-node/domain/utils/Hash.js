const bcrypt = require("bcrypt-nodejs");

module.exports =  function hash(data) {
  var salt = "$2a$10$O.9dJ4I0U4dR5E4v3G93A."; // Use a static salt so password match
  console.error(JSON.stringify(data));
    return new Promise(function(resolve, reject) {
      //bcrypt.genSalt(10, function(err, salt) {
        // Hash password using bycrpt module
        //if (err) return reject(err);

        bcrypt.hash(data, salt, null, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    //});
  };
