var CommandValidation = {
  command: function(commands,text){
    var message = "";
    $.ajaxSetup({
      async: false
    });
    $.getJSON(commands,function(data){
      $.each(data,function(k,v){
        if((new RegExp(v.command)).test(text)){
          var regExp = new RegExp(v.regexp);
          if(!regExp.test(text)){
            message = v.regexp_message;
          } else {
            message = "";
          }
        }
      });
    });
    return message;
  }
};
