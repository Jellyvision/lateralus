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
   * [`Backbone.Model`](http://backbonejs.org/#Model).  The constructor for
   * this class should not be called by application code, it is used by the
   * `{{#crossLink "Lateralus"}}{{/crossLink}}` constructor.
   * @private
   * @class Lateralus.Model
   * @param {Lateralus} lateralus
   * @param {Object} [attributes]
   * @param {Object} [options]
   * @extends Backbone.Model
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus, attributes, options) {
    this.lateralus = lateralus;
    this.delegateLateralusEvents();
    this.on('change', _.bind(this.onChange, this));
    Backbone.Model.call(this, attributes, options);
  };

  /**
   * For every key that is changed on this model, a corresponding `change:`
   * event is `{{#crossLink "Lateralus.mixins/emit:method"}}{{/crossLink}}`ed.
   * For example, `set`ting the `"foo"` attribute will `{{#crossLink
   * "Lateralus.mixins/emit:method"}}{{/crossLink}}` `change:foo` and provide
   * the changed value.
   * @method onChange
   */
  fn.onChange = function () {
    var changed = this.changedAttributes();

    _.each(_.keys(changed), function (changedKey) {
      this.emit('change:' + changedKey, changed[changedKey]);

      // Delete this property from the internal "changed" object before
      // Backbone typically would to prevent "stacking" changed properties
      // across onChange calls, thereby causing redundant handler calls.
      delete this.changed[changedKey];
    }, this);

  };

  _.extend(fn, mixins);

  var LateralusModel = Backbone.Model.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  LateralusModel.prototype.toString = function () {
    return this.lateralus.toString() + '-model';
  };

  return LateralusModel;
});
