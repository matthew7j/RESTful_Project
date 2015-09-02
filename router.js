var express = require('express');
var router = express.Router();

var todoItems = [
    {id: 1, desc: 'Woody'},
    {id: 2, desc: 'Buzz'},
    {id: 3, desc: 'Mario'}
];

router.post('/add', function (req, res) {
    var newItem = req.body.newItem;
    todoItems.push({
        id: todoItems.length + 1,
        desc: newItem
    });

    res.redirect('/');
});

router.get('/', function (req, res) {
    res.render('index', {
        title: 'My App',
        items: todoItems
    });
});

module.exports = router;