'use strict';
import $ from 'jquery';
import _ from 'lodash-compat';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';
import Component from './lateralus.component';
import LateralusModel from './lateralus.model';
import LateralusRouter from './lateralus.router';

// UNDERSCORE MIXINS
_.mixin({

  /**
   * Remove all properties from an Object.
   * @param {Object} obj
   * @private
   */
  lateralusEmptyObject: function (obj) {
    for (const propName in obj) {
      if (obj.hasOwnProperty(propName)) {
        delete obj[propName];
      }
    }
  },

  /**
   * Perform general-purpose memory cleanup for a Lateralus/Backbone Object.
   * @param {Object} obj
   * @param {Function=} customDisposeLogic
   */
  lateralusDispose: function (obj, customDisposeLogic) {
    obj.trigger('beforeDispose');

    if (customDisposeLogic) {
      customDisposeLogic();
    }

    obj.stopListening();
    _(obj).lateralusEmptyObject();
  }
}, { chain: false });

/**
 * You should not need to call the Lateralus constructor directly, use `{@link
 * Lateralus.beget}` instead.  To create a new Lateralus app:
 *
 *     var App = Lateralus.beget(function () {
 *       // Don't forget to call the Lateralus constructor!
 *       Lateralus.apply(this, arguments);
 *     });
 *
 *     var app = new App(document.getElementById('app'));
 * @param {Element} el The DOM element that contains the entire Lateralus app.
 * @class Lateralus
 * @mixes Lateralus.mixins
 * @constructs Lateralus
 */
function Lateralus (el) {
  /**
   * The DOM node that contains this `{@link Lateralus}` instance.
   * @member Lateralus#el
   * @type {HTMLElement}
   */
  this.el = el;

  /**
   * The jQuery Object that contains `{@link Lateralus#el}`.
   * @member Lateralus#$el
   * @type {jQuery}
   */
  this.$el = $(el);

  const ModelConstructor = this.config.Model || LateralusModel;
  // TODO: Initialize this.model with this.initModel.
  /**
   * Maintains the state of the central `{@link Lateralus}` instance.
   * @member Lateralus#model
   * @type {Lateralus.Model}
   */
  this.model = new ModelConstructor(this);

  /**
   * An optional map of template render data to be passed to the
   * `Mustache.render` call for all Views belonging to this Lateralus app.
   * @member Lateralus#globalRenderData
   * @type {Object<String>}
   */
  this.globalRenderData = {};

  /**
   * An optional map of template partials to be passed to the
   * `Mustache.render` call for all Views belonging to this Lateralus app.
   * @member Lateralus#globalPartials
   * @type {Object<String>}
   */
  this.globalPartials = {};

  this.delegateLateralusEvents();
}

const fn = Lateralus.prototype;

_.extend(fn, Backbone.Events);

/**
 * Set up the prototype chain between two objects.
 * @static
 * @method Lateralus.inherit
 * @param {Function} child
 * @param {Function} parent
 * @return {Function} A reference to the passed-in `child` parameter.
 */
Lateralus.inherit = function inherit (child, parent) {
  function Proxy () {}
  Proxy.prototype = parent.prototype;
  child.prototype = new Proxy();
  return child;
};

/**
 * Create a `{@link Lateralus}` application instance.
 *
 *     var App = Lateralus.beget(function () {
 *       Lateralus.apply(this, arguments);
 *     });
 * @static
 * @method Lateralus.beget
 * @param {Function} child
 * @param {Object} [config]
 * @param {LateralusModel} [config.Model] A `{@link Lateralus.Model}` subclass
 * constructor to use for `{@link Lateralus.model}` instead of a standard
 * `{@link Lateralus.Model}`.
 * @return {Function} The created `{@link Lateralus}`
 * subclass.
 */
Lateralus.beget = function (child, config) {
  const lateralusConfig = config || {};

  child.displayName = child.name || 'begetConstructor';
  const begottenConstructor = Lateralus.inherit(child, Lateralus);
  begottenConstructor.prototype.config = _.clone(lateralusConfig);

  return begottenConstructor;
};

_.extend(fn, mixins);

const { bind } = Function.prototype;
const logger = window.console || {};

_.each([

  /**
   * Cross-browser friendly wrapper for `console.log`.
   * @method Lateralus#log
   * @param {...any} Any parameters to pass along to `console.log`.
   */
  'log',

  /**
   * Cross-browser friendly wrapper for `console.warn`.
   * @method Lateralus#warn
   * @param {...any} Any parameters to pass along to `console.warn`.
   */
  'warn',

  /**
   * Cross-browser friendly wrapper for `console.error`.
   * @method Lateralus#error
   * @param {...any} Any parameters to pass along to `console.error`.
   */
  'error'

], function (consoleMethodName) {
  fn[consoleMethodName] = bind.call(logger[consoleMethodName], logger);
});

/**
 * @param {Lateralus.Router} Router A constructor, not an instance.
 * @param {Object} [options] To be passed to the [Router
 * `initialize`](http://backbonejs.org/#Router-constructor) method.
 * @return {Lateralus.Router} An instance of the provided Router
 * constructor.
 * @method Lateralus#initRouter
 */
fn.initRouter = function (Router, options) {
  return new Router(this, options);
};

/**
 * Relay `{@link Lateralus.mixins.provide}`d handlers to another `{@link
 * Lateralus}` instance.  This is the `{@link Lateralus.mixins.provide}` analog
 * to `{@link Lateralus.mixins.amplify}`.
 * @method Lateralus#shareWith
 * @param {Lateralus} receiver The `{@link Lateralus}` instance to share
 * `{@link Lateralus.mixins.provide}`d handlers with.
 * @param {string} providerName The name of the `{@link
 * Lateralus.mixins.provide}`er.
 */
fn.shareWith = function (receiver, providerName) {
  this.amplify(receiver, mixins.PROVIDE_PREFIX + providerName);
};

/**
 * Remove this `{@link Lateralus}` app from memory.
 * @method Lateralus#dispose
 */
fn.dispose = function () {
  _(this).lateralusDispose(_.bind(function () {
    if (this.components) {
      _.invoke(this.components, 'dispose');
    }
  }, this));
};
fn.spiralOut = fn.dispose;

/**
 * Do not override this method, it is used internally.
 * @method Lateralus#toString
 * @return {string} This is `"lateralus"`.
 * @final
 */
fn.toString = function () {
  return 'lateralus';
};

Lateralus.Component = Component;
Lateralus.Model = LateralusModel;
Lateralus.Router = LateralusRouter;

// Using the old-school CommonJS export format here for better
// backwards-compatibility:
// https://github.com/webpack/webpack/issues/3929
module.exports = Lateralus;
