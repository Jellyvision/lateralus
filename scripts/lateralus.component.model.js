import { _ } from 'underscore';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

var Base = Backbone.Model;
var baseProto = Base.prototype;

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
   * Lateralus-compatible override for
   * [Backbone.Model#destroy](http://backbonejs.org/#Model-destroy).
   * @param {Object} [options] This object is also passed to
   * [Backbone.Model.#destroy](http://backbonejs.org/#Model-destroy).
   * @param {boolean} [options.dispose] If true, call `{{#crossLink
   * "Lateralus.Component.Model/dispose:method"}}{{/crossLink}}` after
   * `destroy` operations are complete.
   * @method destroy
   * @override
   */
  ,destroy: function (options) {
    options = options || {};
    var dispose = options.dispose;
    options.dispose = false;

    baseProto.destroy.apply(this, arguments);

    if (dispose) {
      this.dispose();
    }
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
      if (this.collection) {
        this.collection.remove(this);
      }
    }, this));
  }
};

_.extend(fn, mixins);

var ComponentModel = Base.extend(fn);

/**
 * @method toString
 * @return {string} The name of this Model.  This is used internally by
 * Lateralus.
 */
ComponentModel.prototype.toString = function () {
  return this.component.toString() + '-model';
};

export default ComponentModel;
