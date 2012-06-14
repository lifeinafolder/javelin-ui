/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Carousel Plugin aka Twitter Bootstrap
 *
 * @group Plugin
 */
JX.install('Carousel', {
  construct: function(config){
    config = config || {};
    if (__DEV__) {
      if (!config.selector) {
        JX.$E(
          'new JX.Carousel(<?>, ...): '+
          '\'selector\' is required to create a Carousel');
      }
    }

    this.setAutoMode(!!config.interval);
    this.setInterval(config.interval || 5000);
    this.setPause(config.pause);
    this.setElement(document.querySelector(config.selector));
    this._start();
  },
  members: {
    _current:null,
    _slides:null,
    _timer:null,
    _start:function(){
      //Hook up 'prev' & 'next' UI controls
      var controls = JX.DOM.scry(this.getElement(),'div','carousel-control');
      var prevControl, nextControl;
      for(var i=controls.length;i--;){
        if(JX.Stratcom.hasSigil(controls[i],'prev')){
          prevControl = controls[i];
          JX.DOM.alterClass(prevControl,'jx-carousel-control jx-carousel-direction-left',true);
        }
        else if (JX.Stratcom.hasSigil(controls[i],'next')){
          nextControl = controls[i];
          JX.DOM.alterClass(nextControl,'jx-carousel-control jx-carousel-direction-right',true);
        }
        else{
          JX.$E('\'carousel-control\' sigil can only be one of ' + JX.Carousel.directions.toString());
        }
      }

      JX.DOM.listen(prevControl,'click', null, JX.bind(this,this._prev));
      JX.DOM.listen(nextControl,'click', null, JX.bind(this,this._next));

      if (JX.Carousel.pause.indexOf(this.getPause()) > -1) {
        JX.DOM.listen(this.getElement(),['mouseover','mouseout'], null, JX.bind(this,function(e){
          // Pause on 'mouseenter'
          if (e.getType() === 'mouseover'){
            clearInterval(this._timer);
          }

          // Resume on 'mouseleave'
          if (e.getType() === 'mouseout'){
            this._auto();
          }
        }));
      }

      //Set the slides
      var slides = JX.DOM.scry(this.getElement(),'div','item');
      this._slides = slides;
      JX.DOM.hide.apply(null,this._slides);
      var j = slides.length;
      while(j--){
        JX.DOM.alterClass(slides[j],'jx-carousel-item',true);
        if(JX.Stratcom.hasSigil(slides[j],'active')){
          JX.DOM.alterClass(slides[j],'jx-carousel-active-item',true);
          JX.DOM.show(slides[j]);
          this._current = j;
        }
      }

      //if automatic cycling is 'on'
      this.getAutoMode() && this._auto();
    },
    _next: function(){
      JX.DOM.hide(this._slides[this._current]);
      this._current = (this._current === this._slides.length-1) ? 0 : this._current+1;
      JX.DOM.show(this._slides[this._current]);
    },
    _prev: function(){
      JX.DOM.hide(this._slides[this._current]);
      this._current = (this._current === 0) ? this._slides.length-1 : this._current-1;
      JX.DOM.show(this._slides[this._current]);
    },
    _auto:function(){
      this._timer = setInterval(JX.bind(this,function(){
        this._next();
      }),this.getInterval());
    }
  },
  statics:{
    directions:['prev','next'],
    pause:['hover']
  },
  properties: {
    autoMode:null,
    interval:null,
    element:null,
    pause:null
  }
});