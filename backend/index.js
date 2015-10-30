var restify = require('restify');
var child_process = require('child_process');

function respond(req, res, next) {
  //req.params.code
  child_process.exec('python hw.py', function (err, stdout, stderr){
      if (err) {
          console.log("child processes failed with error code: " +
              err.code);
      }
      console.log(stdout);
  });
  res.send('EXEC: ' + req.params.code);
  next();
}

var server = restify.createServer();
server.get('/code/:code', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
