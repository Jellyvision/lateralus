/* Lateralus v.0.4.0 | https://github.com/Jellyvision/lateralus */
define('lateralus/lateralus.mixins',[

  'underscore'

], function (

  _

) {
  

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

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  /**
   * Bind `{{#crossLink "Lateralus.mixins:lateralusEvents"}}{{/crossLink}}`, if
   * it is defined.
   * @method delegateLateralusEvents
   * @chainable
   */
  mixins.delegateLateralusEvents = function () {

    _.each({
        /**
         * A map of functions or string references to functions that will
         * handle [events](http://backbonejs.org/#Events) dispatched to the
         * central `{{#crossLink "Lateralus"}}{{/crossLink}}` instance.
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
         * @property lateralusEvents
         * @type {Object|undefined}
         * @default undefined
         */
        lateralusEvents: this.lateralus || this

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
         * @property modelEvents
         * @type {Object|undefined}
         * @default undefined
         */
        ,modelEvents: this.model
      }, function (subject, mapName) {

      if (!subject) {
        return;
      }

      var eventMap = this[mapName];

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
   * @param {Object=} initialObject
   * @return {{ lateralus: Lateralus, component: Lateralus.Component= }}
   * component is not defined if `this` is the Lateralus instance.
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
   * @method initModel
   */
  mixins.initModel = function (Model, attributes, options) {
    var augmentedOptions = getAugmentedOptionsObject.call(this, options);
    return new Model(attributes, augmentedOptions);
  };

  /**
   * @param {Lateralus.Component.Collection} Collection A constructor, not an
   * instance.
   * @param {Array.(Lateralus.Model)} [models]
   * @param {Object} [options]
   * @return {Lateralus.Component.Collection} Am instance of the provided
   * Collection constructor.
   * @method initCollection
   */
  mixins.initCollection = function (Collection, models, options) {
    var augmentedOptions = getAugmentedOptionsObject.call(this, options);
    return new Collection(models, augmentedOptions);
  };

  /**
   * Merge the properties of another object into this object.  If the `mixin`
   * configuration object has a method called `initialize`, it is called in the
   * context of the object calling this function.
   * @method mixin
   * @param {Object} mixin The object to mix in to this one.
   */
  mixins.mixin = function (mixin) {
    _.extend(this, _.omit(mixin, 'initialize'));

    if (typeof mixin.initialize === 'function') {
      mixin.initialize.call(this);
    }
  };

  return mixins;
});

define('lateralus/lateralus.model',[

  'underscore'
  ,'backbone'

  ,'./lateralus.mixins'

], function (

  _
  ,Backbone

  ,mixins

) {
  

  var fn = {};

  // jshint maxlen:100
  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Model`](http://backbonejs.org/#Model).  The constructor for
   * this class should not be called by application code, it is used by the
   * `{{#crossLink "Lateralus"}}{{/crossLink}}` constructor.
   * @private
   * @class Lateralus.Model
   * @param {Lateralus} lateralus
   * @extends {Backbone.Model}
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus) {
    this.lateralus = lateralus;
    this.delegateLateralusEvents();
    this.on('change', _.bind(this.onChange, this));
    Backbone.Model.call(this);
  };

  /**
   * For every key that is changed on this model, a corresponding `change:`
   * event is `{{#crossLink "Lateralus.mixins/emit:method"}}{{/crossLink}}`ed.
   * For example, `set`ting the `"foo"` attribute will `{{#crossLink
   * "Lateralus.mixins/emit:method"}}{{/crossLink}}` `change:foo` and provide
   * the changed value.
   * @method onChange
   */
  fn.onChange = function () {
    var changed = this.changed;

    _.each(_.keys(changed), function (changedKey) {
      this.emit('change:' + changedKey, changed[changedKey]);
    }, this);
  };

  _.extend(fn, mixins);

  var LateralusModel = Backbone.Model.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  LateralusModel.prototype.toString = function () {
    return this.lateralus.toString() + '-model';
  };

  return LateralusModel;
});

define('lateralus/lateralus.component.view',[

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'mustache'

  ,'./lateralus.mixins'

], function (

  $
  ,_
  ,Backbone
  ,Mustache

  ,mixins

) {
  

  var fn = {};

  /**
   * The DOM template to be used with this View.
   * @type {string|null}
   * @default {null}
   */
  fn.template = null;

  // jshint maxlen:100
  /**
   * The constructor for this class should not be called by application code,
   * it is used by the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
   * constructor.
   * @private
   * @param {Lateralus} lateralus
   * @param {Lateralus.Component} component
   * @param {Object} [options] Gets passed to
   * [Backbone.View#initialize](http://backbonejs.org/#Collection-constructor).
   * @param {Lateralus.Component.View} [opt_parentView]
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus, component, options, opt_parentView) {
    this.lateralus = lateralus;

    /**
     * If this is a subview of another `{{#crossLink
     * "Lateralus.Component.View"}}{{/crossLink}}`, this property is a
     * reference to the parent `{{#crossLink
     * "Lateralus.Component.View"}}{{/crossLink}}`.
     * @property parentView
     * @type {Lateralus.Component.View|null}
     * @default null
     */
    this.parentView = opt_parentView || null;

    /**
     * A reference to the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
     * to which this `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}`
     * belongs.
     * @property component
     * @type {Lateralus.Component}
     * @final
     */
    this.component = component;

    if (options.model) {
      // Attach the model a bit early here so that the modelEvents map is
      // properly bound in the delegateLateralusEvents call below.
      this.model = options.model;
    }

    this.delegateLateralusEvents();
    Backbone.View.call(this, options);
  };

  /**
   * This is called when a `{{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}}` is initialized, it is not
   * called directly.
   *
   * `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` subclasses that
   * override `initialize` must call this base method:
   *
   *     var Base = Lateralus.Component.View;
   *     var baseProto = Base.prototype;
   *
   *     var ExtendedComponentView = Base.extend({
   *       initialize: function () {
   *         baseProto.initialize.apply(this, arguments);
   *         // Other logic...
   *       }
   *     });
   * @method initialize
   * @param {Object} [opts] Any properties or methods to attach to this
   * `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` instance.
   */
  fn.initialize = function (opts) {
    // this.toString references the central Component constructor, so don't
    // attach the class for it here.
    if (!this.parentView) {
      this.$el.addClass(this.toString());
    }

    /**
     * The CSS class names specified by this property will be attached to `$el`
     * when this `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` is
     * initialized.
     * @property className
     * @type {string|undefined}
     * @default undefined
     */
    if (this.className) {
      this.$el.addClass(this.className);
    }

    _.extend(this, _.defaults(_.clone(opts), this.attachDefaultOptions));
    this.renderTemplate();

    /**
     * A function to be called in the JavaScript thread that follows the one
     * that ran `{{#crossLink
     * "Lateralus.Component.View/initialize:method"}}{{/crossLink}}`.  This can
     * be necessary for situations where setup logic needs to happen after a
     * View has been rendered.
     *
     * In other words, `{{#crossLink
     * "Lateralus.Component.View/initialize:method"}}{{/crossLink}}` runs
     * before the View has been rendered to the DOM, and `{{#crossLink
     * "Lateralus.Component.View/deferredInitialize:method"}}{{/crossLink}}`
     * runs immediately after it has been rendered.
     * @method deferredInitialize
     */
    if (this.deferredInitialize) {
      _.defer(_.bind(this.deferredInitialize, this));
    }
  };

  /**
   * Meant to be overridden in subclasses.  With `attachDefaultOptions`, you
   * can provide an object of default parameters that should be attached to the
   * View instance when the base `initialize` method is called.  These values
   * can be overridden by the [`options` values that are provided to the View
   * constructor](http://backbonejs.org/#View-constructor).
   * @property attachDefaultOptions
   * @type {Object}
   */
  fn.attachDefaultOptions = {};

  /**
   * Adds a subview.  Subviews are lighter than subcomponents.  It is
   * preferable to use a subview rather than a subcomponent when there is clear
   * interdependency between two Views.  This pattern is useful when you want
   * to keep display logic well-organized into several Views, but have it
   * compartmentalized within a single component.
   * @method addSubview
   * @param {Lateralus.Component.View} Subview A constructor, not an instance.
   * @param {Object} [subviewOptions] Backbone.View [constructor
   * options](http://backbonejs.org/#View-constructor) to pass along to the
   * subview when it is instantiated.
   * @return {Lateralus.Component.View} The instantiated subview.
   */
  fn.addSubview = function (Subview, subviewOptions) {
    if (!this.subviews) {
      /**
       * The subviews of this object.  Do not modify this property directly, it
       * is managed by Lateralus.
       * @property subviews
       * @type {Array(Lateralus.Component.View)}
       */
      this.subviews = [];
    }

    var subview = new Subview(
      this.lateralus
      ,this.component
      ,subviewOptions
      ,this
    );

    this.subviews.push(subview);

    return subview;
  };

  /**
   * This method returns the object whose properties are used as render
   * variables in `{{#crossLink
   * "Lateralus.Component.View/renderTemplate"}}{{/crossLink}}`.  The method
   * can be overridden.
   * @method getTemplateRenderData
   * @return {Object} The [raw `Backbone.Model`
   * data](http://backbonejs.org/#Model-toJSON), if this View has a Model.
   * Otherwise, an empty object is returned.
   */
  fn.getTemplateRenderData = function () {
    var renderData = {};

    if (this.model) {
      _.extend(renderData, this.model.toJSON());
    }

    _.extend(renderData, this.lateralus.globalRenderData);

    return renderData;
  };

  fn.getTemplatePartials = function () {
    /**
     * An optional map of template partials to be passed to the
     * `Mustache.render` call for this View.
     *
     *     Lateralus.Component.View.extend({
     *       templatePartials: {
     *         myNamePartial: 'Hello my name is {{name}}.'
     *       }
     *     });
     *
     * @property templatePartials
     * @type {Object(String)|undefined}
     * @default undefined
     */
    return _.extend(this.templatePartials || {}, this.lateralus.globalPartials);
  };

  /**
   * Meant to be called by `{{#crossLink
   * "Lateralus.Component.View/initialize"}}{{/crossLink}}` and infrequently
   * thereafter, this method empties out
   * [`$el`](http://backbonejs.org/#View-$el) and does a full re-render.
   * [`render`](http://backbonejs.org/#View-render) should only be used for
   * partial renders.
   * @method renderTemplate
   */
  fn.renderTemplate = function () {
    if (!this.template) {
      return;
    }

    this.$el.children().remove();
    this.$el.html(
      Mustache.render(
        this.template
        ,this.getTemplateRenderData()
        ,this.getTemplatePartials()
      )
    );

    this.bindToDOM();
  };

  /**
   * Look for any DOM elements within [`$el`](http://backbonejs.org/#View-$el)
   * that have a class that looks like _`$this`_ and create a property on this
   * instance with the same name.  The attached property is a jQuery object
   * that references the corresponding DOM element.
   * @method bindToDOM
   * @private
   */
  fn.bindToDOM = function () {
    this.$el.find('[class]').each(_.bind(function (i, el) {
      var $el = $(el);
      var classes = $el.attr('class').split(/\s+/);

      _.each(classes, function (_class) {
        if (_class.match(/^\$/)) {
          this[_class] = $el;
          return false;
        }
      }, this);
    }, this));
  };

  /**
   * Remove this `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` from
   * the DOM and cleanly dispose of any references.
   * @method dispose
   * @chainable
   */
  fn.dispose = function () {
    this.remove();

    var parentView = this.parentView;
    if (parentView) {
      parentView.subviews = _.without(parentView.subviews, this);
    }

    return this;
  };

  _.extend(fn, mixins);

  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.View`](http://backbonejs.org/#View).
   * @class Lateralus.Component.View
   * @extends {Backbone.View}
   */
  var ComponentView = Backbone.View.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this View.  This is used internally by
   * Lateralus.
   */
  ComponentView.prototype.toString = function () {
    return this.component.toString() + '-view';
  };

  return ComponentView;
});

define('lateralus/lateralus.component.model',[

  'underscore'
  ,'backbone'

  ,'./lateralus.model'

], function (

  _
  ,Backbone

  ,LateralusModel

) {
  

  var ComponentModel = LateralusModel.extend({
    // jshint maxlen:100
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
     * @extends Lateralus.Model
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
  });

  /**
   * @method toString
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  ComponentModel.prototype.toString = function () {
    return this.component.toString() + '-model';
  };

  return ComponentModel;
});

define('lateralus/lateralus.component.collection',[

  'underscore'
  ,'backbone'

  ,'./lateralus.mixins'

], function (

  _
  ,Backbone

  ,mixins

) {
  

  var Base = Backbone.Collection;
  var baseProto = Base.prototype;
  var fn = {};

  /**
   * The constructor for this class should not be called by application code,
   * should only be called by `{{#crossLink
   * "Lateralus.Component.initCollection:method"}}{{/crossLink}}`.
   * @private
   * @param {Array.(Lateralus.Component.Model)} models
   * @param {Object} options
   * @param {Lateralus} options.lateralus
   * @param {Lateralus.Component} options.component
   * @constructor
   */
  fn.constructor = function (models, options) {
    this.lateralus = options.lateralus;
    this.component = options.component;
    this.delegateLateralusEvents();
    Base.apply(this, arguments);
  };

  /**
   * @override
   */
  fn.set = function (models, options) {
    var augmentedOptions = _.extend(options || {}, {
      lateralus: this.lateralus
      ,component: this.component
    });

    return baseProto.set.call(this, models, augmentedOptions);
  };

  _.extend(fn, mixins);

  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Collection`](http://backbonejs.org/#Collection).
   * @class Lateralus.Collection
   * @extends {Backbone.Collection}
   * @uses Lateralus.mixins
   */
  var LateralusCollection = Base.extend(fn);

  /**
   * @method toString
   * @return {string} The name of this Collection.  This is used internally by
   * Lateralus.
   */
  LateralusCollection.prototype.toString = function () {
    return this.lateralus.toString() + '-collection';
  };

  return LateralusCollection;
});

define('lateralus/lateralus.component',[

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

    this.delegateLateralusEvents();
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

define('lateralus/lateralus',[

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.model'
  ,'./lateralus.component'

], function (

  $
  ,_
  ,Backbone
  ,mixins
  ,LateralusModel
  ,Component

) {
  

  /**
   * You should not need to call the Lateralus constructor directly, use
   * `{{#crossLink "Lateralus/beget"}}{{/crossLink}}` instead.  To create a new
   * Lateralus app:
   *
   *     var App = Lateralus.beget(function () {
   *       // Don't forget to call the Lateralus constructor!
   *       Lateralus.apply(this, arguments);
   *     });
   *
   *     var app = new App(document.getElementById('app'));
   * @param {Element} el The DOM element that contains the entire Lateralus
   * app.
   * @class Lateralus
   * @uses Lateralus.mixins
   * @constructor
   */
  function Lateralus (el) {
    /**
     * The DOM node that contains this `{{#crossLink
     * "Lateralus"}}{{/crossLink}}` instance.
     * @property el
     * @type {HTMLElement}
     */
    this.el = el;

    /**
     * The jQuery Object that contains `{{#crossLink
     * "Lateralus/el:property"}}{{/crossLink}}`.
     * @property $el
     * @type {jQuery}
     */
    this.$el = $(el);

    /**
     * Maintains the state of the central `{{#crossLink
     * "Lateralus"}}{{/crossLink}}` instance.
     * @property model
     * @type {Lateralus.Model}
     */
    this.model = new LateralusModel(this);

    /**
     * An optional map of template render data to be passed to the
     * `Mustache.render` call for all Views belonging to this Lateralus app.
     * @property globalRenderData
     * @type {Object(String)}
     */
    this.globalRenderData = {};

    /**
     * An optional map of template partials to be passed to the
     * `Mustache.render` call for all Views belonging to this Lateralus app.
     * @property globalPartials
     * @type {Object(String)}
     */
    this.globalPartials = {};

    this.delegateLateralusEvents();
  }

  var fn = Lateralus.prototype;

  _.extend(fn, Backbone.Events);

  /**
   * Set up the prototype chain between two objects.
   * @static
   * @method inherit
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
   * Create a `{{#crossLink "Lateralus"}}{{/crossLink}}` application instance.
   *
   *     var App = Lateralus.beget(function () {
   *       Lateralus.apply(this, arguments);
   *     });
   * @static
   * @method beget
   * @param {Function} child
   * @return {Function} The created `{{#crossLink "Lateralus"}}{{/crossLink}}`
   * subclass.
   */
  Lateralus.beget = function (child) {
    child.displayName = child.name || 'begetConstructor';
    return Lateralus.inherit(child, Lateralus);
  };

  _.extend(fn, mixins);

  _.each([

    /**
     * Cross-browser friendly wrapper for `console.log`.
     * @method log
     * @param {...any} Any parameters to pass along to `console.log`.
     */
    'log'

    /**
     * Cross-browser friendly wrapper for `console.warn`.
     * @method warn
     * @param {...any} Any parameters to pass along to `console.warn`.
     */
    ,'warn'

    /**
     * Cross-browser friendly wrapper for `console.error`.
     * @method error
     * @param {...any} Any parameters to pass along to `console.error`.
     */
    ,'error'

  ], function (consoleMethodName) {
    fn[consoleMethodName] = function () {
      if (typeof console !== 'undefined' && console[consoleMethodName]) {
        console[consoleMethodName].apply(console, arguments);
      }
    };
  });

  /**
   * Do not override this method, it is used internally.
   * @method toString
   * @return {string} This is `"lateralus"`.
   * @final
   */
  fn.toString = function () {
    return 'lateralus';
  };

  Lateralus.Component = Component;
  Lateralus.Model = LateralusModel;

  return Lateralus;
});

define('lateralus', ['lateralus/lateralus'], function (main) { return main; });

