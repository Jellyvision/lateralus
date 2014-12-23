define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var {{componentClassName}}ComponentModel = Lateralus.Component.Model.extend({
    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    initialize: function () {
      this._super('initialize', arguments, {{componentClassName}}ComponentModel);
    }
  });

  return {{componentClassName}}ComponentModel;
});
