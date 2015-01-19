define([

  'underscore'
  ,'backbone'

  ,'./lateralus.model'

], function (

  _
  ,Backbone

  ,LateralusModel

) {
  'use strict';

  var ComponentModel = LateralusModel.extend({
    /**
     * @method toString
     * @protected
     * @return {string} The name of this Model.  This is used internally by
     * Lateralus.
     */
    toString: function () {
      return this.component.toString() + '-model';
    }

    // jshint maxlen:100
    /**
     * The constructor for this class should not be called by application code,
     * it is used by the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
     * constructor.
     * @private
     * @param {Object} [attributes] Gets passed to
     * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
     * @param {Object} options Gets passed to
     * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
     * @param {Lateralus} options.lateralus
     * @param {Lateralus.Component} options.component
     * @class Lateralus.Component.Model
     * @extends Lateralus.Model
     * @constructor
     */
    ,constructor: function (attributes, options) {
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
  });

  return ComponentModel;
});
