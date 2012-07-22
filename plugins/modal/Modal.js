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

    // Set 'Modal' source
    this.setContent(source);
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
    this.show();
  },
  events:['hide','show'],
  members: {
    _depth: 0,
    _modalBg:null,
    show : function() {
      if (!this._depth) {
        var _modalBg = JX.$N('div',{className : 'jx-modal-bg'});
        var _modal = JX.$N('div', {className: 'jx-modal'});
        //var _close = JX.$N('div',{className: 'jx-modal-close',},'X');

        //JX.Stratcom.addSigil(_close, 'modal-close');
        JX.Stratcom.addSigil(_modalBg, 'modal-bg');

        //_modal.appendChild(_close);
        document.body.appendChild(_modalBg);
        this._modalBg = _modalBg;


        JX.DOM.appendContent(_modal,this.getContent() || '');

        this.setMask(_modal);
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
      this.invoke('hide');
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
    isDomNode.style.display = '';
    var modal = new JX.Modal(isDomNode, config);
  }
  catch(e) {
    if (source.search(/https?:\/\//gi) === 0){ // Is it a remote URI ?
      var r = new JX.Request(source, function(response){
        var modal = new JX.Modal(response, config);
      });
      r.setMethod('GET');
      r.send();
    }
    else { // Assume its a String
      var modal = new JX.Modal(source, config);
    }
  }

  modal.listen('show',config.onShow);
  modal.listen('hide',config.onHide);
});