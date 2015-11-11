function commands(opts,text,id){
  var input = text.trim();
  var result = "";
  var actualStep = localStorage.getItem('actualstep');
  var $finish = $("#finish[data-step="+actualStep+"]");

  if(input == "") {
    Cli.newline("");
  } else if(localStorage.getItem("step-"+input.replace(/\s\s+/g,' ')) !== null) {

    var object  = JSON.parse(localStorage.getItem("step-"+input.replace(/\s\s+/g,' ')));

    if(object.lastCommand || JSON.parse(localStorage.getItem(actualStep))){
      if(actualStep == Step.getLast()){
        $finish.addClass("ok-b");
        $finish.html("Finish ✓");
        localStorage.setItem(actualStep,true);
      } else {
        if(actualStep === object.step){
          $finish.addClass("ok-b");
          $finish.html("Next ✓");
          localStorage.setItem(actualStep,true);
        }
      }
    } else {
      $finish.html("");
    }

    // verify the command if it is for the correct step
    if(object.step === "general"){
      if(text.indexOf("cd ") > -1){
        Cli.newline(input.replace(/\s\s+/g,' '),id);
      } else if(!object.animation){
        Cli.newline(input.replace(/\s\s+/g,' '),id);
      }
      return result = restCommand(opts,text,id);
    } else {
      // If is it has dependencies?
      if(Array.isArray(object.depend)){
        //newline("");
        var missingCommands = [];
        for (var i = 0; i < object.depend.length; i++) {
          var missingCommand  = JSON.parse(localStorage.getItem(object.depend[i]));
          if(!missingCommand.done){
            missingCommands.push(missingCommand.command)
          }
        }
        if(missingCommands.length > 1){
          Cli.newline("");
          return result = "You have to run these commands before: "+missingCommands.join(' | ');
        } else if(missingCommands.length == 1){
          Cli.newline("");
          return result = "You have to run this command before: "+missingCommands.join(' | ');
        } else {
          // update
          localStorage.setItem(input.replace(/\s\s+/g,' '),
            JSON.stringify(
              {step:object.step,
               command:object.command,
               type: object.type,
               depend: object.depend,
               done:true,
               animation: object.animation,
               lastCommand: object.lastCommand
              }));
          if(object.type === "native" || object.type === "static"){
            Cli.newline(input.replace(/\s\s+/g,' '),id);
          }
          return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
        }
      } else if(object.depend !== ""){
        // check which command or commands depends
        var dependCommand  = JSON.parse(localStorage.getItem(object.depend));
        if(!dependCommand.done){
          Cli.newline("");
          return result = "You have to run this command before: "+dependCommand.command;
        } else {
          // update
          localStorage.setItem(input.replace(/\s\s+/g,' '),
            JSON.stringify(
              {step:object.step,
               command:object.command,
               type: object.type,
               depend: object.depend,
               done:true,
               animation: object.animation,
               lastCommand: object.lastCommand
              }));
          if(object.type === "native" || object.type === "static"){
            Cli.newline(input.replace(/\s\s+/g,' '),id);
          }
          return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
        }
      } else {
        // update
        localStorage.setItem(input.replace(/\s\s+/g,' '),
          JSON.stringify(
            {step:object.step,
             command:object.command,
             type: object.type,
             depend: object.depend,
             done:true,
             animation: object.animation,
             lastCommand: object.lastCommand
            }));
        if(object.type === "native" || object.type === "static"){
          Cli.newline(input.replace(/\s\s+/g,' '),id);
        }
        return result = restCommand(opts,input.replace(/\s\s+/g,' '),id);
      }
    }
  } else {
    $("#"+id+".response").html(''); // remove pre and code
    if(opts.commandStepsFile === "") {
      Cli.newline(input,id);
    }
  }

}

function restCommand(opts,text,id){

  var result = "";

  $.ajaxSetup({
    async: false
  });

  $.getJSON(opts,function(data){
    $.each(data,function(key,steps){
      $.each(steps,function(k,commands){
        for(var i = 0; i < commands.length; i++) {
          if(commands[i].command !== undefined){
            // when more than one command have the same result
            if(Array.isArray(commands[i].command)){
              for(var c = 0; c < commands[i].command.length; c++){
                if(text.trim() == commands[i].command[c]) {
                  if(commands[i].type !== undefined){
                    if(commands[i].type === "animation"){
                      var arrayMultiResult = [];
                      for (var l = 0; l < commands[i].result.length; l++) {
                        arrayMultiResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                      }
                      result = arrayMultiResult;
                    } else {
                      result = commands[i].result;
                    }
                  }
                }
              }
            }
            if(commands[i].command === text.trim()) {
              if(commands[i].result !== undefined){
                if(commands[i].type !== undefined){
                  if(commands[i].type === "animation"){
                    var arrayResult = [];
                    for(var l = 0; l < commands[i].result.length; l++) {
                      arrayResult.push('<div id='+id+' class="cline">'+commands[i].result[l]+'</div>');
                    }
                    result = arrayResult;
                  } else {
                    result = commands[i].result;
                  }
                }
              }
            }
          }
        }
      });
    });
  });

  //Prism.highlightElement($('#lang-terminal')[0]);
  return result;

}

function loadStepToLocalStorage(jsonCommands){
  $.getJSON(jsonCommands,function(data){
    $.each(data,function(ks,steps){
      $.each(steps,function(kc,commands){
        for (var i = 0; i < commands.length; i++) {
          // when more than one command have the same result
          if(Array.isArray(commands[i].command)){
            for(var c = 0; c < commands[i].command.length; c++){
              localStorage.removeItem("step-"+commands[i].command[c]);
              localStorage.setItem("step-"+commands[i].command[c],
                JSON.stringify(
                  {step:steps.step,
                   command:commands[i].command[c],
                   type:commands[i].type,
                   depend: commands[i].depend,
                   done:false,
                   animation: (commands[i].animation === undefined) ? false : commands[i].animation,
                   lastCommand: (commands[i].lastCommand === undefined) ? false : commands[i].lastCommand
                  }));
            }
          } else {
            localStorage.removeItem("step-"+commands[i].command);
            localStorage.setItem("step-"+commands[i].command,
              JSON.stringify(
                {step:steps.step,
                 command:commands[i].command,
                 type:commands[i].type,
                 depend: commands[i].depend,
                 done:false,
                 animation: (commands[i].animation === undefined) ? false : commands[i].animation,
                 lastCommand: (commands[i].lastCommand === undefined) ? false : commands[i].lastCommand
                }));
          }
        }
      });
    });
  });
}

//  autocomplete (tab) commands, issue #42
function autocompleteCommands(commands){
  var listCommands = [];
  $.ajaxSetup({
    async: false
  });
  $.getJSON(commands,function(data){
    $.each(data,function(key,steps){
      $.each(steps,function(k,commands){
        for (var i = 0; i < commands.length; i++) {
          if(Array.isArray(commands[i].command)){
            for(var c = 0; c < commands[i].command.length; c++){
              if(commands[i].command !== undefined){
                listCommands.push(commands[i].command[c]);
              }
            }
          } else {
            if(commands[i].command !== undefined){
              listCommands.push(commands[i].command);
            }
          }
        }
      });
    });
  });
  localStorage.setItem("commands",listCommands);
}
