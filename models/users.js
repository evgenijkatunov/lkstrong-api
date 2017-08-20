var mongoose = require('mongoose')

var User = mongoose.Schema({
    name: String,
    scores: [{date: Date, score: Number}]
})

User.statics.findByName = function(name, callback) {
    return this.find({'name':name}, callback);
}

User.statics.createUser = function(name, callback) {
    this.findByName(name, (err, result) => {
        if (err){
            callback(err, false);
            return;
        }
        if (result.length == 0){
            var newUser = new this();
            newUser.name = name;
            newUser.scores = [];
            newUser.save();
            callback(null, true);
        } else callback(null, false);
    });
}

User.statics.addScore = function(name, score, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length==0){
            callback(err, false);
            return;
        }
        var user = new this(result[0]);
        const date = new Date();
        user.scores.push({'score':score, 'date':date});
        user.save();
        callback(null, true);
    });
}

User.statics.getStat = function(name, callback) {
    this.findByName(name, (err, result) => {
        if (err || result.length==0){
            callback(err, []);
            return;
        }
        callback(null, result[0].scores);
    });
}

var UserModel = mongoose.model('user', User);
module.exports.UserModel = UserModel;