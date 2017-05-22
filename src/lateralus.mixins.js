import _ from 'lodash-compat';

/**
 * These method are mixed into `{@link Lateralus}`,
 * `{@link Lateralus.Component}`, and `{@link Lateralus.Component.View}`.
 * @mixin Lateralus.mixins
 * @private
 * @requires http://backbonejs.org/#Events
 */
var mixins = {};

/**
 * Event namespace for `{@link Lateralus.mixins.provide}` handlers.
 * @type {string}
 * @memberof Lateralus.mixins
 * @name PROVIDE_PREFIX
 * @final
 * @private
 */
mixins.PROVIDE_PREFIX = '_provide:';
var PROVIDE_PREFIX = mixins.PROVIDE_PREFIX;

/**
 * @param {Object} obj
 * @return {boolean}
 * @private
 */
function isLateralus (obj) {
  return obj.toString() === 'lateralus';
}

/**
 * Add a subcomponent to a `{@link Lateralus}` or `{@link Lateralus.Component}`
 * instance.
 *
 *     var App = Lateralus.beget(function () {
 *       Lateralus.apply(this, arguments);
 *     });
 *
 *     var app = new App(document.getElementById('app'));
 *     var component = app.addComponent(Lateralus.Component);
 *     var subcomponent = component.addComponent(Lateralus.Component);
 *
 * @method Lateralus.mixins#addComponent
 * @param {Lateralus.Component} Component A constructor, not an instance.
 * @param {Object} [viewOptions] The `options` object to be passed along to
 * the `Component` parameter's {@link Lateralus.Component.View} instance.
 * @param {Object} [options] Gets passed to the new {@link Lateralus.Component}
 * instance.
 * @param {Object} [options.modelAttributes] Any attributes to pre-populate
 * the `{@link Lateralus.Component.Model}`
 * instance with, if there is one.
 * @param {Object} [options.modelOptions] Any parameters to pass to the
 * `{@link Lateralus.Component.Model}`
 * instance, if there is one.
 * @return {Lateralus.Component} The component that was added.
 */
mixins.addComponent = function (Component, viewOptions, options) {
  options = options || {};

  // If this object belongs to a Lateralus.Component (such as a
  // Lateralus.Component.View or Lateralus.Component.Model), add the new
  // subcomponent to that containing Lateralus.Component.
  if (typeof this.component !== 'undefined') {
    return this.component.addComponent.apply(this.component, arguments);
  }

  // If this object is a Lateralus.Model, add the new subcomponent to the
  // central Lateralus instance.
  if (this.toString() === 'lateralus-model') {
    return this.lateralus.addComponent.apply(this.lateralus, arguments);
  }

  if (!this.components) {
    /**
     * The subcomponents belonging to this object.  Do not modify this
     * property directly, it is managed by Lateralus.
     * @memberof Lateralus.mixins
     * @type {Object.<Lateralus.Component>}
     * @name components
     */
    this.components = {};

    /**
     * An internal counter registry of the subcomponents belonging to this
     * object.
     * @memberof Lateralus.mixins
     * @type {Object.<number>}
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
 * * If this is called by `{@link Lateralus}`, this just triggers an event on
 * that `{@link Lateralus}` instance.
 * * If this is called by a `{@link Lateralus.Component}`, this triggers an
 * event on that `{@link Lateralus.Component}` as well as the central `{@link
 * Lateralus}` instance.
 * * If this is called by a `{@link Lateralus.Component.View}`, this triggers
 * an event on that `{@link Lateralus.Component.View}`, the `{@link
 * Lateralus.Component}` to which it belongs, and the central `{@link
 * Lateralus}` instance.
 *
 * This method has the same method signature as
 * [`Backbone.Events.trigger`](http://backbonejs.org/#Events-trigger).
 * @method Lateralus.mixins#emit
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
 * Listen to an event-emitting Object and amplify one of its events across the
 * {@link Lateralus} application.  Useful for making plain Backbone Objects
 * (i.e., non-Lateralus Objects) communicate important information in a broader
 * way.
 * @method Lateralus.mixins#amplify
 * @param {Backbone.Events} emitter The object that `trigger`s events that
 * should be amplified globally across the app.
 * @param {string} eventName The event to amplify globally across the app.
 */
mixins.amplify = function (emitter, eventName) {
  this.listenTo(emitter, eventName, _.bind(this.emit, this, eventName));
};

/**
 * Listen for an event that is triggered on the central {@link Lateralus}
 * instance and bind a function handler.
 * @method Lateralus.mixins#listenFor
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

mixins.setupProviders = function () {
  _.each(this.provide, function (fn, key) {
    // The `provide` Object may have already been processed by setupProviders
    // from a previous class instantiation (it is a shared prototype Object)
    // so check for that and don't namespace the keys again.
    if (key.match(PROVIDE_PREFIX)) {
      return;
    }

    this.provide[PROVIDE_PREFIX + key] = function (callback, args) {
      callback(fn.apply(this, args));
    };

    delete this.provide[key];
  }, this);
};

/**
 * Execute any `{@link Lateralus.mixins.provide}` handlers that have
 * been set up in the app and return an array of the returned values.
 *
 * Values that are `undefined` are excluded from the returned Array.
 * @method Lateralus.mixins#collect
 * @param {string} key The name of the `{@link Lateralus.mixins.provide}`
 * methods to run.
 * @param {...any} [args] Any parameters to pass along to `{@link
 * Lateralus.mixins.provide}` methods.
 * @return {Array(any)}
 */
mixins.collect = function (key) {
  var args = _.toArray(arguments).slice(1);
  var collectedValues = [];

  this.emit(PROVIDE_PREFIX + key,
      _.bind(collectedValues.push, collectedValues), args);

  return _.reject(collectedValues, function (collectedValue) {
    return collectedValue === undefined;
  });
};

/**
 * Execute any `{@link Lateralus.mixins.provide}` handlers that have been set
 * up in the app and return the first value.
 * @method Lateralus.mixins#collectOne
 * @param {string} key The name of the `{@link Lateralus.mixins.provide}`
 * methods to run.
 * @param {...any} [args] Any parameters to pass along to `{@link
 * Lateralus.mixins.provide}` methods.
 * @return {any}
 */
mixins.collectOne = function () {
  return this.collect.apply(this, arguments)[0];
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

/**
 * Bind `{@link Lateralus.mixins.lateralusEvents}`, if it is
 * defined.
 * @method Lateralus.mixins#delegateLateralusEvents
 * @chainable
 */
mixins.delegateLateralusEvents = function () {
  this.setupProviders();

  _.each({
      /**
       * A map of functions or string references to functions that will
       * handle [events](http://backbonejs.org/#Events) dispatched to the
       * central `{@link Lateralus}` instance.
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
       * @memberof Lateralus.mixins
       * @name lateralusEvents
       * @type {Object|undefined}
       * @default undefined
       */
      lateralusEvents: this.lateralus || this,

      /**
       * A map of functions that will handle `{@link Lateralus.mixins#collect}`
       * calls.  Each of the functions attached to this Object should return a
       * value.  These functions **must** be completely synchronous.
       *
       *     var App = Lateralus.beget(function () {
       *       Lateralus.apply(this, arguments);
       *     });
       *
       *     _.extend(App.prototype, {
       *       provide: {
       *         demoData: function () {
       *           return 1;
       *         }
       *       }
       *     });
       *
       *     var app = new App();
       *     var ComponentSubclass = Lateralus.Component.extend({
       *       name: 'provider'
       *       ,provide: {
       *         demoData: function () {
       *           return 2;
       *         }
       *       }
       *     });
       *
       *     app.addComponent(ComponentSubclass);
       *     console.log(app.collect('demoData')); // [1, 2]
       * @memberof Lateralus.mixins
       * @name provide
       * @type {Object|undefined}
       */
      provide: this.lateralus || this,

      /**
       * A map of functions or string references to functions that will
       * handle [events](http://backbonejs.org/#Events) emitted by
       * `this.model`.
       *
       *     var ExtendedComponent = Lateralus.View.extend({
       *       modelEvents: {
       *         changed:someProperty: function (model, someProperty) {
       *           // ...
       *         }
       *       }
       *     });
       * @memberof Lateralus.mixins
       * @name modelEvents
       * @type {Object|undefined}
       * @default undefined
       */
      modelEvents: this.model
    }, function (subject, mapName) {

    if (!subject) {
      return;
    }

    var eventMap = this[mapName];

    if (eventMap) {
      // Inherit the parent object's event map, if there is one.
      var childEventMap = eventMap;
      var ctorProto = this.constructor.prototype;

      if (ctorProto[mapName]) {
        // Temporarily delete the key so the next analogous key on the
        // prototype chain is accessible.
        delete ctorProto[mapName];

        // Grab the inherited map.
        var baseEventMap = this[mapName];

        // Augment the child's map with the parent's.
        ctorProto[mapName] = _.defaults(childEventMap, baseEventMap);
      }
    }

    for (var key in eventMap) {
      var method = eventMap[key];
      if (!_.isFunction(method)) {
        method = this[eventMap[key]];
      }

      if (!method) {
        new Error('Method "' + method + '" not found for ' + this.toString());
      }

      var match = key.match(delegateEventSplitter);
      var eventName = match[1];
      var boundMethod = _.bind(method, this);

      if (isLateralus(this) && isLateralus(subject)) {
        this.on(eventName, boundMethod);
      } else {
        this.listenTo(subject, eventName, boundMethod);
      }
    }
  }, this);

  return this;
};

/**
 * Helper function for initModel and initCollection.
 * @param {Object} [initialObject]
 * @return {{ lateralus: Lateralus, component: Lateralus.Component= }}
 * `component` is not defined if `this` is the Lateralus instance.
 * @private
 */
function getAugmentedOptionsObject (initialObject) {
  // jshint validthis:true
  var thisIsLateralus = isLateralus(this);
  var augmentedOptions = _.extend(initialObject || {}, {
    lateralus: thisIsLateralus ? this : this.lateralus
  });

  if (!thisIsLateralus) {
    augmentedOptions.component = this.component || this;
  }

  return augmentedOptions;
}

/**
 * @param {Lateralus.Component.Model} Model A constructor, not an instance.
 * @param {Object} [attributes]
 * @param {Object} [options]
 * @return {Lateralus.Component.Model} An instance of the provided Model
 * constructor.
 * @method Lateralus.mixins#initModel
 */
mixins.initModel = function (Model, attributes, options) {
  if (isLateralus(this)) {
    return new Model(this, attributes, options);
  }

  var augmentedOptions = getAugmentedOptionsObject.call(this, options);
  return new Model(attributes, augmentedOptions);
};

/**
 * @param {Lateralus.Component.Collection} Collection A constructor, not an
 * instance.
 * @param {Array.<Lateralus.Model>} [models]
 * @param {Object} [options]
 * @return {Lateralus.Component.Collection} Am instance of the provided
 * Collection constructor.
 * @method Lateralus.mixins#initCollection
 */
mixins.initCollection = function (Collection, models, options) {
  var augmentedOptions = getAugmentedOptionsObject.call(this, options);
  return new Collection(models, augmentedOptions);
};

/**
 * Merge the properties of another object into this object.  If the `mixin`
 * configuration object has a method called `initialize`, it is called in the
 * context of the object calling this function.
 * @method Lateralus.mixins#mixin
 * @param {Object} mixin The object to mix in to this one.
 */
mixins.mixin = function (mixin) {
  _.extend(this, _.omit(mixin, 'initialize'));

  if (typeof mixin.initialize === 'function') {
    mixin.initialize.call(this);
  }
};

export default mixins;
