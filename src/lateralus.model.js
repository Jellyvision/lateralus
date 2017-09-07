import _ from 'lodash-compat';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

const fn = {};

// jshint maxlen:100
/**
 * @private
 * @param {Lateralus} lateralus
 * @param {Object} [attributes]
 * @param {Object} [options]
 * @mixes Lateralus.mixins
 * @constructs Lateralus.Model
 */
fn.constructor = function (lateralus, attributes, options) {
  /**
   * A reference to the central {@link Lateralus} instance.
   * @member Lateralus.Model#lateralus
   * @type {Lateralus}
   * @final
   */
  this.lateralus = lateralus;
  this.delegateLateralusEvents();
  this.on('change', _.bind(this.onChange, this));
  Backbone.Model.call(this, attributes, options);
};

/**
 * For every key that is changed on this model, a corresponding `change:` event
 * is `{@link Lateralus.mixins#emit}`ed.  For example, `set`ting the `"foo"`
 * attribute will `{@link Lateralus.mixins#emit}` `"change:foo"` and provide
 * the changed value.
 * @method Lateralus.Model#onChange
 */
fn.onChange = function () {
  const changed = this.changedAttributes();

  _.each(_.keys(changed), (changedKey) => {
    this.emit('change:' + changedKey, changed[changedKey]);

    // Delete this property from the internal "changed" object before
    // Backbone typically would to prevent "stacking" changed properties
    // across onChange calls, thereby causing redundant handler calls.
    delete this.changed[changedKey];
  });

};

_.extend(fn, mixins);

/**
 * This class builds on the ideas and APIs of
 * [`Backbone.Model`](http://backbonejs.org/#Model).  The constructor for
 * this class should not be called by application code, it is used by the
 * `{@link Lateralus}` constructor.
 * @extends Backbone.Model
 * @class Lateralus.Model
 */
const LateralusModel = Backbone.Model.extend(fn);

/**
 * @method Lateralus.Model#toString
 * @return {string} The name of this Model.  This is used internally by
 * Lateralus.
 */
LateralusModel.prototype.toString = function () {
  return this.lateralus.toString() + '-model';
};

export default LateralusModel;
