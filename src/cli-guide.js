/*
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
      nameOfTheProject: 'CLI-Guide.JS',
      heightTerminal: window.innerHeight,
      initStep: 1
    };

  // Util
  var Util = {
    insertAt: function(src, index, str){
      return src.substr(0, index) + str + " " + src.substr(index);
    },
    removeItemFromArray: function(array, item){
      for(var i in array){
        if(array[i]==item){
          array.splice(i,1);
          break;
        }
      }
    }
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

  $.fn.cli = function(options, handler, effect){

    var opts = $.extend( {}, $.fn.cli.defaults, options );

    if (!effect) effect = $.fn.text;

    var loghistory = [];

    // return focus
    $("#terminal").click(function(){
      $('.textinline').focus();
    });

    return this.each(function(){

      localStorage.setItem("idinput",1);

      var self = $("#terminal");

      var Step = {
        list: function(stepsFile){
          if(stepsFile !== ""){
            $.getJSON(stepsFile,function(data){
              $.each(data,function(k,v){
                Step.listTemplate(v.step);
              });
            });
          } else {
            Step.listTemplate(1);
          }
        },
        showInfo: function(stepsFile, skipsteps, step){
          // select current step
          if(stepsFile !== ""){
            localStorage.setItem('actualstep',step);
            var skipStepArray = JSON.parse("[" + skipsteps + "]");

            $(".btn-step").removeClass("active");
            $("#stepscontent").html('');
            $.getJSON(stepsFile,function(data){
              $.each(data,function(k,v){
                if(v.step == step){
                  Step.showInfoTemplate(step,v.step,skipStepArray,v.content.title,v.content.body,
                                        v.content.tips,v.content.commands,v.content.moreinfo);
                }
              });
            });

            // appears a check when a Step finished
            var actualStep = localStorage.getItem('actualstep');
            var $finish = $("#finish[data-step="+actualStep+"]");
            var finishedStep = JSON.parse(localStorage.getItem(step));

            if(step == Step.getLast() && finishedStep) {
              $("#"+step).removeClass("not-active");
              $finish.addClass("ok-b");
              $finish.html("Finish ✓");
            } else if(finishedStep){
              $("#"+step).removeClass("not-active");
              $finish.addClass("ok-b");
              $finish.html("Next ✓");
            } else {
              $finish.html("");
            }

          } else {
            var command = [{"command":"git clone https://github.com/twitter/cli-guide.js.git"}];
            Step.showInfoTemplate(1,1,"","CLI-Guide.js","A javascript library for creating interactive "+
            "command line tutorials that run in your web browser. ",
                                  "tips here!",command,"");
          }

        },
        getLast: function() { // return an int
          var step;
          $.ajaxSetup({
            async: false
          });
          $.getJSON(opts.stepsFile,function(data){
            $.each(data,function(k,v){
              if(v.laststep){
                step = v.step;
              }
            });
          });
          return step;
        },
        clean: function(opts){
          $.getJSON(opts,function(data){
            $.each(data,function(ks,steps){
              localStorage.removeItem(steps.step);
              localStorage.setItem(steps.step,false);
            });
          });
        },
        skip: function(opts,step){
          $.getJSON(opts.stepsFile,function(data){
            $.each(data,function(k,v){
              if(v.step == step){
                if(v.content.commands.length > 0){
                  $.each(v.content.commands,function(key,val){
                    var object  = JSON.parse(localStorage.getItem("step-"+val.command));
                    localStorage.setItem("step-"+val.command,
                    JSON.stringify(
                      {step:object.step,
                       command:object.command,
                       type:object.type,
                       depend: object.depend,
                       done:true,
                       animation: object.animation,
                       lastCommand: object.lastCommand
                      }));
                  });
                }
              }
            });
          });
          localStorage.setItem(step,true);
          var nextstep = step+1;
          var $finish = $("#finish[data-step="+step+"]");
          $finish.addClass("ok-b");
          $finish.html("Next ✓");
          // enable the next step
          $("#"+nextstep).removeClass("not-active");
          // switch to next step
          Step.showInfo(opts.stepsFile, opts.skipsteps, nextstep);
        },
        listTemplate: function(step){
          var not_active = ( step == 1 ) ? "": "not-active";
          $("#listofsteps").append(
            '<li class="step">'
          +   '<a id="'+step+'" class="btn-step '+not_active+'" href="#" data-step="'+step+'">'
          +     step
          +   '</a>'
          + '</li>'
          );
        },
        showInfoTemplate: function(ustep,step,skipStepArray,title,content,tips,commands,moreinfo) {
          $("#stepscontent").html('');
          content = Array.isArray(content) ? content.join("") : content;
          $("#"+step+".btn-step").addClass("active");
          $("#steptitle").html("<h3>Step "+step+"</h3>");
          var nextstep = ( (ustep + 1) > Step.getLast() ) ? Step.getLast() : ustep + 1;
          var skip = '';
          for (var i = 0; i < skipStepArray.length; i++) {
            if(ustep == skipStepArray[i]){
              skip = '<a href="#" id="skip" class="skip-b" data-step="'+ustep+'">skip</a>';
            }
          }
          $("#stepscontent").append(
            '<h3>'+title+' <a href="#" id="finish" data-nextstep="'+nextstep+'" data-step="'+ustep+'"></a>' +
            skip +
            '</h3>' +
            '<p>'+content+'</p>'
          );
          if(moreinfo !== undefined){
            moreinfo = Array.isArray(moreinfo) ? moreinfo.join("") : moreinfo;
            Modal.showInfo("moreinfo",moreinfo);
          }
          if(tips !== ""){
            var tip =  Array.isArray(tips) ? tips.join("") : tips;
            $('#stepscontent').append(
              '<hr/ class="style">'
            + '<h3>Tips</h3>'
            + '<p>'+tip+'</p>'
            + '<ul id="listofcommands"></ul>'
            );
          }
          if(commands.length > 0 && Array.isArray(commands)){
            $.each(commands,function(key,val){
              $("#listofcommands").append(
                '<li> <span class="promptlabel">$ </span>'+val.command+'</li>'
              );
            });
          }
          // for image modal
          $('#stepscontent').append('<div id="contentimgmodal"><div>');
        }
      };

      var Cli = {
        newline: function(command,id){
          loghistory.push(command);

          localStorage.setItem("loghistory",loghistory);

          var idinput = parseInt(localStorage.getItem("idinput"));

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

          self.append(
             '<div id="'+idinput+'" class="parent-textinline">'
          +     '<div class="prompt">you@tutorial:~'+dir+'$ </div>'
          +     '<div id="'+idinput+'" spellcheck="false" class="textinline" style="outline-color:black" contenteditable="true">'
          +       '&nbsp;'
          +     '</div>'
          +  '</div>'
          );

          var count = parseInt(localStorage.getItem("idinput"));
          var total = count + 1;
          localStorage.setItem("idinput",total)

          $('[contenteditable]', self)[0].focus();

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

      // Modal and methods
      var Modal = {
        showInfo: function(div,content){
          $("#"+div).html(
              '<div id="modal" class="modalDialog">'
            +   '<div>'
            +     '<a href="#close" title="Close" class="close">X</a>'
            +     content
            +   '</div>'
            + '</div>'
          );
        },
        showImg: function(img, size){
          var sizeOfModal = "";
          if(size === "g"){
            sizeOfModal = "modalImgGDialog";
          } else if(size === "b"){
            sizeOfModal = "modalImgBDialog";
          } else {
            sizeOfModal = "modalImgSDialog";
          }
          $("#contentimgmodal").html(
              '<div id="modal" class="modalDialog '+sizeOfModal+'">'
            +   '<div>'
            +     '<a href="#close" title="Close" class="close">X</a>'
            +     '<img class="imginmodal" src="'+img+'" />'
            +   '</div>'
            + '</div>'
          );
        },
        close: function() {
          if (location.hash == '#modal') {
            location.hash = '';
          }
        }
      };

      $(document).on('click','#modal',function(){
        Modal.close();
      });

      $(document).on('click','#modal div',function(event){
        event.stopPropagation();
      });

      var CommandValidation = {
        command: function(commands,text){
          var message = "";
          $.ajaxSetup({
            async: false
          });
          $.getJSON(commands,function(data){
            $.each(data,function(k,v){
              if((new RegExp(v.command)).test(text)){
                var regExp = new RegExp(v.regexp);
                if(!regExp.test(text)){
                  message = v.regexp_message;
                } else {
                  message = "";
                }
              }
            });
          });
          return message;
        }
      };

      function commands(opts,text,id){
        var input = text.trim();
        var result = "";
        var actualStep = localStorage.getItem('actualstep');
        var $finish = $("#finish[data-step="+actualStep+"]");

        if(input == "") {
          Cli.newline("");
        } else if(localStorage.getItem("step-"+input.replace(/\s\s+/g,' ')) !== null) {

          var object  = JSON.parse(localStorage.getItem("step-"+input.replace(/\s\s+/g,' ')));

          if(object.lastCommand || JSON.parse(localStorage.getItem(actualStep))){
            if(actualStep == Step.getLast()){
              $finish.addClass("ok-b");
              $finish.html("Finish ✓");
              localStorage.setItem(actualStep,true);
            } else {
              if(actualStep === object.step){
                $finish.addClass("ok-b");
                $finish.html("Next ✓");
                localStorage.setItem(actualStep,true);
              }
            }
          } else {
            $finish.html("");
          }

          // verify the command if it is for the correct step
          if(object.step === "general"){
            if(text.indexOf("cd ") > -1){
              Cli.newline(input.replace(/\s\s+/g,' '),id);
            } else if(!object.animation){
              Cli.newline(input.replace(/\s\s+/g,' '),id);
            }
            return result = restCommand(opts,text,id);
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
                Cli.newline("");
                return result = "You have to run these commands before: "+missingCommands.join(' | ');
              } else if(missingCommands.length == 1){
                Cli.newline("");
                return result = "You have to run this command before: "+missingCommands.join(' | ');
              } else {
                // update
                localStorage.setItem(input.replace(/\s\s+/g,' '),
                  JSON.stringify(
                    {step:object.step,
                     command:object.command,
                     type: object.type,
                     depend: object.depend,
                     done:true,
                     animation: object.animation,
                     lastCommand: object.lastCommand
                    }));
                if(object.type === "native" || object.type === "static"){
                  Cli.newline(input.replace(/\s\s+/g,' '),id);
                }
                return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
              }
            } else if(object.depend !== ""){
              // check which command or commands depends
              var dependCommand  = JSON.parse(localStorage.getItem(object.depend));
              if(!dependCommand.done){
                Cli.newline("");
                return result = "You have to run this command before: "+dependCommand.command;
              } else {
                // update
                localStorage.setItem(input.replace(/\s\s+/g,' '),
                  JSON.stringify(
                    {step:object.step,
                     command:object.command,
                     type: object.type,
                     depend: object.depend,
                     done:true,
                     animation: object.animation,
                     lastCommand: object.lastCommand
                    }));
                if(object.type === "native" || object.type === "static"){
                  Cli.newline(input.replace(/\s\s+/g,' '),id);
                }
                return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
              }
            } else {
              // update
              localStorage.setItem(input.replace(/\s\s+/g,' '),
                JSON.stringify(
                  {step:object.step,
                   command:object.command,
                   type: object.type,
                   depend: object.depend,
                   done:true,
                   animation: object.animation,
                   lastCommand: object.lastCommand
                  }));
              if(object.type === "native" || object.type === "static"){
                Cli.newline(input.replace(/\s\s+/g,' '),id);
              }
              return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
            }
          }
        } else {
          $("#"+id+".response").html(''); // remove pre and code
          if(opts.commandStepsFile === "") {
            Cli.newline(input,id);
          }
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
              for(var i = 0; i < commands.length; i++) {
                if(commands[i].command !== undefined){
                  // when more than one command have the same result
                  if(Array.isArray(commands[i].command)){
                    for(var c = 0; c < commands[i].command.length; c++){
                      if(text.trim() == commands[i].command[c]) {
                        if(commands[i].type !== undefined){
                          if(commands[i].type === "animation"){
                            var arrayMultiResult = [];
                            for (var l = 0; l < commands[i].result.length; l++) {
                              arrayMultiResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                            }
                            result = arrayMultiResult;
                          } else {
                            result = commands[i].result;
                          }
                        }
                      }
                    }
                  }
                  if(commands[i].command === text.trim()) {
                    if(commands[i].result !== undefined){
                      if(commands[i].type !== undefined){
                        if(commands[i].type === "animation"){
                          var arrayResult = [];
                          for(var l = 0; l < commands[i].result.length; l++) {
                            arrayResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                          }
                          result = arrayResult;
                        } else {
                          result = commands[i].result;
                        }
                      }
                    }
                  }
                }
              }
            });
          });
        });

        //Prism.highlightElement($('#lang-terminal')[0]);
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
                    localStorage.removeItem("step-"+commands[i].command[c]);
                    localStorage.setItem("step-"+commands[i].command[c],
                      JSON.stringify(
                        {step:steps.step,
                         command:commands[i].command[c],
                         type:commands[i].type,
                         depend: commands[i].depend,
                         done:false,
                         animation: (commands[i].animation === undefined) ? false : commands[i].animation,
                         lastCommand: (commands[i].lastCommand === undefined) ? false : commands[i].lastCommand
                        }));
                  }
                } else {
                  localStorage.removeItem("step-"+commands[i].command);
                  localStorage.setItem("step-"+commands[i].command,
                    JSON.stringify(
                      {step:steps.step,
                       command:commands[i].command,
                       type:commands[i].type,
                       depend: commands[i].depend,
                       done:false,
                       animation: (commands[i].animation === undefined) ? false : commands[i].animation,
                       lastCommand: (commands[i].lastCommand === undefined) ? false : commands[i].lastCommand
                      }));
                }
              }
            });
          });
        });
      }

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

      var Nano = {
        open: function(){
          $("#terminal").hide();
          $('#editor-header-filename').html("File: ");
          $('#editor-content').html('');
          $('#namefile-x').html('');
          $("#command-x").hide();
          $("#editor").show();
          $('#editor-content').focus();
        },
        openFile: function(filename){
          $("#terminal").hide();
          $('#editor-content-parent').html('');
          $('#editor-header-filename').html("File: ");
          $('#namefile-x').html('');
          $("#editor").show();
          // add a new line after open nano editor
          Cli.newline(filename);

          if(localStorage.getItem(filename) !== null) {
            var file = JSON.parse(localStorage.getItem(filename));
            $('#editor-content-parent').html(
              '<pre><code id="editor-content" contenteditable="false" style="outline-color:black" spellcheck="false" class="language-'+file.language+'">'
              +'</code></pre>'
            );
            $('#editor-content').html(file.content.split("<br>").join("\n"));
            Prism.highlightElement($('#editor-content')[0]);
            // show the name of the file in header
            $('#editor-header-filename').html("File: " + filename);
            // show the name of the file again
            $('#namefile-x').html(filename);
          } else {
            $('#editor-header-filename').html("File: ");
            $('#namefile-x').html('');
          }

          $('#editor-content').focus();
          $("#command-x").hide();
        }
      };

      //  autocomplete (tab) commands, issue #42
      function autocompleteCommands(commands){
        var listCommands = [];
        $.ajaxSetup({
          async: false
        });
        $.getJSON(commands,function(data){
          $.each(data,function(key,steps){
            $.each(steps,function(k,commands){
              for (var i = 0; i < commands.length; i++) {
                if(Array.isArray(commands[i].command)){
                  for(var c = 0; c < commands[i].command.length; c++){
                    if(commands[i].command !== undefined){
                      listCommands.push(commands[i].command[c]);
                    }
                  }
                } else {
                  if(commands[i].command !== undefined){
                    listCommands.push(commands[i].command);
                  }
                }
              }
            });
          });
        });
        localStorage.setItem("commands",listCommands);
      }

      // clean each steps
      Step.clean(opts.commandStepsFile);

      Cli.newline("");

      autocompleteCommands(opts.commandStepsFile);

      // load commands steps from json
      loadStepToLocalStorage(opts.commandStepsFile);

      // preload all files from json
      File.preLoad(opts.preloadfile);

      //listOfSteps(opts);
      Step.list(opts.stepsFile);
      Step.showInfo(opts.stepsFile, opts.skipsteps, 1);

      $(document).on('click','.btn-step',function(){
        Step.showInfo(opts.stepsFile, opts.skipsteps,$(this).data('step'));
      }).on('mouseup','.btn-step',function(){
        $("#"+opts.initStep+".btn-step").css({"background-color": "#8F8F8F", "color": "white"});
        $(this).css({"background-color": "#8F8F8F", "color": "white"});
      });

      $(document).on('click','#skip',function(){
        Step.skip(opts,$(this).data('step'));
      });

      $(document).on('click','#finish',function(){
        var nextstep = $(this).data('nextstep');
        Step.showInfo(opts.stepsFile, opts.skipsteps, nextstep);
        $("#"+nextstep).removeClass("not-active");
      });

      $(document).on('click','.modalimage',function(){
        Modal.showImg($(this).data('image'),$(this).data('size'));
      });

      // active editable in nano editor for open a file
      $(document).on('click','#editor-content',function(){
        $(this).attr('contenteditable',true);
      });

      var id = 0;

      self.on('keydown', '[contenteditable]', function(event){

        if(event.keyCode == 13){

          var input = $(this).text().trim();

          id++;

          $(this).removeAttr('contenteditable');
          $('<p id="'+id+'" class="response"></p>').appendTo(self);
          $("#"+id+".response").html(
              '<pre><code id="'+id+'_lang_terminal" class="language-bash">'
              +'</code></pre>'
          );
          Prism.highlightElement($('#'+id+'_lang_terminal')[0]);

          // print the result of commands
          if(opts.commandStepsFile !== "" && opts.commandValidation !== "") {
            if(CommandValidation.command(opts.commandValidation,input) !== "" ) {
              $('#'+id+'_lang_terminal').html(CommandValidation.command(opts.commandValidation,input));
              Cli.newline(input,id);
            } else {
              $('#'+id+'_lang_terminal').html(commands(opts.commandStepsFile,input,id));
            }
          } else if(opts.commandStepsFile !== "") {
            $('#'+id+'_lang_terminal').html(commands(opts.commandStepsFile,input,id));
          } else {
            // git clone return a new line after finish
            // only run commands different from git clone
            if(input.replace(/\s\s+/g,' ') !== "git clone " + input.split(" ").pop()) {
              $("#"+id+".response").html(''); //remove space
              Cli.newline(input,id);
            }
          }

          if(input == "nano"){
            $("#"+id+".response").html('');
            Nano.open();
          }

          if(input.replace(/\s\s+/g,' ') == "nano " + input.split(" ").pop()){
            $("#"+id+".response").html('');
            var filename = input.split(" ").pop();
            Nano.openFile(filename);
          }

          if(input.toLowerCase() == "ls") {
            Cli.ls(id);
          }

          if(input.toLowerCase() == 'clear'){
            Cli.clear();
          }

          // list of commands we can't use....
          Cli.unSupportedCommand(input,id);

          // delete file remove a key from LocalStorage issue #81
          if(input.replace(/\s\s+/g,' ') == "rm -r " + input.split(" ").pop()) {
            Cli.rm(input.split(" ").pop());
          }

          // git clone
          if(input.replace(/\s\s+/g,' ') == "git clone " + input.split(" ").pop()) {
            Cli.gitClone(input,id);
          }

          // show the animation
          if($("#"+id+".cline").length > 0){
            $("#"+id+".cline").css({'display':'none'});
            $.each($("#"+id+".cline"), function(i, el){
              $(el).delay(400*i).fadeIn("slow");
            }).promise().done(function(){
              Cli.newline(input,id);
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
          event.preventDefault();
        }
      });

      // shortcuts of nano editor
      $(document).on('keydown','#editor-content',function(e){
        if($("#editor-content").is(':visible')){
          if (e.keyCode == 88 && e.ctrlKey) {
            if($("#editor-content").text() !== "") {
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
        if(event.which !== 89 || event.which !== 78 ){
          event.preventDefault();
        }
      });

      // cancel "Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES)"
      $(document).on('keydown','#command-save-x',function(e){
        if($("#command-save-x").is(':visible')){
          if (e.keyCode == 67 && e.ctrlKey) {
            $("#command-save-x").hide();
            $("#commands").show();
          }
        }
      });

      $(document).on('keydown','#namefile-x',function(event){
        if (event.keyCode == 13){
          if(localStorage.getItem($(this).text()) !== null){
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
                language: UtilRegExp.language($(this).text())
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
            if(arrayFiles[f] !== $(this).text()){
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

  // the structure of these json template must be in the documentation
  $.fn.cli.defaults = {
    commandStepsFile: "",
    commandValidation: "",
    preloadfile: "",
    stepsFile : "",
    skipsteps: ""
  };

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // We already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
    var opts = this.options;

    $(this.element).append(
      '<div class="container-fluid">'

    +   '<div class="row steps-numbers-section">'
    +     '<div class="col-xs-12">'
    +       '<ul id="listofsteps">'
    +       '</ul>'
    +     '</div>'
    +   '</div>'

    +   '<div class="row">'
    +     '<div id="steps_section" class="col-xs-4">'
    +       '<div id="steptitle"></div>'
    +       '<hr/ class="style">'
    +       '<ul id="listofsteps">'
    +       '</ul>'
    +       '<hr/ class="style">'
    +       '<div id="stepscontent"></div>'
    +       '<div id="moreinfo"></div>'
    +       '<br/><br/>'
    +     '</div>'
    +   '</div>'

    +   '<div class="row">'
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
    +               '<pre><code id="editor-content" class="col-xs-12" style="outline-color:black" contenteditable="true" spellcheck="false" id="lang" class="language-markup"></code></pre>'
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

    localStorage.setItem('actualstep',opts.initStep);

    $("#terminal").append('<div class="line">'+Util.insertAt(opts.welcomeMessage, 27, opts.nameOfTheProject)+'</div>');
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
