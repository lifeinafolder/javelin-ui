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
  construct: function(uri, selector, config){
    config = config || {};
    if (__DEV__) {
      if (!uri) {
        JX.$E(
          'new JX.Button(<?>, ...): '+
          'A \'uri\' is required for Button to operate' );
      }
      if (!selector) {
        JX.$E(
          'new JX.Button(<>,<?> ...): '+
          'A \'selector\' is required for Button to operate' );
      }
    }

    // Set 'required' fields
    this.setUri(uri);
    this.setSelector(selector);

    // Set 'config' options
    this.setData(config.data);
    this.setMethod(config.method || 'POST');

    // Attach listener for 'click'
    JX.Stratcom.listen('click', selector, JX.bind(this,function(e){
      var node = e.getNode(this.getSelector());
      this.setElement(node);
      var initialState = node.textContent;
      this.setLoading(config.loadingState || 'loading...');
      this.setCompleteState(config.onCompleteState || initialState);

      this._start();
    }));
  },
  members: {
    _cbk:function(){
      JX.DOM.setContent(this.getElement(),this.getCompleteState());
    },
    _start:function(){
      JX.DOM.setContent(this.getElement(), this.getLoading());
      var r = new JX.Request(this.getUri(),JX.bind(this,this._cbk));
      r.setMethod(this.getMethod());
      r.setData(this.getData());
      r.send();
    }
  },
  properties: {
    uri:null,
    loading:null,
    selector:null,
    element:null,
    completeState:null,
    data:null,
    method:null
  }
});
