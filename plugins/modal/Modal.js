/**
 * @requires javelin-install javelin-vector javelin-dom
 * @provides javelin-mask
 * @javelin
 */

/**
 * Show a transparent "mask" over the page; used by Workflow to draw visual
 * attention to modal dialogs.
 *
 * @group control
 */
JX.install('Modal', {
  construct: function(attr,message){
    this.setAttr(attr || {});
    this.setMsg(message);
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
        JX.DOM.appendContent(_modal,this.getMsg() || '');
        this.setMask(_modal);

        document.body.appendChild(this.getMask());

        JX.FX.fade(this.getMask(),1,500,JX.bind(this,function(){
          console.log("done fading-in");
        }));
      }
      ++this._depth;
    },
    hide : function() {
      --this._depth;
      // if (!this._depth) {
      //   JX.DOM.remove(this.getMask());
      //   JX.DOM.remove(this._modalBg);
      //   this.setMask(null);
      // }
      JX.FX.fade(this.getMask(),0,null,JX.bind(this,function(){
        console.log("done animating");
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
    msg:null
  }
});
