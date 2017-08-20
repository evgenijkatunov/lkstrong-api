/**
 * Created by evgenij on 16.08.17.
 */


var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var app = express();

var mongo_url = 'mongodb://localhost:27017/LKStrong';

var UserModel = require('./models/users').UserModel;

mongoose.connect(mongo_url);

app.use(bodyParser.json())

app.get('/', (req, res) => {
    UserModel.addScore('Женя_КRE', 70, (err, res)=>{
        console.log(err);
        console.log(res);
    });
    res.send();
});

app.post('/api/register', (req, res) => {
    var name = req.body.name;
    UserModel.createUser(name, (err, success) => {
        if (err){
            throw err;
        }
        if (!success){
            res.statusCode=409;
        }
        res.send();
    });  
});

app.post('/api/score', (req, res) => {
    var score = req.body.score;
    var name = req.body.name;

    UserModel.addScore(name, score, (err, success) => {
        if (err){
            throw err;
        }
        if (!success){
            res.statusCode=404;
        }
        res.send();
    });
})

app.get('/api/stat', function (req, res) {
    var name = req.query.name;

    UserModel.getStat(name, function(err, scores){
        if (err){
            throw err;
        }
        console.log(scores);
        if (scores.length == 0){
            res.statusCode = 404;
            res.send();
        } else {
            res.send({'count':scores.length, 'scores': scores});
        }
    });
});


app.listen(8000, function(){
    console.log('Express server listening on port 8000');
});
