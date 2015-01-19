define([

  'underscore'
  ,'backbone'

  ,'./lateralus.mixins'

], function (

  _
  ,Backbone

  ,mixins

) {
  'use strict';

  var fn = {};

  /**
   * @method toString
   * @protected
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  fn.toString = function () {
    return this.lateralus.toString() + '-model';
  };

  // jshint maxlen:100
  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Model`](http://backbonejs.org/#Model).  The constructor for
   * this class should not be called by application code, it is used by the
   * `{{#crossLink "Lateralus"}}{{/crossLink}}` constructor.
   * @private
   * @class Lateralus.Model
   * @param {Lateralus} lateralus
   * @extends {Backbone.Model}
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus) {
    this.lateralus = lateralus;
    this.delegateLateralusEvents();
    Backbone.Model.call(this);
  };

  _.extend(fn, mixins);

  var LateralusModel = Backbone.Model.extend(fn);

  return LateralusModel;
});
