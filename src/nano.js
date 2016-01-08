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
