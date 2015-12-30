var express = require('express'), app = express();
var bodyParser = require('body-parser');
var redis = require('redis'), client = redis.createClient();
var sendmail = require('sendmail')();
client.on("error", function(err) {
    console.log("Errro " + err);
});
app.get(/.*\/run/, function(req, res) {
    var id = req.path.split('/run')[0];
    var date = new Date();
    client.hmset(id, {date: date, status: 'run'});
    res.send({
        path: id,
        date: date
    });
});
app.get(/.*\/check/, function(req, res) {
    var id = req.path.split('/check')[0];
    var date = new Date();
    client.hmget(id, 'date', 'status', function(err, code) {
        client.multi().hmset(id, {
            date: date,
            duration: date.getTime()-(new Date(code[0])).getTime(),
            status: req.query.code}).expire(id, 86400).exec();
    });
    if (req.query.code != 0) {
        sendmail({
            from: 'no-reply@huanghanshengdeMac-mini',
            to: 'zenixhuang@appier.com',
            subject: "test",
            content: "test"
        }, function(err, reply) {
            console.log(err && err.stack);
            console.log(reply);
        });
    }
    res.send({
        path: id,
        query: req.query.code,
        date: date
    });
});
app.get('/stat', function(req, res) {
    client.keys("*", function(err, keys) {
        var result = {};
        var counter = 0;
        if (keys.length == 0) {
            res.send(result);
            return;
        }
        keys.forEach(function(k) {
            client.hmget(k, 'date', 'duration', 'status', function(err, code) {
                counter++;
                result[k] = {date: code[0], duration: code[1], status: code[2]};
                if (counter == keys.length) {
                    res.send(result);
                }
            });
        });
    });
});
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
}); 
