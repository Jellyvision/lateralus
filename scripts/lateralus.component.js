define([

  'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.component.view'
  ,'./lateralus.component.model'
  ,'./lateralus.component.collection'

], function (

  _
  ,Backbone
  ,mixins
  ,ComponentView
  ,ComponentModel
  ,ComponentCollection

) {
  'use strict';

  /**
   * The constructor for this method should not be called directly.  Instead,
   * use the `{{#crossLink "Lateralus.mixins/addComponent"}}{{/crossLink}}`
   * mixin method:
   *
   *     var App = Lateralus.beget(function () {
   *       Lateralus.apply(this, arguments);
   *     });
   *
   *     var app = new App(document.getElementById('app'));
   *     var component = app.addComponent(Lateralus.Component);
   *
   *     console.log(component instanceof Lateralus.Component); // true
   * @class Lateralus.Component
   * @param {Lateralus} lateralus
   * @param {Object} options Values to attach to this `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}` instance.  This object also get
   * passed to the `{{#crossLink
   * "Lateralus.Component/initialize:property"}}{{/crossLink}}` method, if one
   * is defined.
   * @param {Object} [options.modelAttributes] Any attributes to pre-populate
   * the `{{#crossLink "Lateralus.Component/Model:property"}}{{/crossLink}}`
   * instance with, if there is one.
   * @param {Object} [options.modelOptions] Any parameters to pass to the
   * `{{#crossLink "Lateralus.Component/Model:property"}}{{/crossLink}}`
   * instance, if there is one.
   * @param {Object} viewOptions The `options` Object to pass to the
   * `{{#crossLink "Lateralus.Component/View:property"}}{{/crossLink}}`
   * constructor.
   * @param {Lateralus.Component} [opt_parentComponent] The parent component of
   * this component, if any.
   * @uses http://backbonejs.org/#Events
   * @uses Lateralus.mixins
   * @protected
   * @constructor
   */
  function Component (lateralus, options, viewOptions, opt_parentComponent) {

    /**
     * A reference to the central `{{#crossLink "Lateralus"}}{{/crossLink}}`
     * instance.
     * @property lateralus
     * @type {Lateralus}
     * @final
     */
    this.lateralus = lateralus;

    /**
     * If a `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` has `mixins`
     * defined on its `prototype` before it is instantiated, the objects
     * within `mixins` will be merged into this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` at instantiation-time with
     * `{{#crossLink "Lateralus.Component/mixin"}}{{/crossLink}}`.
     * @property mixins
     * @type {Object|Array(Object)|undefined}
     * @default undefined
     */
    if (this.mixins) {
      _.each(this.mixins, _.bind(this.mixin, this));
    }

    if (opt_parentComponent) {
      /**
       * If this is a subcomponent of another `{{#crossLink
       * "Lateralus.Component"}}{{/crossLink}}`, this property is a reference
       * to the parent `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`.
       * @property parentComponent
       * @type {Lateralus.Component|undefined}
       * @default undefined
       */
      this.parentComponent = opt_parentComponent;
    }

    /**
     * The `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}`
     * constructor to use, if any.  If this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` is intended to render to the DOM,
     * `View` should be defined on the `prototype` before instantiating:
     *
     *     var ExtendedComponent = Lateralus.Component.extend({
     *       name: 'extended'
     *       ,View: Lateralus.Component.View
     *       ,template: '<div></div>'
     *     });
     * @property View
     * @type {Lateralus.Component.View|undefined}
     * @default undefined
     */
    if (this.View) {
      var augmentedViewOptions = viewOptions;

      // A model instance provided to addComponent takes precendence over the
      // prototype property.
      if (this.Model && !viewOptions.model) {

        options.modelOptions = _.extend(options.modelOptions || {}, {
          lateralus: lateralus
          ,component: this
        });

        this.model = new this.Model(
          options.modelAttributes
          ,options.modelOptions
        );

        augmentedViewOptions.model = this.model;
      }

      /**
       * If `{{#crossLink "Lateralus.Component/View:property"}}{{/crossLink}}`
       * is defined, this is an instance of that constructor.
       * @property view
       * @type {Lateralus.Component.View|undefined}
       * @default undefined
       */
      this.view = new this.View(
          lateralus
          ,this
          ,augmentedViewOptions
        );
    }

    _.extend(this, options);

    /**
     * A method to be called when this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` has been set up.
     * @property initialize
     * @type {Function|undefined}
     * @default undefined
     */
    if (this.initialize) {
      this.initialize(options);
    }

    /**
     * A map of functions or string references to functions that will handle
     * [events](http://backbonejs.org/#Events) dispatched to this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` instance.  This is useful for
     * responding to events that are specific to this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` and don't affect others.
     *
     *     var ExtendedComponent = Lateralus.Component.extend({
     *       name: 'extended'
     *
     *       ,events: {
     *         dataAdded: 'onDataAdded'
     *
     *         ,dataRemoved: function () {
     *           // ...
     *         }
     *       }
     *
     *       ,onDataAdded: function () {
     *         // ...
     *       }
     *     });
     * @protected
     * @property events
     * @type {Object|undefined}
     * @default undefined
     */
    if (this.events) {
      this.delegateEvents(this.events, this);
    }

    /**
     * A map of functions or string references to functions that will handle
     * [events](http://backbonejs.org/#Events) dispatched to the central
     * `{{#crossLink "Lateralus"}}{{/crossLink}}` instance.  Distinct from
     * `{{#crossLink "Lateralus.Component/events:property"}}{{/crossLink}}`,
     * this is useful for responding to app-wide events.
     *
     *     var ExtendedComponent = Lateralus.Component.extend({
     *       name: 'extended'
     *
     *       ,lateralusEvents: {
     *         anotherComponentChanged: 'onAnotherComponentChanged'
     *
     *         ,anotherComponentDestroyed: function () {
     *           // ...
     *         }
     *       }
     *
     *       ,onAnotherComponentChanged: function () {
     *         // ...
     *       }
     *     });
     * @protected
     * @property lateralusEvents
     * @type {Object|undefined}
     * @default undefined
     */
    if (this.lateralusEvents) {
      this.delegateEvents(this.lateralusEvents, this.lateralus);
    }
  }

  var fn = Component.prototype;

  Component.View = ComponentView;
  Component.Model = ComponentModel;
  Component.Collection = ComponentCollection;

  /**
   * Create a `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` subclass.
   * @method extend
   * @param {Object} protoProps
   * @param {string} protoProps.name The name of this component.  It should
   * have no whitespace.
   * @param {Lateralus.Component.View} [protoProps.View] The `{{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}}` to render this component with.
   * @param {Lateralus.Component.Model} [protoProps.Model] The optional
   * `{{#crossLink "Lateralus.Component.Model"}}{{/crossLink}}` to be provided
   * to `protoProps.View` when it is instantiated.  This does nothing if
   * `protoProps.View` is not defined.
   */
  Component.extend = function (protoProps) {
    var extendedComponent = Backbone.Model.extend.call(this, protoProps);

    if (!protoProps.name) {
      throw new Error('A name was not provided to Component.extend.');
    }

    _.extend(extendedComponent, protoProps);

    return extendedComponent;
  };

  /**
   * Merge the properties of another object into this `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}`.  If `mixin` has a function called
   * `initialize`, it is called in the context of this `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}`.
   * @method mixin
   * @param {Object} mixin The object to mix in to this one.
   */
  fn.mixin = function (mixin) {
    _.extend(this, _.omit(mixin, 'initialize'));

    if (typeof mixin.initialize === 'function') {
      mixin.initialize.call(this);
    }
  };

  // Prototype members
  //
  _.extend(fn, Backbone.Events, mixins);

  /**
   * The name of this component.  This is used internally by Lateralus.
   * @protected
   * @property name
   * @type string
   */
  fn.name = 'component';

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  /**
   * Functions similarly to
   * [Backbone.View#delegateEvents](http://backbonejs.org/#View-delegateEvents).
   * Take a map of events and bind them to an event-emitting object.
   * @method delegateEvents
   * @param { Object(string|Function) } events The map of methods of names
   * of methods to bind to.
   * @param {Lateralus|Lateralus.Component} emitter The Object to listen to.
   * @chainable
   * @private
   */
  fn.delegateEvents = function (events, emitter) {
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) {
        method = this[events[key]];
      }

      if (!method) {
        new Error('Method "' + method + '" not found for ' + this.toString());
      }

      var match = key.match(delegateEventSplitter);
      this.listenTo(emitter, match[1], _.bind(method, this));

    }

    return this;
  };

  /**
   * @param {any} property
   * @param {Object} object
   */
  function removePropertyFromObject (property, object) {
    var propertyName;
    for (propertyName in object) {
      if (object[propertyName] === property) {
        delete object[propertyName];
      }
    }
  }

  /**
   * @param {Lateralus.Component.Model} Model A constructor, not an instance.
   * @param {Object} [attributes]
   * @param {Object} [options]
   * @return {Lateralus.Component.Model} An instance of the provided Model
   * constructor.
   * @method initModel
   */
  fn.initModel = function (Model, attributes, options) {
    var augmentedOptions = _.extend(options || {}, {
      component: this
      ,lateralus: this.lateralus
    });

    return new Model(attributes, augmentedOptions);
  };

  /**
   * @param {Lateralus.Component.Collection} Collection A constructor, not an
   * instance.
   * @param {Array.<Lateralus.Model>} [models]
   * @param {Object} [options]
   * @return {Lateralus.Component.Collection} Am instance of the provided
   * Collection constructor.
   * @method initCollection
   */
  fn.initCollection = function (Collection, models, options) {
    var augmentedOptions = _.extend(options || {}, {
      component: this
      ,lateralus: this.lateralus
    });

    return new Collection(models, augmentedOptions);
  };

  /**
   * Remove this `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` from
   * memory.
   * @method dispose
   * @chainable
   */
  fn.dispose = function () {
    if (this.view) {
      this.view.dispose();
    }

    if (this.components) {
      _.invoke(this.components, 'dispose');
    }

    var parentComponent = this.parentComponent;
    if (parentComponent) {
      removePropertyFromObject(this, parentComponent.components);
    }

    if (_.contains(this.lateralus.components, this)) {
      removePropertyFromObject(this, this.lateralus);
    }

    this.stopListening();

    var propName;
    for (propName in this) {
      if (this.hasOwnProperty(propName)) {
        delete this[propName];
      }
    }

    return this;
  };

  /**
   * Meant to be overridden by subclasses.
   * @method toJSON
   * @return {Object}
   */
  fn.toJSON = function () {
    return {};
  };

  /**
   * @method toString
   * @return {string} The name of this Component.  This is used internally by
   * Lateralus.
   */
  fn.toString = function () {
    return this.name;
  };

  return Component;
});
