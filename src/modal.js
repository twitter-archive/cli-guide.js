// Modal and methods
var Modal = {
  showInfo: function(div,content){
    $("#"+div).html(
        '<div id="modal" class="modalDialog">'
      +   '<div>'
      +     '<a href="#close" title="Close" class="close">X</a>'
      +     content
      +   '</div>'
      + '</div>'
    );
  },
  showImg: function(img, size){
    var sizeOfModal = "";
    if(size === "g"){
      sizeOfModal = "modalImgGDialog";
    } else if(size === "b"){
      sizeOfModal = "modalImgBDialog";
    } else {
      sizeOfModal = "modalImgSDialog";
    }
    $("#contentimgmodal").html(
        '<div id="modal" class="modalDialog '+sizeOfModal+'">'
      +   '<div>'
      +     '<a href="#close" title="Close" class="close">X</a>'
      +     '<img class="imginmodal" src="'+img+'" />'
      +   '</div>'
      + '</div>'
    );
  },
  close: function() {
    if (location.hash == '#modal') {
      location.hash = '';
    }
  }
};

$(document).on('click','#modal',function(){
  Modal.close();
});

$(document).on('click','#modal div',function(event){
  event.stopPropagation();
});
