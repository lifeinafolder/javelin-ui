/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Button Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Memoize', {
  construct: function(){
    console.log('invoked');
    JX.Stratcom.addData(this.getElement(),{
      '_cacheId' : this.__id__
    });
    JX.Memoize._map[this.__id__] = this;
  },
  statics: {
    _map: {},
    find: function(cacheId) {
      return JX.Memoize._map[cacheId];
    }
  }
});
