/*!
 * cli-guide plugin
 * Original author: @willrre
 * Further changes, comments: @willrre
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global
  // variable in ECMAScript 3 and is mutable (i.e. it can
  // be changed by someone else). undefined isn't really
  // being passed in so we can ensure that its value is
  // truly undefined. In ES5, undefined can no longer be
  // modified.

  // window and document are passed through as local
  // variables rather than as globals, because this (slightly)
  // quickens the resolution process and can be more
  // efficiently minified (especially when both are
  // regularly referenced in our plugin).

  // Create the defaults once
  var pluginName = "cliguide",
    defaults = {
      welcomeMessage: 'Welcome to the interactive tutorial',
      nameOfTheProject: 'Apache Aurora',
      heightTerminal: window.innerHeight,
      stepsFile: 'src/listofsteps.json',
      initStep: 0
    };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  function listOfSteps(opts) {
    $.getJSON(opts.stepsFile,function(data){
      $.each(data,function(k,v){
        $("#listofsteps").append(
          '<li class="step">'
        +   '<a id="'+v.step+'" class="btn-step" href="#" data-step="'+v.step+'">'
        +     v.step
        +   '</a>'
        + '</li>'
        );
      });
    });
  }

  function showInfoOfEachStep(opts,step){
    // select current step
    localStorage.setItem('actualstep',step);

    $(".btn-step").removeClass("active");
    $("#stepscontent").html('');
    $.getJSON(opts.stepsFile,function(data){
      $.each(data,function(k,v){
        if(v.step == step){
          $("#"+step+".btn-step").addClass("active");
          $("#steptitle").html("<h3>Step "+v.step+"</h3>");
          $("#stepscontent").append(
            "<h3>"+v.content.title+"</h3>"
          + '<hr/ class="style">'
          + "<p>"+v.content.content.join("")+"</p>"
          );
          if(v.content.tips != ""){
            $("#stepscontent").append(
              '<hr/ class="style">'
            + "<h3>Tips</h3>"
            + "<p>"+v.content.tips+"</p>"
            + '<ul id="listofcommands"></ul>'
            );
          }
          if(v.content.commands.length > 0){
            $.each(v.content.commands,function(key,val){
              $("#listofcommands").append(
                "<li><code> $ "+val.command+"</code></li>"
              );
            });
          }
        }
      });
    });
  }

  $.fn.cli = function(options, handler, effect){

    var opts = $.extend( {}, $.fn.cli.defaults, options );

    if (!effect) effect = $.fn.text;

    var loghistory = []

    // return focus
    $("#terminal").click(function(){
      $('.textinline').focus();
    });

    return this.each(function(){

      localStorage.setItem("idinput",1);

      var self = $("#terminal");

      function newline(command){

        loghistory.push(command);

        localStorage.setItem("loghistory",loghistory);

        var idinput = parseInt(localStorage.getItem("idinput"));

        var dir = "";

        if(command.substring(0, 3) == "cd " && command.substring(3, command.length) != ""){
          localStorage.setItem('actualdir', "/"+command.substring(3, command.length));
        }

        if(command == "cd ..") {
          localStorage.setItem('actualdir', "");
        }

        dir = localStorage.getItem('actualdir');

        self.append(
          '<p class="input">'
        +   '<span class="prompt">you@tutorial:~'+dir+'$ </span>'
        +   '<span id="'+idinput+'" class="parent-textinline">'
        +     '<span id="'+idinput+'" class="textinline" style="outline-color:black" contenteditable="true">'
        +     '</span>'
        +   '</span>'
        + '</p>'
        );

        var count = parseInt(localStorage.getItem("idinput"));
        var total = count + 1;
        localStorage.setItem("idinput",total)

        $('[contenteditable]', self)[0].focus();

      }

      function commands(opts,text,id){

        var result = "";

        if(localStorage.getItem(text) != null){
          var object  = JSON.parse(localStorage.getItem(text));
          // verify the command if it is for the correct step
          if(object.step == "general"){
            if(text.indexOf("cd ") > -1){
              newline(text);
            } else if(!object.animation){
              newline(text);
            }
            return result = restCommand(opts,text,id);
          } else if(object.step != localStorage.getItem('actualstep')) {
            newline("");
            return result = "you can only run this command in step " + object.step;
          } else {
            // If is it has dependencies?
            if(Array.isArray(object.depend)){
              //newline("");
              var missingCommands = [];
              for (var i = 0; i < object.depend.length; i++) {
                var missingCommand  = JSON.parse(localStorage.getItem(object.depend[i]));
                if(!missingCommand.done){
                  missingCommands.push(missingCommand.command)
                }
              }
              if(missingCommands.length > 1){
                newline("");
                return result = "You have to run these commands before: "+missingCommands.join(' | ');
              } else if(missingCommands.length == 1){
                newline("");
                return result = "You have to run this command before: "+missingCommands.join(' | ');
              } else {
                // update
                localStorage.setItem(text,
                  JSON.stringify(
                    {step:object.step,
                     command:object.command,
                     depend: object.depend,
                     done:true,
                     orden: object.order,
                     max:object.count
                    }));
                if(text.indexOf("cd ") > -1){
                  newline(text);
                } else if (text == "vagrant ssh" || text == "cat /etc/aurora/clusters.json"){
                  newline("");
                }
                return result = restCommand(opts,text,id);
              }
            } else if(object.depend != ""){
              // check which command or commands depends
              var dependCommand  = JSON.parse(localStorage.getItem(object.depend));
              if(!dependCommand.done){
                newline("");
                return result = "You have to run this command before: "+dependCommand.command;
              } else {
                // update
                localStorage.setItem(text,
                  JSON.stringify(
                    {step:object.step,
                     command:object.command,
                     depend: object.depend,
                     done:true,
                     orden: object.order,
                     max:object.count
                    }));
                if(text.indexOf("cd ") > -1){
                  newline(text);
                } else if (text == "vagrant ssh" || text == "cat /etc/aurora/clusters.json"){
                  newline("");
                }
                return result = restCommand(opts,text,id);
              }
            } else {
              // update
              localStorage.setItem(text,
                JSON.stringify(
                  {step:object.step,
                   command:object.command,
                   depend: object.depend,
                   done:true,
                   orden: object.order,
                   max:object.count
                  }));
              if(text.indexOf("cd ") > -1){
                newline(text);
              } else if (text == "vagrant ssh" || text == "cat /etc/aurora/clusters.json"){
                newline("");
              }
              return result = restCommand(opts,text,id);
            }
          }
        } else {
          newline(text);
        }

      }

      function restCommand(opts,text,id){

        var result = "";

        $.ajaxSetup({
          async: false
        });

        $.getJSON(opts,function(data){
          $.each(data,function(key,steps){
            $.each(steps,function(k,commands){
              for (var i = 0; i < commands.length; i++) {
                // when more than one command have the same result
                if(Array.isArray(commands[i].command)){
                  for(var c = 0; c < commands[i].command.length; c++){
                    if(text == commands[i].command[c]) {
                      if(commands[i].animation != undefined){
                        if(commands[i].animation){
                          var arrayMultiResult = [];
                          for (var l = 0; l < commands[i].result.length; l++) {
                            arrayMultiResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                          }
                          result = arrayMultiResult;
                        }
                      } else {
                        result = commands[i].result;
                      }
                    }
                  }
                }
                if(text == commands[i].command) {
                  if(commands[i].result != undefined){
                    if(commands[i].animation != undefined){
                      if(commands[i].animation){
                        var arrayResult = [];
                        for (var l = 0; l < commands[i].result.length; l++) {
                          arrayResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                        }
                        result = arrayResult;
                      }
                    } else {
                      result = commands[i].result;
                    }
                  }
                }
              }
            });
          });
        });

        return result;

      }

      function loadStepToLocalStorage(jsonCommands){
        $.getJSON(jsonCommands,function(data){
          $.each(data,function(ks,steps){
            $.each(steps,function(kc,commands){
              for (var i = 0; i < commands.length; i++) {
                // when more than one command have the same result
                if(Array.isArray(commands[i].command)){
                  for(var c = 0; c < commands[i].command.length; c++){
                    localStorage.setItem(commands[i].command[c],
                      JSON.stringify(
                        {step:steps.step,
                         command:commands[i].command[c],
                         depend: commands[i].depend,
                         done:false,
                         orden: commands[i].order,
                         max:steps.count,
                         animation: (commands[i].animation == undefined) ? false : commands[i].animation
                        }));
                  }
                } else {
                  localStorage.setItem(commands[i].command,
                    JSON.stringify(
                      {step:steps.step,
                       command:commands[i].command,
                       depend: commands[i].depend,
                       done:false,
                       orden: commands[i].order,
                       max:steps.count,
                       animation: (commands[i].animation == undefined) ? false : commands[i].animation
                      }));
                }
              }
            });
          });
        });
      }

      function preLoadFile(data){
        var files = []
        $.ajaxSetup({
          async: false
        });
        if(data != "") {
          $.getJSON(data,function(data){
            $.each(data,function(k,v){
              // using .join method to convert array to string without commas
              files.push(v.name);
              // save each file
              localStorage.setItem(v.name,
                JSON.stringify({
                  content: v.content.join(""),
                  language: (v.language == undefined) ? "markup" : v.language
                }));
            });
          });
          localStorage.setItem("files",files);
        }
      }

      //  autocomplete (tab) commands, issue #42
      function autocompleteCommands(commands){
        var listCommands = []
        $.ajaxSetup({
          async: false
        });
        $.getJSON(commands,function(data){
          $.each(data,function(k,v){
            // when more than one command have the same result
            if(Array.isArray(v.command)){
              for(var c = 0; c < v.command.length; c++){
                listCommands.push(v.command[c]);
              }
            }
            listCommands.push(v.command);
          });
        });
        listCommands.push("test"); // is only for testing....
        localStorage.setItem("commands",listCommands);
      }

      newline("");
      autocompleteCommands(opts.commandStepsFile);
      // load commands steps from json
      loadStepToLocalStorage(opts.commandStepsFile);
      // preload all files from json
      preLoadFile(opts.preloadfile);

      var id = 0;

      self.on('keydown', '[contenteditable]', function(event){

        if (event.keyCode == 13){

          id++;

          $(this).removeAttr('contenteditable');
          effect.call($('<p id="'+id+'" class="response">').appendTo(self),handler(this.textContent || this.innerText));

          // print the result of commands
          $("#"+id+".response").html(commands(opts.commandStepsFile,$(this).text(),id));

          if($(this).text() == "nano"){
            $("#terminal").hide();
            $('#editor-header-filename').html("File: ");
            $('#editor-content').html('');
            $('#namefile-x').html('');
            $("#command-x").hide();
            $("#editor").show();
            $('#editor-content').focus();
            //newline("");
          }

          if( $(this).text().replace(/\s\s+/g,' ') == "nano " + $(this).text().split(" ").pop() ){
            $("#terminal").hide();
            $('#editor-content').html('');
            $('#editor-header-filename').html("File: ");
            $('#namefile-x').html('');
            $("#editor").show();

            if(localStorage.getItem($(this).text().split(" ").pop()) != null) {
              var file = JSON.parse(localStorage.getItem($(this).text().split(" ").pop()));
              $('#editor-content').html(
                '<pre><code id="lang" class="language-'+file.language+'">'
                +'</code></pre>'
              );
              $('#lang').html(file.content);
              Prism.highlightElement($('#lang')[0]);
              // show the name of the file in header
              $('#editor-header-filename').html("File: " + $(this).text().split(" ").pop());
              // show the name of the file again
              $('#namefile-x').html($(this).text().split(" ").pop());
            } else {
              $('#editor-header-filename').html("File: ");
              $('#namefile-x').html('');
            }

            $('#editor-content').focus();
            $("#command-x").hide();

          }

          // list of commands we can't use....
          var commandTest = ["mv"];

          for (i = 0; i < commandTest.length; i++) {
            if($(this).text() == commandTest[i]) {
              $("#"+id+".response").html("This is an emulator, not a shell. Try following the instructions.");
            }
          }

          // show preload files issue #62
          if($(this).text() == "ls") {
            $("#"+id+".response").html(localStorage.getItem("files").split(",").join(" "));
          }

          function removeItemFromArray(array, item){
            for(var i in array){
              if(array[i]==item){
                array.splice(i,1);
                break;
              }
            }
          }

          // delete file remove a key from LocalStorage issue #81
          if($(this).text().replace(/\s\s+/g,' ') == "rm -r " + $(this).text().split(" ").pop()) {
            var fileName = $(this).text().split(" ").pop();
            if(localStorage.getItem(fileName) != null){
              var arrayFiles = localStorage.getItem("files").split(',');
              arrayFiles = arrayFiles.filter(Boolean);
              removeItemFromArray(arrayFiles, fileName);
              localStorage.setItem("files",arrayFiles);
              localStorage.removeItem(fileName);
            }
          }

          // git clone
          if($(this).text().replace(/\s\s+/g,' ') == "git clone " + $(this).text().split(" ").pop()) {

            $("#"+id+".response").html("");
            $("#"+id+".response .objects").stop();

            var url = $(this).text().split(" ").pop();
            var gitURL = "git://";
            var httpURL = "https://";
            var git = ".git";
            var urlBoolean = false;
            var gitBoolean = false;

            if ( url.indexOf(gitURL) > -1 || url.indexOf(httpURL) > -1 ) {
              urlBoolean = true
            }

            if( url.indexOf(git) > -1 ){
              gitBoolean = true
            }

            var repoName= url.substring(url.lastIndexOf("/")+1,url.lastIndexOf(".git"));

            if(urlBoolean && gitBoolean){

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
                + ' <span id="down_m" class="down">28</span> MiB | <span id="down_k" class="down">167</span> '
                + ' Kib/s, done. </span><br/> '
                );

                $("#"+id+".response #down_m").html(100);
                $("#"+id+".response #down_p").html(4643);
                $("#"+id+".response #down_m").html(28);
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
                      newline("");
                    });

                  });

                });

              });

            } else {
              $("#"+id+".response").html("fatal: repository '"+url+"' does not exist");
            }

          }

          var inputUser = $(this).text();
          if($("#"+id+".cline").length > 0){
            $("#"+id+".cline").css({'display':'none'});
            $.each($("#"+id+".cline"), function(i, el){
              $(el).delay(400*i).fadeIn("slow");
            }).promise().done(function(){
              newline("");
            });
          }

        }

      });

      // get log!! up and down
      localStorage.setItem("initup",0);
      localStorage.setItem("initdown",0);

      $(document).on('keydown','.textinline', function(event){
        var idparent = $(this).parent().get(0).id;
        var arrayLog = localStorage.getItem("loghistory").split(',');
        arrayLog = arrayLog.filter(Boolean); // remove empty string
        if(event.which == 38){
          var count = parseInt(localStorage.getItem("initup"));
          var total = count + 1;
          if(total > arrayLog.length-1) {
            localStorage.setItem("initup",0);
          } else {
            localStorage.setItem("initup",total);
          }
          $("#"+idparent+".parent-textinline").children(".textinline").html(arrayLog[localStorage.getItem("initup")]);
        }
        localStorage.setItem("total",arrayLog.length - 1 - parseInt(localStorage.getItem("initdown")));
        if(event.which == 40){
          var count = parseInt(localStorage.getItem("initdown"));
          var count = count + 1;
          localStorage.setItem("initdown",count);
          if(localStorage.getItem("total") == -1){
            localStorage.setItem("initdown",0);
          }
          $("#"+idparent+".parent-textinline").children(".textinline").html(arrayLog[localStorage.getItem("total")]);
        }
        // autocomplete of commands
        var arrayCommands = new Array();
        arrayCommands = localStorage.getItem("commands").split(',');
        if(event.which == 9){
          for(var c = 0; c < arrayCommands.length; c++){
            var regex = new RegExp("\^"+arrayCommands[c].substring(0,3));
            if(regex.test($(this).text())){
              $("#"+idparent+".parent-textinline").children(".textinline").text(arrayCommands[c]);
            }
          }
        }
      });

      // shortcuts of nano editor
      var isCtrl = false;

      $(document).on('keydown','#editor-content',function(event){
        if(event.which == 17) isCtrl=false;
      }).keydown(function (event) {
        if($("#editor-content").is(':visible')){
          // close the nano editor
          if(event.which == 17) isCtrl=true;
          if(event.which == 88 && isCtrl == true) {
            if($("#editor-content").text() != "") {
              if(!$("#command-x").is(':visible')){
                $("#commands").hide();
                $("#command-save-x").show();
                $("#q-save-x").focus();
              }
              return false;
            } else {
              $("#editor").hide();
              $("#terminal").show();
              $("#command-save-x").hide();
              $('.textinline').focus();
              return false;
            }
          }
        }
      });

      $("#q-save-x").keydown(function(event){
        $(this).html("");
        // Y
        if(event.which == 89){
          $("#command-save-x").hide();
          $("#command-x").show();
          $("#commands").show();
          $('#namefile-x').focus();
        }
        // N
        if(event.which == 78){
          $("#command-save-x").hide();
          $("#commands").show();
          $("#editor").hide();
          $("#terminal").show();
          $('.textinline').focus();
        }
        if(event.which != 89 || event.which != 78 ){
          event.preventDefault();
        }
      });

      var isCtrlCancel = false;

      $(document).on('keydown','#command-save-x',function(event){
        if(event.which == 17) isCtrlCancel=false;
      }).keydown(function (event) {
        if($("#command-save-x").is(':visible')){
          if(event.which == 17) isCtrlCancel=true;
          if(event.which == 67 && isCtrlCancel == true) {
            // cancel the modified file
            $("#command-save-x").hide();
            $("#commands").show();
          }
        }
      });

      $(document).on('keydown','#namefile-x',function(event){
        if (event.keyCode == 13){
          if(localStorage.getItem($(this).text()) != null){
            // update file
            var file = JSON.parse(localStorage.getItem($(this).text()));
            localStorage.setItem($(this).text(),
              JSON.stringify({
                content: $("#editor-content").html(),
                language: file.language
              }));
          } else {
            // save a new file
            localStorage.setItem($(this).text(),
              JSON.stringify({
                content: $("#editor-content").html(),
                language: "markup"
              }));
          }
          $("#editor").hide();
          $("#terminal").show();
          $('.textinline').focus();
          // update the list of files
          var arrayFiles = localStorage.getItem("files").split(',');
          arrayFiles = arrayFiles.filter(Boolean); // remove empty string
          // prevent duplicate files
          var existDuplicate = true;
          for(var f = 0; f < arrayFiles.length; f++){
            if(arrayFiles[f] != $(this).text()){
              checkDuplicate = false;
            } else {
              return false;
            }
          }
          if(!checkDuplicate){
            arrayFiles.push($(this).text());
            localStorage.setItem("files",arrayFiles);
          }
        }
      });

      $(document).on('click','#namefile-x',function(event){
        $('#namefile-x').focus();
      });

      $("#editor-content").click(function(){
        $(this).focus();
      });

      $("#q-save-x").click(function(){
        $(this).focus();
      });

    });

  };

  $.fn.cli.defaults = {
    commandStepsFile: "src/listofcommandsteps.json",
    preloadfile: "src/preloadfile.json"
  };

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // We already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
    var opts = this.options;

    $(this.element).append(
      '<div class="container-fluid">'
    +   '<div class="row">'

    +     '<div id="steps_section" class="col-xs-4">'
    +       '<div id="steptitle"></div>'
    +       '<hr/ class="style">'
    +       '<ul id="listofsteps">'
    +       '</ul>'
    +       '<hr/ class="style">'
    +       '<div id="stepscontent"></div>'
    +       '<br/><br/>'
    +     '</div>'

    +     '<div id="terminal_section" class="col-xs-8">'

    +       '<div class="row">'
    +         '<div id="terminal-parent">'
    +           '<div id="terminal" class="col-xs-12 heightTerminal"></div>'
    +         '</div>'
    +       '</div>'

    +       '<div id="editor-parent" class="row">'
    +         '<div id="editor" class="col-xs-12 heightTerminal">'
    +           '<div id="editor-header" class="row">'
    +             '<div id="editor-header-title" class="col-xs-3">GNU nano 2.2.6</div>'
    +             '<div id="editor-header-filename" class="col-xs-9">New Buffer</div>'
    +           '</div>'

    +           '<div class="row">'
    +             '<div id="editor-content-parent">'
    +               '<div id="editor-content" class="col-xs-12" contenteditable="true"></div>'
    +             '</div>'
    +           '</div>'

    +           '<div class="row">'
    +             '<div id="editor-commands" class="col-xs-12">'

    +               '<div id="command-save-x">'
    +                 '<div class="row">'
    +                   '<div id="message-save-x" class="col-xs-7">'
    +                     'Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES) ?'
    +                   '</div>'
    +                   '<div id="q-save-x" class="col-xs-5" contenteditable="true"></div>'
    +                 '</div>'
    +                 '<div class="row">'
    +                   '<div class="col-xs-2"><span class="editor-command">'+'&nbsp;'+'Y</span> Yes</div>'
    +                 '</div>'
    +                 '<div class="row">'
    +                   '<div class="col-xs-2"><span class="editor-command">'+'&nbsp;'+'N</span> No</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^C</span> Cancel</div>'
    +                 '</div>'
    +               '</div>'

    +               '<div id="command-x" class="row">'
    +                 '<div id="message-x" class="col-xs-3">File Name to Write:</div>'
    +                 '<div id="namefile-x" class="col-xs-9" contenteditable="true"></div>'
    +               '</div>'

    +               '<div id="commands">'
    +                 '<div class="row">'
    +                   '<div class="col-xs-2"><span class="editor-command">^G</span> Get Help</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^O</span> WriteOut</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^R</span> Read File</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^Y</span> Prev Page</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^K</span> Cut Text</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^C</span> Cur Pos</div>'
    +                 '</div>'

    +                 '<div class="row">'
    +                   '<div class="col-xs-2"><span class="editor-command">^X</span> Exit</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^J</span> Justify</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^W</span> Where is</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^V</span> Next Page</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^U</span> UnCut Text</div>'
    +                   '<div class="col-xs-2"><span class="editor-command">^T</span> To Speel</div>'
    +                 '</div>'
    +               '</div>'

    +             '</div>'
    +           '</div>'

    +         '</div>'
    +       '</div>'

    +     '</div>'
    +   '</div>'
    + '</div>'
    );

    localStorage.setItem('actualstep',"");
    localStorage.setItem('actualdir',"");

    $(".heightTerminal").css("height",opts.heightTerminal + "px");

    $("#editor").hide();

    listOfSteps(opts);
    showInfoOfEachStep(opts, opts.initStep);
    localStorage.setItem('actualstep',opts.initStep);

    $(document).on('click','.btn-step',function(){
      showInfoOfEachStep(opts,$(this).data('step'));
    }).on('mouseup','.btn-step',function(){
      $("#"+opts.initStep+".btn-step").css({"background-color": "#8F8F8F", "color": "white"});
      $(this).css({"background-color": "#8F8F8F", "color": "white"});
    });

    $("#terminal").append('<div class="line">'+insertAt(opts.welcomeMessage, 27, opts.nameOfTheProject)+'</div>');
    $("#terminal").append('<br/>');

    var heightContentParent = opts.heightTerminal - $("#editor-commands").height()
                                  - $("#editor-header").height() - 100;

    var heightContent = heightContentParent;

    $("#steps_section").css("height",opts.heightTerminal + "px");
    $("#editor-content-parent").css("height",heightContentParent + "px");
    $("#editor-content").css("height",heightContent + "px");

    // messages of commands
    $("#command-x").hide();
    $("#command-save-x").hide();

  };

  function insertAt(src, index, str) {
    return src.substr(0, index) + str + " " + src.substr(index);
  }

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if ( !$.data(this, "plugin_" + pluginName )) {
        $.data( this, "plugin_" + pluginName,
        new Plugin( this, options ));
      }
    });
  }

})( jQuery, window, document );
