var UtilRegExp = {
  // for testing this regular expression you can use
  // https://regex101.com/
  gitClone: function(text){
    var gitclone = /git\sclone\s(https:\/\/|git:\/\/)([a-zA-Z-.-_--]{0,}[^\//]\/){0,}[a-zA-Z-.-_--]{0,}(\.git|\.GIT)/;
    return gitclone.test(text);
  },
  language: function(filename){
    var css = /\.css/;
    var js = /\.js/;
    var py = /\.py/;
    var go = /\.go/;
    var java = /\.java/;
    var scala = /\.scala/;
    var ruby = /\.rb/;
    var rust = /\.rs/;
    var haml = /\.haml/;
    if(css.test(filename)){
      return "css";
    }
    if(js.test(filename)){
      return "javascript";
    }
    if(py.test(filename)){
      return "python";
    }
    if(go.test(filename)){
      return "go";
    }
    if(java.test(filename)){
      return "java";
    }
    if(scala.test(filename)){
      return "scala";
    }
    if(ruby.test(filename)){
      return "ruby";
    }
    if(rust.test(filename)){
      return "rust";
    }
    if(haml.test(filename)){
      return "haml";
    }
    return "markup";
  }
};
