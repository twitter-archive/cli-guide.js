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
      heightTerminal: window.innerHeight - 20,
      stepsFile: 'src/listofsteps.json'
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
        +   '<a class="btn-step" href="#" data-step="'+v.step+'">'
        +     v.step
        +   '</a>'
        + '</li>'
        );
      });
    });
  }

  function showInfoOfEachStep(opts,step){

    $("#stepscontent").html('');

    $.getJSON(opts.stepsFile,function(data){
      $.each(data,function(k,v){
        if(v.step == step){
          $("#steptitle").html("<h3>Step "+v.step+"</h3>")
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

        var text = "";

        if(command == "cd .." && localStorage.getItem('actualdir') != null) {
          localStorage.setItem('actualdir', "");
          text = localStorage.getItem('actualdir');
        } else if(command.substring(0, 2) == "cd"){
          localStorage.setItem('actualdir', "/"+command.substring(3, command.length));
          text = localStorage.getItem('actualdir');
        } else if(command == "") {
          localStorage.setItem('actualdir', "");
          text = localStorage.getItem('actualdir');
        }

        self.append(
          '<p class="input">'
        +   '<span class="prompt">you@tutorial:~'+text+'$ </span>'
        +   '<span id="'+idinput+'" class="parent-textinline">'
        +     '<span class="textinline" style="outline:none" contenteditable="true"></span>'
        +   '</span>'
        + '</p>'
        );

        var count = parseInt(localStorage.getItem("idinput"));
        var total = count + 1;
        localStorage.setItem("idinput",total)

        $('[contenteditable]', self)[0].focus();

      }

      function commands(opts,text){

        var result = "";

        $.ajaxSetup({
          async: false
        });

        $.getJSON(opts,function(data){
          $.each(data,function(k,v){
            // when more than one command have the same result
            if(Array.isArray(v.command)){
              for(c = 0; c < v.command.length; c++){
                if(text == v.command[c]) {
                  result = v.result;
                }
              }
            }
            if(text == v.command) {
              result = v.result;
            }
          });
        });
        return result;
      }

      function preLoadFile(data){
        if(data != "") {
          $.getJSON(data,function(data){
            $.each(data,function(k,v){
              localStorage.setItem(v.name, v.content);
            });
          });
        }
      }

      newline("");
      // preload all files from json
      preLoadFile(opts.preloadfile);
      var id = 0;

      self.on('keydown', '[contenteditable]', function(event){

        if (event.keyCode == 13){

          id++;

          $(this).removeAttr('contenteditable');
          effect.call($('<p id="'+id+'" class="response">').appendTo(self),handler(this.textContent || this.innerText));

          newline($(this).text());

          $("#"+id+".response").html(commands(opts.commandStepsFile,$(this).text()));

          if($(this).text() == "nano"){
            $("#terminal").hide();
            $('#editor-content').html('');
            $("#command-x").hide();
            $("#editor").show();
            $('#editor-content').focus();
          }

          if( $(this).text().replace(/\s\s+/g,' ') == "nano " + $(this).text().split(" ").pop() ){
            $("#terminal").hide();
            $('#editor-content').html('');
            $('#editor-header-filename').html('');
            $("#editor").show();

            if(localStorage.getItem($(this).text().split(" ").pop()) != null) {
              $('#editor-content').html(localStorage.getItem($(this).text().split(" ").pop()));
              // show the name of the file in header
              $('#editor-header-filename').html("File: " + $(this).text().split(" ").pop());
              // show the name of the file again
              $('#namefile-x').val($(this).text().split(" ").pop());
            } else {
              $('#namefile-x').html('');
            }

            $('#editor-content').focus();
            $("#command-x").hide();

          }

          // list of commands we can't use....
          var commandTest = ["ls", "mv"];

          for (i = 0; i < commandTest.length; i++) {
            if($(this).text() == commandTest[i]) {
              $("#"+id+".response").html("This is an emulator, not a shell. Try following the instructions.");
            }
          }

          return false;

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
          //console.log(arrayLog[localStorage.getItem("total")]);
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
          localStorage.setItem($(this).text(), $("#editor-content").html());
          $("#editor").hide();
          $("#terminal").show();
          $('.textinline').focus();
        }
      });

      $(document).on('click','#namefile-x',function(event){
        $('#namefile-x').focus();
      });

      $("#q-save-x").click(function(){
        $("#editor-content").blur();
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

    $(".heightTerminal").css("height",opts.heightTerminal + "px");

    $("#editor").hide();

    listOfSteps(opts);
    showInfoOfEachStep(opts, 0);

    $(document).on('click','.btn-step',function(){
      showInfoOfEachStep(opts,$(this).data('step'));
    });

    $("#terminal").append('<div class="line">'+insertAt(opts.welcomeMessage, 27, opts.nameOfTheProject)+'</div>');
    $("#terminal").append('<br/>');

    $("#editor").click(function(){
      $('#editor-content').focus();
    });

    var heightContentParent = opts.heightTerminal - $("#editor-commands").height()
                                  - $("#editor-header").height() - 100;

    var heightContent = heightContentParent;

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
