import _ from 'lodash-compat';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

const Base = Backbone.Collection;
const baseProto = Base.prototype;
const fn = {};

/**
 * The constructor for this class should not be called by application code,
 * should only be called by `{@link Lateralus.Component#initCollection}`.
 * @private
 * @param {Array.<Lateralus.Component.Model>} models
 * @param {Object} options
 * @param {Lateralus} options.lateralus
 * @param {Lateralus.Component} options.component
 * @constructs Lateralus.Component.Collection
 */
fn.constructor = function (models, options) {
  /**
   * A reference to the central {@link Lateralus} instance.
   * @member Lateralus.Component.Collection#lateralus
   * @type {Lateralus}
   * @final
   */
  this.lateralus = options.lateralus;
  this.component = options.component;
  this.delegateLateralusEvents();
  Base.apply(this, arguments);
};

/**
 * @override
 */
fn.set = function (models, options) {
  const augmentedOptions = _.extend(options || {}, {
    lateralus: this.lateralus,
    component: this.component
  });

  return baseProto.set.call(this, models, augmentedOptions);
};

/**
 * Remove a `{@link Lateralus.Component.Model}` or array of `{@link
 * Lateralus.Component.Model}`s from this collection.
 * @param {Array.<Lateralus.Component.Model>|Lateralus.Component.Model} models
 * @param {Object} [options] This object is also passed to
 * [Backbone.Collection.#remove](http://backbonejs.org/#Collection-remove).
 * @param {boolean} [options.dispose] If true, call `{@link
 * Lateralus.Component.Model#dispose}` after removing `models`.
 * @method Lateralus.Component.Collection#remove
 * @override
 */
fn.remove = function (models, options) {
  options = options || {};
  baseProto.remove.apply(this, arguments);

  if (options.dispose) {
    models = _.isArray(models) ? models : [models];
    _.invoke(models, 'dispose');
  }
};

_.extend(fn, mixins);

/**
 * This class builds on the ideas and APIs of
 * [`Backbone.Collection`](http://backbonejs.org/#Collection).
 * @class Lateralus.Component.Collection
 * @extends {Backbone.Collection}
 * @mixes Lateralus.mixins
 */
const LateralusCollection = Base.extend(fn);

/**
 * @method Lateralus.Component.Collection#toString
 * @return {string} The name of this Collection.  This is used internally by
 * Lateralus.
 */
LateralusCollection.prototype.toString = function () {
  return this.lateralus.toString() + '-collection';
};

export default LateralusCollection;
