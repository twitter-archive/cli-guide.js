var Cli = {
  newline: function(command,id){
    var terminal = $("#terminal");

    loghistory.push(command);

    localStorage.setItem("loghistory",loghistory);

    //var idinput = parseInt(localStorage.getItem("idinput"));

    var dir = "";

    if(command.substring(0, 3) == "cd " && command.substring(3, command.length) !== ""){
      $("#"+id+".response").html(''); // remove pre and code
      localStorage.setItem('actualdir', "/"+command.substring(3, command.length));
    }

    if(command == "cd ..") {
      $("#"+id+".response").html(''); // remove pre and code
      localStorage.setItem('actualdir', "");
    }

    dir = localStorage.getItem('actualdir');

    terminal.append(
       '<div id="'+id+'" class="parent-textinline">'
    +     '<div class="prompt">you@tutorial:~'+dir+'$ </div>'
    +     '<div id="'+id+'" spellcheck="false" class="textinline" style="outline-color:black" contenteditable="true">'
    +       '&nbsp;'
    +     '</div>'
    +  '</div>'
    );

    //var count = parseInt(localStorage.getItem("idinput"));
    //var total = count + 1;
    //localStorage.setItem("idinput",total)

    $('[contenteditable]', terminal)[0].focus();

  },
  ls: function(id){
    $("#"+id+".response").html(localStorage.getItem("files").split(",").join(" "));
  },
  clear: function(){
    $(".parent-textinline").remove();
    $(".response").remove();
    Cli.newline("");
  },
  rm: function(filename){
    if(localStorage.getItem(filename) !== null){
      var arrayFiles = localStorage.getItem("files").split(',');
      arrayFiles = arrayFiles.filter(Boolean);
      Util.removeItemFromArray(arrayFiles, filename);
      localStorage.setItem("files",arrayFiles);
      localStorage.removeItem(filename);
    }
  },
  gitClone: function(input,id){
    $("#"+id+".response").html(''); // remove pre and code
    if(UtilRegExp.gitClone(input.replace(/\s\s+/g,' '))){

      var url = input.split(" ").pop();
      var repoName= url.substring(url.lastIndexOf("/")+1,url.lastIndexOf(".git"));

      $("#"+id+".response").append("Cloning into '"+repoName+"'... <br/>");
      $("#"+id+".response").append("remote: Counting objects: 4643, done.<br/>");
      $("#"+id+".response").append('remote: Compressing objects: '
      + '<span id="objects" class="objects">100</span>'
      + '% (<span id="objects_p" class="objects">12</span>/12), done.<br/>');

      $("#"+id+".response #objects").html(100);
      $("#"+id+".response #objects_p").html(12);

      // animation
      $("#"+id+".response .objects").each(function () {
        $(this).prop('Counter',0).animate({
          Counter: $(this).text()
        }, {
          duration: 900,
          easing: 'swing',
          step: function (now) {
            $(this).text(Math.ceil(now));
          }
        });
      });

      $("#"+id+".response .objects").promise().done(function(){
        $("#"+id+".response").append(
          '<span id="down_c" class="down_class">Receiving objects: <span id="down_m" class="down">100</span>%'
        + ' (<span id="down_p" class="down">4643</span>/4643) '
        + ' <span id="down_mb" class="down">28</span> MiB | <span id="down_k" class="down">167</span> '
        + ' Kib/s, done. </span><br/> '
        );

        $("#"+id+".response #down_m").html(100);
        $("#"+id+".response #down_p").html(4643);
        $("#"+id+".response #down_mb").html(28);
        $("#"+id+".response #down_k").html(167);

        $("#"+id+".response .down").each(function () {
          $(this).prop('Counter',0).animate({
            Counter: $(this).text()
          }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
            }
          });
        });

        $("#"+id+".response .down").promise().done(function(){

          $("<span>remote: Total 4643 (delta 2), reused 0 (delta 0), pack-reused 4631</span><br/>").insertBefore("#"+id+".response #down_c.down_class");

          $("#"+id+".response").append('Resolving deltas: '
          + '<span id="delta" class="delta">100</span>'
          + '% (<span id="delta_p"class="delta">2961</span>/2961), done.<br/>');

          $("#"+id+".response #delta").html(100);
          $("#"+id+".response #delta_p").html(2961);

          $("#"+id+".response .delta").each(function () {
            $(this).prop('Counter',0).animate({
              Counter: $(this).text()
            }, {
              duration: 2000,
              easing: 'swing',
              step: function (now) {
                $(this).text(Math.ceil(now));
              }
            });
          });

          $("#"+id+".response .delta").promise().done(function(){

            $("#"+id+".response").append("Checking connectivity... done. <br/>");

            $("#"+id+".response").append('Checking out files: '
            + '<span id="files" class="files">100</span>'
            + '% (<span id="files_p"class="files">975</span>/975), done.<br/>');

            $("#"+id+".response #files").html(100);
            $("#"+id+".response #files_p").html(975);

            $("#"+id+".response .files").each(function () {
              $(this).prop('Counter',0).animate({
                Counter: $(this).text()
              }, {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                  $(this).text(Math.ceil(now));
                }
              });
            });

            $("#"+id+".response .files").promise().done(function(){
              // save this command in the history
              Cli.newline(input,id);
            });

          });

        });

      });

    } else {
      $("#"+id+".response").html("fatal: repository '"+input.replace(/\s\s+/g,' ')+"' does not exist");
      Cli.newline("");
    }
  },
  unSupportedCommand: function(input,id){
    var commandTest = ["mv"];
    for (i = 0; i < commandTest.length; i++) {
      if(input == commandTest[i]) {
        $("#"+id+".response").html("This is an emulator, not a shell. Try following the instructions.");
      }
    }
  }
};
