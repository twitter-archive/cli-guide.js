// clean each steps
//Step.clean(opts.commandStepsFile);

//autocompleteCommands(opts.commandStepsFile);

// load commands steps from json
//loadStepToLocalStorage(opts.commandStepsFile);

// preload all files from json
//File.preLoad(opts.preloadfile);

//listOfSteps(opts);
//Step.list(opts.stepsFile);
//Step.showInfo(opts.stepsFile, opts.skipsteps, 1);

/*$(document).on('click','.btn-step',function(){
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
});*/

$(document).on('keydown', ".textinline", '[contenteditable]', function(event){

  if(event.keyCode == 13){

    var input = $(this).text().trim();

    $(this).removeAttr('contenteditable');

    console.log(id);

    $('<p id="'+id+'" class="response"></p>').appendTo("#"+id+".parent-textinline");

    id++;

    Cli.newline(input,id);

  }

});
