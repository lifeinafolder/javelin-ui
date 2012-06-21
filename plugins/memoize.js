/**
 * @requires javelin-stratcom
 * @javelin
 */

/**
 * Memoize class
 */
JX.Memoize = (function(){
  var map = {};

  return {
    find : function(id) {
      return map[id];
    },
    add : function(obj){
      JX.Stratcom.addData(obj.getElement(),{
        '_cacheId' : obj.__id__
      });
      map[obj.__id__] = obj;
    },
    remove : function(id){
      delete map[id];
    }
  }
})();