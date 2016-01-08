var ParseJson = {
  loadSteps: function(file){
    localStorage.setItem("stepsFile",false);
    if(file !== ""){
      localStorage.setItem("stepsFile",true);
    }
    $.getJSON(file,function(data){
      $.each(data,function(key,val){
        if(val.laststep){
          // get the last step
          localStorage.setItem("laststep",val.step);
        }
        localStorage.setItem(val.content.step,
          JSON.stringify(
          {
             step: val.content.step,
             title: val.content.title,
             body: val.content.body,
             moreinfo: (val.content.moreinfo === undefined) ? "" : val.content.moreinfo,
             commands: val.content.commands,
             done: false
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
        localStorage.setItem(val.command,
          JSON.stringify(
          {
             command: val.command,
             step: val.step,
             type: val.type,
             result: val.result
          })
        );
      });
    });
  }
}
