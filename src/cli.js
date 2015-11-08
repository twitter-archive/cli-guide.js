var Cli = {
  newline: function(command,id){
    var terminal = $("#terminal");
    //var idinput = parseInt(localStorage.getItem("idinput"));

    dir = "";
    var idinput = id;
    terminal.append(
       '<div id="'+idinput+'" class="parent-textinline">'
    +     '<div class="prompt">you@tutorial:~'+dir+'$ </div>'
    +     '<div id="'+idinput+'" spellcheck="false" class="textinline" style="outline-color:black" contenteditable="true">'
    +       '&nbsp;'
    +     '</div>'
    +  '</div>'
    );

    //var count = parseInt(localStorage.getItem("idinput"));
    //var total = count + 1;
    //localStorage.setItem("idinput",total)

    $('[contenteditable]', terminal)[0].focus();

  }
}
