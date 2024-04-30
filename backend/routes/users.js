var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Kommentiere diese Zeile aus
  //res.send('respond with a resource');

  // Und füge soetwas ein
  res.json([{
    id: 1,
    username: "benroehrig"
  }, {
    id: 2,
    username: "bojonas"
  }]);
});

module.exports = router;