/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Validate Plugin
 *
 * @group Plugin
 */
JX.install('Validate', {
  construct: function(node, validationFn, config){
    if (__DEV__) {
      if (!node) {
        JX.$E(
          'new JX.Validate(<?>, ...): '+
          'A DOM \'node\' is required for Validate to operate' );
      }
      if (!validationFn) {
        JX.$E(
          'new JX.Validate(<>,<?> ...): '+
          'A \'validationFn\' callback is required for Validate to operate' );
      }
    }

    this.setElement(node);
    this.setValidationFn(validationFn);
    this.setTrigger(config.trigger || 'blur');
    JX.Stratcom.addData(node, { _objId: this.__id__});
    JX.Validate._store[this.__id__] = this;

    JX.DOM.listen(node, ['focus','blur','change'], 'form-field', JX.bind(this,function(e){
      var data = e.getNodeData('form-field');
      var target = e.getTarget();

      if (e.getType() === this.getTrigger()){
        this.validate();
      }
    }));
  },
  events: ['start','done'],
  members: {
    validate: function(){
      this.invoke('start');
      (this.getValidationFn())(this.getElement(), JX.bind(this, function(response){
        this.invoke('done', response);  // The response by the validation fn is proxied to 'done' callback
      }));
    }
  },
  statics: {
    trigger:['blur', 'click', 'change'],
    _store:{},
    find:function(objId){
      return JX.Validate._store[objId];
    },
  },
  properties: {
    element:null,
    validationFn:null,
    trigger:null
  }
});

/**
 * Form Plugin
 *
 * @group Plugin
 */
JX.install('Form', {
  construct: function(uri, validationObjs){
    this.setUri(uri);
    this.setValidationFns(validationObjs);
  },
  events:['start','done','fail','invalid','valid'], // TODO: invoke 'fail'
  members: {
    _cbk: function(response){
      this.invoke('done', response);
    },
    validate: function(){
      var validationObjs = this.getValidationFns();
      var isFormValid = true; // Assumption
      var validationsLeft = validationObjs.length;

      // In the case where there are no validtion fns.
      if (!validationsLeft && isFormValid){
        this.invoke('valid');
        return;
      }

      // Did the form validation fail?
      var formValidationfailed = false;

      for(var i=0, il = validationObjs.length; i < il; i++){
        var fn = validationObjs[i].getValidationFn();
        var node = validationObjs[i].getElement();

        //execute a validation fn
        fn(node, JX.bind(this, function(result){
          validationsLeft--;

          //dont invoke multiple 'invalid' events
          // but invoke 'invalid' event the moment any validation fails
          isFormValid = isFormValid && result;
          if (!isFormValid && !formValidationfailed){
            formValidationfailed = true;
            this.invoke('invalid');
            return;
          }


          // If no more validation fns are left to operate and form is still valid, post
          if (!validationsLeft && isFormValid){
            this.post();
          }
        }));
      }
    },
    submit: function(){
      this.invoke('start');
      this.validate();
    },
    post:function(){
      this.invoke('valid');
      var r = new JX.Request(this.getUri(), JX.bind(this,this._cbk));
      r.setData();
      r.send();
    }
  },
  properties: {
    uri:null,
    validationFns:null
  }
});

JX.behavior('form-field', function(config, statics) {
  try{
    var selector = document.querySelector(config.selector);
    delete config.selector;
    var validationFn = config.validationFn;
    delete config.validationFn;

    var obj = new JX.Validate(selector,validationFn, config);
    obj.listen('done', config.onDone);
  }
  catch(e){
    JX.$E('\'selector\' ' + config.selector + ' is not a valid DOM Node selector' + e);
  }
});

JX.behavior('form', function(config, statics) {
  JX.Stratcom.listen('submit','form',function(e){
    e.kill();

    var data = e.getNodeData('form');
    var target = e.getTarget();
    var action = target.getAttribute('action');

    var validationObjs = [];

    ['INPUT','TEXTAREA','SELECT'].forEach(function(formField){
      var fields = JX.DOM.scry(target,formField);
      for(var i=fields.length; i--;){
        var id = JX.Stratcom.getData(fields[i])._objId;
        var obj = id && JX.Validate.find(id);
        obj && validationObjs.push(obj);
      }
    });

    var f = new JX.Form(action, validationObjs);

    f.listen('done',data.onDone);
    f.listen('invalid', data.onValidationFail);
    f.submit();
  });
});