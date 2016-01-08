var Util = {
  insertAt: function(src, index, str){
    return src.substr(0, index) + str + " " + src.substr(index);
  },
  removeItemFromArray: function(array, item){
    for(var i in array){
      if(array[i]==item){
        array.splice(i,1);
        break;
      }
    }
  },
  placeCaretAtEnd: function(el){
    // source:
    // http://stackoverflow.com/questions/28270302/jquery-how-to-focus-on-last-character-of-div
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
  }
};
