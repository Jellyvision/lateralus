import { _ } from 'underscore';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

var Base = Backbone.Model;
var baseProto = Base.prototype;

var fn = {
  /**
   * The constructor for this class should not be called by application code,
   * it is used by the `{@link Lateralus.Component}`
   * constructor.
   * @private
   * @param {Object} [attributes] Gets passed to
   * [Backbone.Model#initialize](http://backbonejs.org/#Model-constructor).
   * @param {Object} options Gets passed to
   * [Backbone.Model#initialize](http://backbonejs.org/#Model-constructor).
   * @param {Lateralus} options.lateralus
   * @param {Lateralus.Component} options.component
   * @mixes Lateralus.mixins
   * @constructs Lateralus.Component.Model
   */
  constructor: function (attributes, options) {
    this.lateralus = options.lateralus;

    /**
     * A reference to the `{@link Lateralus.Component}` to which this `{@link
     * Lateralus.Component.Model}` belongs.
     * @property component
     * @type {Lateralus.Component}
     * @final
     */
    this.component = options.component;

    this.delegateLateralusEvents();
    Backbone.Model.call(this, attributes, options);
  },

  /**
   * Lateralus-compatible override for
   * [Backbone.Model#destroy](http://backbonejs.org/#Model-destroy).
   * @param {Object} [options] This object is also passed to
   * [Backbone.Model.#destroy](http://backbonejs.org/#Model-destroy).
   * @param {boolean} [options.dispose] If true, call `{@link
   * Lateralus.Component.Model/dispose:method}` after `destroy` operations are
   * complete.
   * @method Lateralus.Component.Model#destroy
   * @override
   */
  destroy: function (options) {
    options = options || {};
    var dispose = options.dispose;
    options.dispose = false;

    baseProto.destroy.apply(this, arguments);

    if (dispose) {
      this.dispose();
    }
  },

  /**
   * Remove this `{@link Lateralus.Component.Model}`
   * from memory.  Also remove this `{@link Lateralus.Component.Model}` from
   * the `{@link Lateralus.Component.Collection}` to which it belongs, if any.
   * @method Lateralus.Component.Model#dispose
   */
  dispose: function () {
    _(this).lateralusDispose(_.bind(function () {
      if (this.collection) {
        this.collection.remove(this);
      }
    }, this));
  }
};

_.extend(fn, mixins);

/**
 * This class builds on the ideas and APIs of
 * [`Backbone.Model`](http://backbonejs.org/#Model).
 * @class Lateralus.Component.Model
 * @extends {Backbone.Model}
 */
var ComponentModel = Base.extend(fn);

/**
 * @method Lateralus.Component.Model#toString
 * @return {string} The name of this Model.  This is used internally by
 * Lateralus.
 */
ComponentModel.prototype.toString = function () {
  return this.component.toString() + '-model';
};

export default ComponentModel;
