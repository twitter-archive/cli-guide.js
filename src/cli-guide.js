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
            message: 'Welcome to the interactive tutorial',
            nameOfPlarform: 'Apache Aurora',
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
                    $("#steptitle").html("<h4>Step "+v.step+"</h4>")
                    $("#stepscontent").append(
                        "<h4>"+v.content.title+"</h4>"
                    +   "<hr/>"
                    +   "<p>"+v.content.content.join("")+"</p>"
                    +   "<hr/>"
                    +   "<h4>Tips</h4>"
                    +   "<p>"+v.content.tips+"</p>"                    
                    );

                    $.each(v.content.commands,function(key,val){
                        $("#stepscontent").append(
                        "<code>"+val.command+"</code>" 
                        );
                    });
                }

            });

        });
    }

    $.fn.cli = function(handler, prompt, effect){
        
        if (!effect) effect = $.fn.text;

        return this.each(function(){

            var self = $("#terminal");

            function newline(){
                self.append(
                    '<p class="input">'
                +       '<span class="prompt">you@tutorial:~$</span>'
                +       '<span class="textinline" style="outline:none" contenteditable></span>'
                +   '</p>'
                );
                $('[contenteditable]', self)[0].focus();                
            }

            newline();

            self.on('keydown', '[contenteditable]', function(evt){
                if (evt.keyCode == 13){
                    $(this).removeAttr('contenteditable');
                    effect.call($('<p class=response>').appendTo(self),handler(this.textContent || this.innerText));
                    newline();
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
        +       '<hr/>'
        +       '<ul id="listofsteps">'
        +       '</ul>'
        +       '<hr/>'
        +       '<div id="stepscontent"></div>'
        +   '</div>'
        +   '<div id="terminal_block">'
        +       '<div id="terminal" class="heightTerminal"></div>'
        +   '</div>'
        +   '<div class="clear"></div>'
        );

        $(".heightTerminal").css("height",opts.heightTerminal + "px");

        listOfSteps(opts);
        showInfoOfEachStep(opts, 0);

        $(document).on('click','.btn-step',function(){
            showInfoOfEachStep(opts,$(this).data('step'));
        });

        $("#terminal").append('<div class="line">'+insertAt(opts.message, 27, opts.nameOfPlarform)+'</div>');
        $("#terminal").append('<br/>');

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
