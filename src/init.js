Plugin.prototype.init = function () {
    // Place initialization logic here
    // We already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
    var options = this.options;

    $(this.element).html(
      '<div class="container-fluid">'

    +   '<div class="row">'

    +     '<div id="steps_section" class="col-xs-4">'
    +       '<div class="row steps-numbers-section">'
    +         '<div class="col-xs-12">'
    +           '<ul id="listofsteps">'
    +           '</ul>'
    +         '</div>'
    +       '</div>'
    +       '<div id="steps_section_content">'
    +         '<div id="steptitle"></div>'
    +         '<div id="stepscontent"></div>'
    +         '<div id="moreinfo"></div>'
    +         '<br/><br/>'
    +       '</div>'
    +     '</div>'

    +     '<div id="terminal_section" class="col-xs-8">'

    +       '<div class="row">'
    +         '<div id="terminal-parent" class="col-xs-12">'
    +           '<div id="terminal-header" class="col-xs-12">'
    +             '<ul id="terminal-header-buttons"><li id="hbtn-close"></li><li id="hbtn-min"></li><li id="hbtn-max"></li></ul>'
    +           '</div>'
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


    $(".heightTerminal").css("height",options.heightTerminal + "px");

    $("#editor").hide();

    $("#terminal").append('<div class="line">'+Util.insertAt(options.welcomeMessage, 27, options.nameOfTheProject)+'</div>');
    $("#terminal").append('<br/>');

    var heightContentParent = options.heightTerminal - $("#editor-commands").height()
                                  - $("#editor-header").height() - 100;

    var heightContent = heightContentParent;

    $("#editor-content-parent").css("height",heightContentParent + "px");
    $("#editor-content").css("height",heightContent + "px");

    // messages of commands
    $("#command-x").hide();
    $("#command-save-x").hide();

    // init cli
    localStorage.setItem("idinput",0);
    localStorage.setItem("actualdir","");

    //start cli
    Cli.newline("",0);

    // clean each steps
    Step.clean(options.commandStepsFile);

    autocompleteCommands(options.commandStepsFile);

    // load commands steps from json
    loadStepToLocalStorage(options.commandStepsFile);

    // preload all files from json
    File.preLoad(options.preloadfile);

    //listOfSteps(options);
    Step.list(options.stepsFile);
    Step.showInfo(options.stepsFile, options.skipsteps, 1);
    Step.getLast(options.stepsFile);

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
