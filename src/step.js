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
  showInfo: function(step){ //stepsFile, skipsteps,
    if(localStorage.getItem(step) !== null){
      var object  = JSON.parse(localStorage.getItem(step));
      Step.showInfoTemplate(object.step,object.title,object.body,object.commands,object.moreinfo);
    }
    // select current step
    /*if(stepsFile !== ""){
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
    }*/

  },
  getLast: function() { // return an int
    return localStorage.getItem("laststep");
  },
  clean: function(opts){
    $.getJSON(opts,function(data){
      $.each(data,function(ks,steps){
        localStorage.removeItem(steps.step);
        localStorage.setItem(steps.step,false);
      });
    });
  },
  skip: function(step){
    // skip a step
    var current_step = JSON.parse(localStorage.getItem(step));
    localStorage.setItem(step,
      JSON.stringify(
      {
         step: current_step.step,
         title: current_step.title,
         body: current_step.body,
         moreinfo: (current_step.moreinfo === undefined) ? "" : current_step.moreinfo,
         commands: current_step.commands,
         done: true
      })
    );
    // switch to the next step
    var nextstep = step+1;
    Step.showInfo(nextstep);
    // remove not-active class
    $("#"+nextstep).removeClass("not-active");
    $("#"+step+".btn-step").css({"background-color": "#8F8F8F", "color": "white", "border": "1px solid #525252"});
  },
  listTemplate: function(step){
    var not_active = ( step == 1 ) ? "": "not-active";
    console.log(step)
    $("#listofsteps").append(
      '<li class="step">'
    +   '<a id="'+step+'" class="btn-step '+not_active+'" href="#" data-step="'+step+'">'
    +     step
    +   '</a>'
    + '</li>'
    );
  },
  showInfoTemplate: function(step,title,body,commands,moreinfo) {

    var nextstep = ( (parseInt(step) + 1) > Step.getLast() ) ? Step.getLast() : parseInt(step) + 1;

    // get skip steps
    var arraySkipSteps = []
    var skip_section = "";
    if(localStorage.getItem("skipsteps") != ""){
      arraySkipSteps = localStorage.getItem("skipsteps").split(',');
      if(arraySkipSteps[step-1]!== undefined){
        skip_section = '<a href="#" id="skip" class="skip-b" data-step="'+step+'">Skip</a>';
      }
    }

    $("#stepscontent").html('');

    var val_next_finish = (step === Step.getLast()) ? "Finish ✓" : "Next ✓";

    $("#steptitle").html(
      '<h3>'+title+''+skip_section+'<a href="#" id="btn_next_finish" class="next_finish" data-nextstep="'+nextstep+'" data-step="'+step+'">'+val_next_finish+'</a></h3>'
    );

    var content = Array.isArray(body) ? body.join("") : body;
    $("#stepscontent").append('<p>'+content+'</p>');

    if(commands.length > 0 && Array.isArray(commands)){
      $('#stepscontent').append(
        '<ul id="listofcommands"></ul>'
      );
      $.each(commands,function(key,val){
        $("#listofcommands").append(
          '<li> <span class="promptlabel">$ </span><span class="command">'+val.command+'</span></li>'
        );
      });
    }

    if(moreinfo !== ""){
      moreinfo = Array.isArray(moreinfo) ? moreinfo.join("") : moreinfo;
      Modal.showInfo("moreinfo",moreinfo);
    }

    // Modal Container
    $('#stepscontent').append('<div id="contentimgmodal"><div>');

    $(".next_finish").hide();

    /*content = Array.isArray(content) ? content.join("") : content;
    $("#"+step+".btn-step").addClass("active");
    $("#steptitle").html("<h3>"+step+" - "+title+"</h3>");
    var nextstep = ( (ustep + 1) > Step.getLast() ) ? Step.getLast() : ustep + 1;
    var skip = '';
    /*for (var i = 0; i < skipStepArray.length; i++) {
      if(ustep == skipStepArray[i]){
        skip = '<a href="#" id="skip" class="skip-b" data-step="'+ustep+'">skip</a>';
      }
    }*/
    /*$("#stepscontent").append(
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
      /*var tip =  Array.isArray(tips) ? tips.join("") : tips;
      $('#stepscontent').append(
        '<ul id="listofcommands"></ul>'
      );
    }
    if(commands.length > 0 && Array.isArray(commands)){
      $.each(commands,function(key,val){
        $("#listofcommands").append(
          '<li> <span class="promptlabel">$ </span><span class="command">'+val.command+'</span></li>'
        );
      });
    }
    // for image modal
    $('#stepscontent').append('<div id="contentimgmodal"><div>');*/
  }
};

$(document).on("click",".command",function(){
  $("#"+id+".textinline").text($(this).text());
  Util.placeCaretAtEnd($("#"+id+".textinline").get(0));
});
