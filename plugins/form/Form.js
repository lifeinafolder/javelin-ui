/**
 * @requires javelin-install javelin-dom javelin-fx
 * @javelin
 */

/**
 * Form Plugin
 *
 * @group Plugin
 */
JX.install('Form', {
  construct: function(uri, validationFns){
    this.setUri(uri);
    this.setValidationFns(validationFns);
  },
  events:['start','done','fail','invalid','valid'], // TODO: invoke 'fail'
  members: {
    _cbk: function(response){
      this.invoke('done',{a:5});
    },
    validate: function(){
      validationFns = this.getValidationFns();
      var isFormValid = true; // Assumption
      var validationsLeft = validationFns.length;

      // In the case where there are no validtion fns.
      if (!validationsLeft-- && isFormValid){
        this.invoke('valid');
        return;
      }

      // Try validating the form now that we have validation fns
      var isFormValidated = false;

      for(var i=0, il = validationFns.length; i < il; i++){
        var fn = validationFns[i];

        //execute a validation fn
        fn(function(result){
          //dont invoke multiple 'invalid' events
          // but invoke 'invalid' event the moment any validation fails
          do {
            isFormValid = isFormValid && result;
            if (!isFormValid){
              this.invoke('invalid');
              isFormValidated = true;
            }
          } while (!isFormValidated);

          if (!validationsLeft-- && isFormValid){
            this.invoke('valid');
          }
        });

      }
    },
    submit: function(){
      this.invoke('start');
      this.validate();
      this.listen('valid', JX.bind(this,function(){
        var r = new JX.Request(this.getUri(), JX.bind(this,this._cbk));
        r.setData();
        r.send();
      }));
    }
  },
  properties: {
    uri:null,
    validationFns:null
  }
});

JX.behavior('form', function(config, statics) {
  JX.Stratcom.listen('submit','form',function(e){
    e.kill();

    var data = e.getNodeData('form');
    var target = e.getTarget();
    var action = target.getAttribute('action');
    var validationFns = data.validationFns;

    var f = new JX.Form(action, validationFns);

    f.listen('done',data.onDone);
    f.listen('invalid', data.onValidationFail);
    f.submit();
  });
});