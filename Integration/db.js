var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/hwData';
var collections = ['temperature'];
var option = {"auth":{"user":"novice","password":"@Mosmo321"}}


var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};