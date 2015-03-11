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

  // jshint maxlen:100
  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Router`](http://backbonejs.org/#Router).  The constructor for
   * this class should not be called by application code.  Instead, use
   * `{{#crossLink "Lateralus/initRouter"}}{{/crossLink}}`.
   * @private
   * @class Lateralus.Router
   * @param {Lateralus} lateralus
   * @extends {Backbone.Router}
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus) {
    this.lateralus = lateralus;
    this.delegateLateralusEvents();
    Backbone.Router.call(this);
  };


  _.extend(fn, mixins);

  var LateralusRouter = Backbone.Router.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this Router.  This is used internally by
   * Lateralus.
   */
  LateralusRouter.prototype.toString = function () {
    return this.lateralus.toString() + '-router';
  };

  return LateralusRouter;
});
