'use strict';
import _ from 'lodash-compat';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

const Base = Backbone.Model;
const baseProto = Base.prototype;

const fn = {
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
    const dispose = options.dispose;
    options.dispose = false;

    baseProto.destroy.call(this, options);

    if (dispose) {
      if (this.isNew()) {
        // Backbone 1.3.0 changed Backbone.Model#destroy to be _.defer-red, so
        // this .dispose needs to also be deferred to prevent a null reference
        // error in the second thread.
        // https://github.com/jashkenas/backbone/commit/d7943fe4c06e11c99b84e7dacd6e16431d8e321b
        _.defer(() => this.dispose());
      } else {
        this.dispose();
      }
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
const ComponentModel = Base.extend(fn);

/**
 * @method Lateralus.Component.Model#toString
 * @return {string} The name of this Model.  This is used internally by
 * Lateralus.
 */
ComponentModel.prototype.toString = function () {
  return this.component.toString() + '-model';
};

export default ComponentModel;
