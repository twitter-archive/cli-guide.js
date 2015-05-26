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
                +       '<a class="btn-step" href="#" data-step="'+v.step+'">'
                +           v.step
                +       '</a>'
                +   '</li>'
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
                    +   '<hr/ class="style">'
                    +   "<p>"+v.content.content.join("")+"</p>"
                    +   '<hr/ class="style">'
                    +   "<h3>Tips</h3>"
                    +   "<p>"+v.content.tips+"</p>"
                    +   '<ul id="listofcommands"></ul>'                    
                    );

                    $.each(v.content.commands,function(key,val){
                        $("#listofcommands").append(
                            "<li><code> $ "+val.command+"</code></li>" 
                        );
                    });
                }

            });

        });
    }

    $.fn.cli = function(handler, prompt, effect){
        
        if (!effect) effect = $.fn.text;

        // return focus
        $("#terminal").click(function(){
            $('.textinline').focus();
        })

        return this.each(function(){

            var self = $("#terminal");

            function newline(command){

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
                +       '<span class="prompt">you@tutorial:~'+text+'$ </span>'
                +       '<span class="textinline" style="outline:none" contenteditable="true"></span>'
                +   '</p>'
                );
                
                $('[contenteditable]', self)[0].focus();

            }

            newline("");

            self.on('keydown', '[contenteditable]', function(event){

                if (event.keyCode == 13){
                    
                    $(this).removeAttr('contenteditable');
                    effect.call($('<p class="response">').appendTo(self),handler(this.textContent || this.innerText));
                    
                    newline($(this).text());                    

                    if($(this).text() == "nano"){                    
                        $("#terminal").hide();
                        $("#editor").show();
                    }

                    // list of commands we can't use....
                    var commandTest = ["ls", "mv"];

                    for (i = 0; i < commandTest.length; i++) {
                        if($(this).text() == commandTest[i]){
                            $(".response").html("This is an emulator, not a shell. Try following the instructions.");                    
                        }                        
                    }             

                    return false;

                }
                
            });
            

            // shortcuts of nana editor
            var isCtrl = false;

            $(document).on('keydown','#editor-content',function(event){
                if(event.which == 17) isCtrl=false;
            }).keydown(function (event) {
                if(event.which == 17) isCtrl=true;
                if(event.which == 88 && isCtrl == true) {
                    $("#editor").hide();
                    $("#terminal").show(); 
                    return false;
                }
            });
            
        });
    };
 
    Plugin.prototype.init = function () {
        // Place initialization logic here
        // We already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options
        var opts = this.options;
        
        $(this.element).append(
            '<div id="steps_block">'
        +       '<div id="steptitle"></div>'                                
        +       '<hr/ class="style">'
        +       '<ul id="listofsteps">'
        +       '</ul>'
        +       '<hr/ class="style">'
        +       '<div id="stepscontent"></div>'
        +   '</div>'
        +   '<div id="terminal_block">'
        +       '<div id="terminal" class="heightTerminal"></div>'
        +       '<div id="editor" class="heightTerminal">'
        +           '<div id="editor-title">GNU nano 2.2.6</div>'
        +           '<br/>'
        +           '<div id="editor-content" contenteditable="true"></div>'
        +           '<br/>'
        +           '<div id="editor-commands" class="grid-container-editor">'
        +               '<div class="row">'
        +                   '<div class="col-1"><span class="editor-command">^G</span> Get Help</div>'
        +                   '<div class="col-1"><span class="editor-command">^O</span> WriteOut</div>'
        +                   '<div class="col-1"><span class="editor-command">^R</span> Read File</div>'
        +                   '<div class="col-1"><span class="editor-command">^Y</span> Prev Page</div>'
        +                   '<div class="col-1"><span class="editor-command">^K</span> Cut Text</div>'
        +                   '<div class="col-1"><span class="editor-command">^C</span> Cur Pos</div>'
        +               '</div>'
        +               '<div class="row">'
        +                   '<div class="col-1"><span class="editor-command">^X</span> Exit</div>'
        +                   '<div class="col-1"><span class="editor-command">^J</span> Justify</div>'
        +                   '<div class="col-1"><span class="editor-command">^W</span> Where is</div>'
        +                   '<div class="col-1"><span class="editor-command">^V</span> Next Page</div>'
        +                   '<div class="col-1"><span class="editor-command">^U</span> UnCut Text</div>'
        +                   '<div class="col-1"><span class="editor-command">^T</span> To Speel</div>'
        +               '</div>'
        +           '</div>'
        +       '</div>'
        +   '</div>'
        +   '<div class="clear"></div>'
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

        localStorage.clear();

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
