/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Button Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Button', {
  construct: function(uri, node, config){
    config = config || {};
    if (__DEV__) {
      if (!uri) {
        JX.$E(
          'new JX.Button(<?>, ...): '+
          'A \'uri\' is required for Button to operate' );
      }
      if (!node) {
        JX.$E(
          'new JX.Button(<>,<?> ...): '+
          'A DOM \'node\' is required for Button to operate' );
      }
    }

    // Set 'required' fields
    this.setUri(uri);
    this.setElement(node);

    // Set 'config' options
    this.setData(config.data);
    this.setMethod(config.method || 'POST');
  },
  events : ['start', 'done'],
  members: {
    _cbk:function(response){
      this.invoke('done', response);
    },
    start:function(){
      this.invoke('start');
      var r = new JX.Request(this.getUri(),JX.bind(this,this._cbk));
      r.setMethod(this.getMethod());
      r.setData(this.getData());
      r.send();
    }
  },
  properties: {
    uri:null,
    element:null,
    data:null,
    method:null
  }
});

JX.behavior('button', function() {
  var map = {};
  JX.Stratcom.listen('click', 'button', JX.bind(this,function(e){
    var data = e.getNodeData('button');
    if (map[data._cacheId]) {
      console.log('cached');
      map[data._cacheId].start();
    }
    else {
      console.log('not cached');
      var uri = data.uri;
      delete data['uri'];
      var node = e.getTarget();

      var b = new JX.Button(uri,node,data);

      //Cache it
      JX.Stratcom.addData(node,{
        '_cacheId' : b.__id__
      });
      map[b.__id__] = b;

      data.onStart && b.listen('start', data.onStart);
      data.onDone && b.listen('done', data.onDone);

      b.start();
    }
  }));
});