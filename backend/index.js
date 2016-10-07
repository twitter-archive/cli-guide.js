var restify       = require('restify'),
    child_process = require('child_process'),
    fs            = require('fs');

function respond(req, res, next) {
  child_process.exec('python hw.py', function (err, stdout, stderr){
      if (err) {
          console.log("child processes failed with error code: " + err.code);
      }
      console.log(stdout);
  });
  res.send('EXEC: ' + req.params.code);
  next();
}

function createFile(req, res, next){
  // create a new file
  fs.writeFile(req.body.filename, req.body.content, function(err) {
      if(err) {
        return res.send(500, {message: "Error creating a file"});
      } else {
        return res.send(200, {message: "A file was created successfully"});
      }
  });
  next();
}

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.CORS());

server.get('/', function(req, res, next) {
  res.send('CLI GUIDE SERVER');
  return next();
});

server.get('/code/:code', respond);

server.post('/create_file', createFile);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
