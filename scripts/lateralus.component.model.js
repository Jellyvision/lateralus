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

  var fn = {
    /**
     * The constructor for this class should not be called by application code,
     * it is used by the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
     * constructor.
     * @private
     * @param {Object} [attributes] Gets passed to
     * [Backbone.Model#initialize](http://backbonejs.org/#Model-constructor).
     * @param {Object} options Gets passed to
     * [Backbone.Model#initialize](http://backbonejs.org/#Model-constructor).
     * @param {Lateralus} options.lateralus
     * @param {Lateralus.Component} options.component
     * @class Lateralus.Component.Model
     * @extends Backbone.Model
     * @uses Lateralus.mixins
     * @constructor
     */
    constructor: function (attributes, options) {
      this.lateralus = options.lateralus;

      /**
       * A reference to the `{{#crossLink
       * "Lateralus.Component"}}{{/crossLink}}` to which this `{{#crossLink
       * "Lateralus.Component.Model"}}{{/crossLink}}` belongs.
       * @property component
       * @type {Lateralus.Component}
       * @final
       */
      this.component = options.component;

      this.delegateLateralusEvents();
      Backbone.Model.call(this, attributes, options);
    }

    /**
     * Remove this `{{#crossLink "Lateralus.Component.Model"}}{{/crossLink}}`
     * from memory.  Also remove this `{{#crossLink
     * "Lateralus.Component.Model"}}{{/crossLink}}` from the `{{#crossLink
     * "Lateralus.Component.Collection"}}{{/crossLink}}` to which it belongs,
     * if any.
     * @method dispose
     */
    ,dispose: function () {
      _(this).lateralusDispose(_.bind(function () {
        this.destroy();
      }, this));
    }
  };

  _.extend(fn, mixins);

  var ComponentModel = Backbone.Model.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  ComponentModel.prototype.toString = function () {
    return this.component.toString() + '-model';
  };

  return ComponentModel;
});
