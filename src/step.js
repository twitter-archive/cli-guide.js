var Step = {
  list: function(stepsFile){
    if(stepsFile !== ""){
      $.getJSON(stepsFile,function(data){
        $.each(data,function(k,v){
          Step.listTemplate(v.step);
        });
      });
    } else {
      Step.listTemplate(1);
    }
  },
  showInfo: function(stepsFile, skipsteps, step){
    // select current step
    if(stepsFile !== ""){
      localStorage.setItem('actualstep',step);
      var skipStepArray = JSON.parse("[" + skipsteps + "]");

      $(".btn-step").removeClass("active");
      $("#stepscontent").html('');
      $.getJSON(stepsFile,function(data){
        $.each(data,function(k,v){
          if(v.step == step){
            Step.showInfoTemplate(step,v.step,skipStepArray,v.content.title,v.content.body,
                                  v.content.tips,v.content.commands,v.content.moreinfo);
          }
        });
      });

      // appears a check when a Step finished
      var actualStep = localStorage.getItem('actualstep');
      var $finish = $("#finish[data-step="+actualStep+"]");
      var finishedStep = JSON.parse(localStorage.getItem(step));

      if(step == Step.getLast() && finishedStep) {
        $("#"+step).removeClass("not-active");
        $finish.addClass("ok-b");
        $finish.html("Finish ✓");
      } else if(finishedStep){
        $("#"+step).removeClass("not-active");
        $finish.addClass("ok-b");
        $finish.html("Next ✓");
      } else {
        $finish.html("");
      }

    } else {
      var command = [{"command":"git clone https://github.com/twitter/cli-guide.js.git"}];
      Step.showInfoTemplate(1,1,"","CLI-Guide.js","A javascript library for creating interactive "+
      "command line tutorials that run in your web browser. ",
                            "tips here!",command,"");
    }

  },
  getLast: function(stepsFile) { // return an int
    var step;
    $.ajaxSetup({
      async: false
    });
    $.getJSON(stepsFile,function(data){
      $.each(data,function(k,v){
        if(v.laststep){
          step = v.step;
        }
      });
    });
    return step;
  },
  clean: function(opts){
    $.getJSON(opts,function(data){
      $.each(data,function(ks,steps){
        localStorage.removeItem(steps.step);
        localStorage.setItem(steps.step,false);
      });
    });
  },
  /*skip: function(opts,step){
    $.getJSON(opts.stepsFile,function(data){
      $.each(data,function(k,v){
        if(v.step == step){
          if(v.content.commands.length > 0){
            $.each(v.content.commands,function(key,val){
              var object  = JSON.parse(localStorage.getItem("step-"+val.command));
              localStorage.setItem("step-"+val.command,
              JSON.stringify(
                {step:object.step,
                 command:object.command,
                 type:object.type,
                 depend: object.depend,
                 done:true,
                 animation: object.animation,
                 lastCommand: object.lastCommand
                }));
            });
          }
        }
      });
    });
    localStorage.setItem(step,true);
    var nextstep = step+1;
    var $finish = $("#finish[data-step="+step+"]");
    $finish.addClass("ok-b");
    $finish.html("Next ✓");
    // enable the next step
    $("#"+nextstep).removeClass("not-active");
    // switch to next step
    Step.showInfo(opts.stepsFile, opts.skipsteps, nextstep);
  },*/
  listTemplate: function(step){
    var not_active = ( step == 1 ) ? "": "not-active";
    $("#listofsteps").append(
      '<li class="step">'
    +   '<a id="'+step+'" class="btn-step '+not_active+'" href="#" data-step="'+step+'">'
    +     step
    +   '</a>'
    + '</li>'
    );
  },
  showInfoTemplate: function(ustep,step,skipStepArray,title,content,tips,commands,moreinfo) {
    $("#stepscontent").html('');
    content = Array.isArray(content) ? content.join("") : content;
    $("#"+step+".btn-step").addClass("active");
    $("#steptitle").html("<h3>"+step+" - "+title+"</h3>");
    var nextstep = ( (ustep + 1) > Step.getLast() ) ? Step.getLast() : ustep + 1;
    var skip = '';
    for (var i = 0; i < skipStepArray.length; i++) {
      if(ustep == skipStepArray[i]){
        skip = '<a href="#" id="skip" class="skip-b" data-step="'+ustep+'">skip</a>';
      }
    }
    $("#stepscontent").append(
      '<h3><a href="#" id="finish" data-nextstep="'+nextstep+'" data-step="'+ustep+'"></a>' +
      skip +
      '</h3>' +
      '<p>'+content+'</p>'
    );
    if(moreinfo !== undefined){
      moreinfo = Array.isArray(moreinfo) ? moreinfo.join("") : moreinfo;
      Modal.showInfo("moreinfo",moreinfo);
    }
    if(tips !== ""){
      /*
      + '<h3>Tips</h3>'
      + '<p>'+tip+'</p>'
      '<hr/ class="style">'
      */
      var tip =  Array.isArray(tips) ? tips.join("") : tips;
      $('#stepscontent').append(
        '<ul id="listofcommands"></ul>'
      );
    }
    if(commands.length > 0 && Array.isArray(commands)){
      $.each(commands,function(key,val){
        $("#listofcommands").append(
          '<li> <span class="promptlabel">$ </span>'+val.command+'</li>'
        );
      });
    }
    // for image modal
    $('#stepscontent').append('<div id="contentimgmodal"><div>');
  }
};
