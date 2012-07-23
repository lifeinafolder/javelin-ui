/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Modal Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Modal', {
  construct: function(source, config){
    config = config || {};
    if (__DEV__) {
      if (!source) {
        JX.$E(
          'new JX.Modal(<?>, ...): '+
          '\'Source\' is required for Modal to operate' );
      }
    }

    // JX.Stratcom.listen('click', 'modal-close', JX.bind(this,function(e) {
    //   this.hide();
    // }));

    // If lock == true, then dont hide it on click on background
    if(!config.lock){
      JX.Stratcom.listen('click', 'modal-bg', JX.bind(this,function(e) {
        this.hide();
        JX.Stratcom.removeCurrentListener();
      }));

      JX.Keyboard.listen(null, JX.bind(this,function(e){
        if (JX.Keyboard.is(e, JX.Keyboard.keys.ESC)){
          this.hide();
          JX.Stratcom.removeCurrentListener();
        }
      }));
    }

    //Show the 'Modal'
    this.init(source);
  },
  events:['hide','show'],
  members: {
    _depth: 0,
    _modalBg:null,
    init: function(source){
      var _modalBg = JX.$N('div',{className : 'jx-modal-bg'});
      var _modal = JX.$N('div', {className: 'jx-modal'});
      //var _close = JX.$N('div',{className: 'jx-modal-close',},'X');

      //JX.Stratcom.addSigil(_close, 'modal-close');
      JX.Stratcom.addSigil(_modalBg, 'modal-bg');

      //_modal.appendChild(_close);
      this._modalBg = _modalBg;

      // Clone user markup
      try{
        var content = source.cloneNode(true);
      }
      catch(e){
        content = source; // If the user has given a string instead of DOM Node.
      }

      this.setContent(content);

      JX.DOM.appendContent(_modal, content || '');

      this.setMask(_modal);
    },
    show : function() {
      if (!this._depth) {
        document.body.appendChild(this._modalBg);
        document.body.appendChild(this.getMask());

        JX.FX.fade(this.getMask(),1,500);
      }
      ++this._depth;
      this.invoke('show');
    },
    hide : function() {
      --this._depth;
      JX.FX.fade(this.getMask(),0,null,JX.bind(this,function(){
        if (!this._depth) {
          JX.DOM.remove(this.getMask());
          JX.DOM.remove(this._modalBg);
          this.setMask(null);
        }
      }));
    }
  },
  properties: {
    mask:null,
    content:null
  }
});


JX.behavior('show-modal', function(config, statics) {
  var source = config.source;
  delete config.source;

  try { // Is it a DOM node?
    var isDomNode = document.querySelector(source);
    var modal = new JX.Modal(isDomNode, config);
    modal.listen('show',config.onShow);
    modal.listen('hide',config.onHide);
    modal.show();
  }
  catch(e) {
    if (source.search(/https?:\/\//gi) === 0){ // Is it a remote URI ?
      var r = new JX.Request(source, function(response){
        var modal = new JX.Modal(response, config);
        modal.listen('show',config.onShow);
        modal.listen('hide',config.onHide);
        modal.show();
      });
      r.setMethod('GET');
      r.send();
    }
    else { // Assume its a String
      var modal = new JX.Modal(source, config);
      modal.listen('show',config.onShow);
      modal.listen('hide',config.onHide);
      modal.show();
    }
  }
});