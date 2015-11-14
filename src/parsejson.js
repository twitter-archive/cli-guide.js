var ParseJson = {
  loadCommands: function(file){
    localStorage.setItem("commandStepsFile",false);
    if(file !== ""){
      localStorage.setItem("commandStepsFile",true);
    }
    $.getJSON(file,function(data){
      $.each(data,function(key,val){
        $.each(val.commands,function(key2,val2){
            localStorage.setItem(val2.command,
              JSON.stringify(
              {
                 command: val2.command,
                 type: val2.type,
                 animation: val2.animation,
                 result: val2.result,
                 depend: val2.depend,
                 done: false,
                 lastCommand: val2.lastCommand
              })
            );
        });
      });
    });
  }
}
