var restify       = require('restify'),
    child_process = require('child_process'),
    fs            = require('fs');

function respond(req, res, next) {
  // create a new file
  fs.writeFile("message.txt", "Hello Node.js", function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
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
