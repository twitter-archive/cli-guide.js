var File = {
  preLoad: function(opts){
    // validation
    // if the json file is empty
    if(opts===""){
      localStorage.setItem("hello_world.py",
        JSON.stringify({
          content: "print \"Hello World!\"",
          language: "python"
      }));
      // add a python file for show, how to works nano editor
      localStorage.setItem("files","hello_world.py");
    } else {
      var files = [];
      $.ajaxSetup({
        async: false
      });
      if(opts !== "") {
        $.getJSON(opts,function(data){
          $.each(data,function(k,v){
            // using .join method to convert array to string without commas
            files.push(v.name);
            // save each file
            localStorage.setItem(v.name,
              JSON.stringify({
                content: v.content.join(""),
                language: (v.language === undefined) ? "markup" : v.language
            }));
          });
        });
        localStorage.setItem("files",files);
      }
    }
  }
};
