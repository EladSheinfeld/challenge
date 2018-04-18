const express = require('express');
const bodyParser = require('body-parser');
const UserRepository = require('./repositories/UserRepository');

const app = express();
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get('/test', function (req, res) {
  res.json({
      status: 'alive'
  });
});

app.post('/user', function(req,res){
  UserRepository.exists(req.body.email).then(exists => {
    if(exists) {
      res.status(409).send("Email already exists in the system.");
      return res;
    }
    UserRepository.add(req.body.email, req.body.password)
    .then(user => {
      return res.json(JSON.stringify(user));
    }).catch(errors =>  {
      if(errors)
        res.status(400).send(errors);
    });
  });


});

app.listen(8000, function() {
    console.log('Listening on port 8000');
});
