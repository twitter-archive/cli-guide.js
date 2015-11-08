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
