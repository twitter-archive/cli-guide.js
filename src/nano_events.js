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
