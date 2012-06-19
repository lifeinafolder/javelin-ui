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
    _cbk:function(){
      this.invoke('done');
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

JX.behavior('button', function(config, statics) {
  var map = {};
  JX.Stratcom.listen('click', 'button', JX.bind(this,function(e){
    var data = e.getNodeData('button');
    if(map[data.id]){
      //console.log('cached');
      map[data.id].start();
    }
    else{
      var uri = data.uri;
      delete data['uri'];
      var node = e.getTarget();

      var b = new JX.Button(uri,node,data);

      data.onStart && b.listen('start', data.onStart);
      data.onDone && b.listen('done', data.onDone);

      map[data.id] = b;

      b.start();
    }
  }));
});