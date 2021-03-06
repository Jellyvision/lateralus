import _ from 'lodash-compat';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';

const fn = {};

// jshint maxlen:100
/**
 * @private
 * @param {Lateralus} lateralus
 * @mixes Lateralus.mixins
 * @constructs Lateralus.Router
 */
fn.constructor = function (lateralus) {
  /**
   * A reference to the central {@link Lateralus} instance.
   * @member Lateralus.Router#lateralus
   * @type {Lateralus}
   * @final
   */
  this.lateralus = lateralus;
  this.delegateLateralusEvents();
  Backbone.Router.apply(this, arguments);
};


_.extend(fn, mixins);

/**
 * This class builds on the ideas and APIs of
 * [`Backbone.Router`](http://backbonejs.org/#Router).  The constructor for
 * this class should not be called by application code.  Instead, use `{@link
 * Lateralus#initRouter}`.
 * @extends {Backbone.Router}
 * @class Lateralus.Router
 */
const LateralusRouter = Backbone.Router.extend(fn);

/**
 * @method toString
 * @method Lateralus.Router#toString
 * @return {string} The name of this Router.  This is used internally by
 * Lateralus.
 */
LateralusRouter.prototype.toString = function () {
  return this.lateralus.toString() + '-router';
};

export default LateralusRouter;
