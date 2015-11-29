$(document).on('click','.btn-step',function(){
  var step = $(this).data('step');
  Step.showInfo(step);
}).on('mouseup','.btn-step',function(){
  var step = $(this).data('step');
  $("#"+step+".btn-step").css({"background-color": "#8F8F8F", "color": "white", "border": "1px solid #525252"});
  $(this).css({"background-color": "#8F8F8F", "color": "white", "border": "1px solid #525252"});
});

$(document).on('click','#skip',function(){
  Step.skip($(this).data('step'));
});

$(document).on('click','#btn_next_finish',function(){
  var nextstep = $(this).data('nextstep');
  Step.showInfo(nextstep);
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

$(document).on('keydown', ".textinline", '[contenteditable]', function(event){

  if(event.keyCode == 13){

    var opts = defaults;

    console.log(localStorage.getItem("idinput"));
    var input = $(this).text().trim();

    $(this).removeAttr('contenteditable');

    //var id = localStorage.getItem("idinput")

    $('<p id="'+id+'" class="response"></p>').appendTo("#"+id+".parent-textinline");

    $("#"+id+".response").html(
        '<pre><code id="'+id+'_lang_terminal" class="language-bash">'
        +'</code></pre>'
    );

    if(localStorage.getItem("commandStepsFile")) {
      if(localStorage.getItem(input) !== null){
        Prism.highlightElement($('#'+id+'_lang_terminal')[0]);
        $('#'+id+'_lang_terminal').html(Cli.result(input,id));
      } else {
        Cli.newline(input,id);
      }
    } else {
      if(input.replace(/\s\s+/g,' ') !== "git clone " + input.split(" ").pop()) {
        $("#"+id+".response").html(''); //remove space
        Cli.newline(input,id);
      }
    }
    // print the result of commands
    /*if(opts.commandStepsFile !== "" && opts.commandValidation !== "") {
      if(CommandValidation.command(opts.commandValidation,input) !== "" ) {
        $('#'+id+'_lang_terminal').html(CommandValidation.command(opts.commandValidation,input));
        Cli.newline(input,id);
      } else {
        $('#'+id+'_lang_terminal').html(commands(opts.commandStepsFile,input,id));
      }
    } else if(defaults.commandStepsFile !== "") {
      $('#'+id+'_lang_terminal').html(commands(opts.commandStepsFile,input,id));
    } else {
      // git clone return a new line after finish
      // only run commands different from git clone
      if(input.replace(/\s\s+/g,' ') !== "git clone " + input.split(" ").pop()) {
        $("#"+id+".response").html(''); //remove space
        Cli.newline(input,id);
      }
    }*/

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
      Cli.newline(input,id);
    }

    if(input.toLowerCase() == 'clear'){
      Cli.clear(input,id);
      id = 0;
    } else {
      id++;
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
