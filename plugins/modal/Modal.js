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
  construct: function(config){
    this.setAttr(config.attr || {});
    //if 'selector' is provided, we give that precedence over 'content'
    this.setContent(document.querySelector(config.selector) || config.content);

    JX.Stratcom.listen('click', 'modal-close', JX.bind(this,function(e) {
      this.hide();
    }));

    JX.Stratcom.listen('click', 'modal-bg', JX.bind(this,function(e) {
      this.hide();
    }));
  },
  members: {
    _depth: 0,
    _modalBg:null,
    show : function() {
      if (!this._depth) {
        var attr = this.getAttr();
        JX.copy(attr,{className: 'jx-modal'});
        
        var _modalBg = JX.$N('div',{className : 'jx-modal-bg'});
        var _modal = JX.$N('div', attr);
        var _close = JX.$N('div',{className: 'jx-modal-close',},'X');

        JX.Stratcom.addSigil(_close, 'modal-close');
        JX.Stratcom.addSigil(_modalBg, 'modal-bg');

        _modal.appendChild(_close);
        document.body.appendChild(_modalBg);
        this._modalBg = _modalBg;


        JX.DOM.appendContent(_modal,this.getContent() || '');

        this.setMask(_modal);
        document.body.appendChild(this.getMask());

        JX.FX.fade(this.getMask(),1,500);
      }
      ++this._depth;
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
    attr:null,
    content:null,
    selector:null
  }
});
