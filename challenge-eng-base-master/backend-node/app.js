const express = require('express');
const bodyParser = require('body-parser');
const { body, check, oneOf, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const expressValidator = require('express-validator');
const UserRepository = require('./repositories/UserRepository');
const MessageRepository = require('./repositories/MessageRepository');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();

hasValidEmail = function(checkPromise, shouldExist) {
  return checkPromise
    .isEmail()
    .trim()
    .normalizeEmail()
    .custom(value => {
      return UserRepository.exists(value).then(exists => {
        if(exists && !shouldExist) {
          throw new Error('This email is already in use');
        } else if(!exists && shouldExist) {
          throw new Error('Email not found in the system');
        }
      });
    });
};


// Prefix all of the apis with /api
app.use('/api', router);


router.route('/')
  .get(function (req, res) {
    res.json({
        status: 'alive'
      });
    });

router.route('/users')
  .post([
    hasValidEmail(body('email', 'Must provide a valid email'), false),
    body('password', 'Passwords must be at least 8 chars long and contain letter & numbers')
      .isLength({ min: 8 })
      .matches(/\d/)
  ], function(req,res){
      var errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
      }
      UserRepository.add(req.body.email, req.body.password)
      .then(user => {
        return res.json(JSON.stringify(user));
      }).catch(errors =>  {
        if(errors)
          res.status(400).send(errors);
      });
  });

router.route('/messages/:from/:recipients')
  .get([
    hasValidEmail(check('from', 'Must provide a valid email'), true),
    oneOf([
      hasValidEmail(check('recipients', 'Must provide a valid email'), true),
      check('recipients')
        .isArray()
    ]),
    check(['page', 'limit']).optional().isInt()
  ],
    function(req,res) {
      var errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
      }

      var page = req.query.page;
      if(!page) {
        page = 0;
      }

      var limit = req.query.limit;
      if(!limit) {
        limit = 10;
      }

      if(!(req.params.recipients instanceof Array)){
        req.params.recipients = [req.params.recipients];
      }

      MessageRepository.fetch(req.params.from,
                              req.params.recipients,
                              page,
                              limit)
      .then(messages => {
        return res.json(JSON.stringify(messages));
      });
  });

app.listen(8000, function() {
    console.log('Listening on port 8000');
});
