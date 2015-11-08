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
  }
};
