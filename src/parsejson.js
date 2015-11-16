var ParseJson = {
  loadSteps: function(file){
    localStorage.setItem("stepsFile",false);
    if(file !== ""){
      localStorage.setItem("stepsFile",true);
    }
    $.getJSON(file,function(data){
      $.each(data,function(key,val){
        if(val.laststep){
          // get last step
          localStorage.setItem("laststep",val.step);
        }
        localStorage.setItem(val.content.step,
          JSON.stringify(
          {
             step: val.content.step,
             title: val.content.title,
             body: val.content.body,
             commands: val.content.commands
          })
        );
      });
    });
  },
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
