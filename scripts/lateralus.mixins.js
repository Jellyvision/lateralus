define([

  'underscore'

], function (

  _

) {
  'use strict';

  /**
   * These method are mixed into `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}` and `{{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}}`.
   * @class Lateralus.mixins
   * @requires http://backbonejs.org/#Events
   */
  var mixins = {};

  /**
   * @param {Object} obj
   * @return {boolean}
   */
  function isLateralus (obj) {
    return obj.toString() === 'lateralus';
  }

  /**
   * Add a subcomponent to a `{{#crossLink "Lateralus"}}{{/crossLink}}` or
   * `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` instance.
   *
   *     var App = Lateralus.beget(function () {
   *       Lateralus.apply(this, arguments);
   *     });
   *
   *     var app = new App(document.getElementById('app'));
   *     var component = app.addComponent(Lateralus.Component);
   *     var subcomponent = component.addComponent(Lateralus.Component);
   * @method addComponent
   * @param {Lateralus.Component} Component A constructor, not an instance.
   * @param {Object} [viewOptions] The `options` object to be passed along to
   * the `Component` parameter's {{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}} instance.
   * @param {Object} [options] Gets passed to the new {{#crossLink
   * "Lateralus.Component"}}{{/crossLink}} instance.
   * @param {Object} [options.modelAttributes] Any attributes to pre-populate
   * the `{{#crossLink "Lateralus.Component/Model:property"}}{{/crossLink}}`
   * instance with, if there is one.
   * @param {Object} [options.modelOptions] Any parameters to pass to the
   * `{{#crossLink "Lateralus.Component/Model:property"}}{{/crossLink}}`
   * instance, if there is one.
   * @return {Lateralus.Component} The component that was added.
   */
  mixins.addComponent = function (Component, viewOptions, options) {
    options = options || {};

    if (typeof this.component !== 'undefined') {
      return this.component.addComponent.apply(this.component, arguments);
    }

    if (!this.components) {
      /**
       * The subcomponents belonging to this object.  Do not modify this
       * property directly, it is managed by Lateralus.
       * @property components
       * @type {Object(Lateralus.Component)}
       */
      this.components = {};

      /**
       * An internal counter registry of the subcomponents belonging to this
       * object.
       * @property componentCounters
       * @type {Object(number)}
       * @private
       */
      this.componentCounters = {};
    }

    // If thisIsLateralus is false, `this` is a Lateralus.Component instance.
    var thisIsLateralus = isLateralus(this);

    var lateralusReference = thisIsLateralus ? this : this.lateralus;
    var component = new Component(
      lateralusReference
      ,options
      ,viewOptions || {}
      ,thisIsLateralus ? null : this
    );

    if (thisIsLateralus && component.view) {
      this.$el.append(component.view.$el);
    }

    var componentType = component.toString();
    if (this.componentCounters.hasOwnProperty(componentType)) {
      this.componentCounters[componentType]++;
    } else {
      this.componentCounters[componentType] = 0;
    }

    var componentInstanceName =
        componentType + this.componentCounters[componentType];
    this.components[componentInstanceName] = component;

    return component;
  };

  /**
   * Components should never communicate directly with one another in order to
   * maintain a loosely-coupled architecture.  Instead, they should just
   * broadcast general messages with the [`Backbone.Events`
   * API](http://backbonejs.org/#Events).  `emit` facilitates this loose
   * coupling by firing an event that bubbles throughout the app, depending on
   * what calls it:
   *
   * * If this is called by `{{#crossLink "Lateralus"}}{{/crossLink}}`, this
   * just triggers an event on that `{{#crossLink "Lateralus"}}{{/crossLink}}`
   * instance.
   * * If this is called by a `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}`, this triggers an event on that
   * `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` as well as the
   * central `{{#crossLink "Lateralus"}}{{/crossLink}}` instance.
   * * If this is called by a `{{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}}`, this triggers an event on
   * that `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}`, the
   * `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` to which it belongs,
   * and the central `{{#crossLink "Lateralus"}}{{/crossLink}}` instance.
   *
   * This method has the same method signature as
   * [`Backbone.Events.trigger`](http://backbonejs.org/#Events-trigger).
   * @method emit
   * @param {string} eventName The name of the event.
   * @param {...any} [args] Any arguments to pass along to the listeners.
   */
  mixins.emit = function () {
    var args = _.toArray(arguments);
    this.trigger.apply(this, args);

    if (isLateralus(this)) {
      return;
    }

    if (this.component) {
      this.component.trigger.apply(this.component, args);
    }

    this.lateralus.trigger.apply(this.lateralus, args);
  };

  /**
   * Listen for an event that is triggered on the central {{#crossLink
   * "Lateralus"}}{{/crossLink}} instance and bind a function handler.
   * @method listenFor
   * @param {string} event The name of the event to listen for.
   * @param {Function} callback The function handler to bind.
   */
  mixins.listenFor = function (event, callback) {
    var thisIsLateralus = isLateralus(this);
    if (thisIsLateralus) {
      this.on(event, callback);
    } else {
      this.listenTo(this.lateralus, event, callback);
    }
  };

  return mixins;
});
