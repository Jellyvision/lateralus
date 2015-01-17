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

  var Base = Backbone.Collection;
  var baseProto = Base.prototype;
  var fn = {};

  /**
   * @method toString
   * @protected
   * @return {string} The name of this Collection.  This is used internally by
   * Lateralus.
   */
  fn.toString = function () {
    return this.lateralus.toString() + '-collection';
  };

  /**
   * The constructor for this class should not be called by application code,
   * should only be called by `{{#crossLink
   * "Lateralus.Component.initCollection:method"}}{{/crossLink}}`.
   * @private
   * @param {Array.<Lateralus.Component.Model>} models
   * @param {Object} options
   * @param {Lateralus} options.lateralus
   * @param {Lateralus.Component} options.component
   * @constructor
   */
  fn.constructor = function (models, options) {
    this.lateralus = options.lateralus;
    this.component = options.component;
    Base.apply(this, arguments);
  };

  /**
   * @override
   */
  fn.set = function (models, options) {
    var augmentedOptions = _.extend(options || {}, {
      lateralus: this.lateralus
      ,component: this.component
    });

    return baseProto.set.call(this, models, augmentedOptions);
  };

  _.extend(fn, mixins);

  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Collection`](http://backbonejs.org/#Collection).
   * @class Lateralus.Collection
   * @extends {Backbone.Collection}
   * @uses Lateralus.mixins
   */
  var LateralusCollection = Base.extend(fn);

  return LateralusCollection;
});
