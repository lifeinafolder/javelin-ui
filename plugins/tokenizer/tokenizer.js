JX.behavior('tokenizer', function(config) {
  var source = new JX.TypeaheadPreloadedSource(config.preloadedURI);
  var typeahead = new JX.Typeahead(JX.$(config.preloadedHardpoint));

  typeahead.setDatasource(source);
  // typeahead.listen('choose', function(target) {
  //   JX.$U(target.href).go();
  // });
  typeahead.setPlaceholder('Type an animal name...');
  typeahead.start();

  var tokenizer = new JX.Tokenizer(JX.$(config.preloadedHardpoint));
  tokenizer.setTypeahead(typeahead);
  tokenizer.start();

  // var ondemandsource = new JX.TypeaheadOnDemandSource(config.ondemandURI);
  // var ondemandtypeahead = new JX.Typeahead(JX.$(config.ondemandHardpoint));

  // ondemandtypeahead.setDatasource(ondemandsource);
  // ondemandtypeahead.listen('choose', function(target) {
  //   JX.$U(target.href).go();
  // });
  // ondemandtypeahead.setPlaceholder('Type an animal name...');
  // ondemandtypeahead.start();

});
