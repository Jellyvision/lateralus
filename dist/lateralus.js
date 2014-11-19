/* Lateralus v.0.0.3 | https://github.com/Jellyvision/lateralus */
define('lateralus.mixins',[

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
    var thisIsLateralus = this.toString() === 'lateralus';

    var lateralusReference = thisIsLateralus ? this : this.lateralus;
    var component = new Component(
      lateralusReference
      ,Component.__super__
      ,options
      ,viewOptions
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

    if (this.component) {
      this.component.trigger.apply(this.component, args);
    }

    this.lateralus.trigger.apply(this.lateralus, args);
  };

  //jshint maxlen:100
  /**
   * Call a method of the next object on the prototype chain where it is
   * present.  This method is prepended with an underscore to prevent conflict
   * with the ES6 `super` keyword.
   *
   *     Lateralus.Component.extend({
   *       initialize: function () {
   *         // The same as Lateralus.Component.prototype.initialize.apply(this, arguments);
   *         this._super('initialize', arguments);
   *       }
   *     });
   * @method _super
   * @param {string} methodName
   * @param {arguments} [args] the `arguments` array from the calling function.
   * @return {any} Whatever the called method returned.
   */
  mixins._super = function (methodName, args) {
    var fn = this.__super__[methodName];
    var lookup = this.__proto;

    // Ensure that the method being called is at least one step up the
    // prototype chain from where _super was called.
    if (fn === this[methodName]) {
      while (lookup) {
        fn = lookup[methodName];

        if (typeof fn === 'function' && fn !== this[methodName]) {
          break;
        } else {
          lookup = lookup.__proto;
        }
      }
    }

    return fn.apply(this, args);
  };

  return mixins;
});

define('lateralus.component.view',[

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

  /**
   * @method toString
   * @protected
   * @return {string} The name of this View.  This is used internally by
   * Lateralus.
   */
  fn.toString = function () {
    return this.component.toString() + '-view';
  };

  // jshint maxlen:100
  /**
   * The constructor for this class should not be called by application code,
   * it is used by the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
   * constructor.
   * @private
   * @param {Lateralus} lateralus
   * @param {Backbone.View} __super__ The constructor that this subclass is
   * extending.
   * @param {Backbone.View} __proto The prototype that this subclass is
   * extending.
   * @param {Lateralus.Component} component
   * @param {Object} [options] Gets passed to
   * [`Backbone.View#initialize'](http://backbonejs.org/#Collection-constructor).
   * @param {Lateralus.Component.View} [opt_parentView]
   * @constructor
   */
  fn.constructor = function (
      lateralus, __super__, __proto, component, options, opt_parentView) {
    this.lateralus = lateralus;

    // Build an explicit prototype chain reference for _super method
    /**
     * A reference to the class which this `{{#crossLink
     * "Lateralus.Component.View"}}{{/crossLink}}` extends.
     * @property __super__
     * @private
     * @type {Lateralus.Component.View}
     * @final
     */
    this.__super__ = __super__;

    /**
     * A reference to the object that proceeds this one on the prototype chain.
     * @property __proto
     * @private
     * @type {Object}
     * @final
     */
    this.__proto = __proto;

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
   *     var ExtendedComponentView = Lateralus.Component.View.extend({
   *       initialize: function () {
   *         this._super('initialize', arguments);
   *       }
   *     });
   * @method initialize
   * @param {Object} [opts] Any properties or methods to attach to this
   * `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` instance.
   * @protected
   */
  fn.initialize = function (opts) {
    this.$el.addClass(this.toString());

    /**
     * The CSS class names specified by this property will be attached to `$el`
     * when this `{{#crossLink "Lateralus.Component.View"}}{{/crossLink}}` is
     * initialized.
     * @property className
     * @type {string|undefined}
     * @default {undefined}
     */
    if (this.className) {
      this.$el.addClass(this.className);
    }

    _.extend(this, _.defaults(_.clone(opts), this.attachDefaultOptions));
    this.renderTemplate();
  };

  /**
   * Meant to be overridden in subclasses.  With `attachDefaultOptions`, you
   * can provide an object of default parameters that should be attached to the
   * View instance when the base `initialize` method is called.  These values
   * can be overridden by the [`options` values that are provided to the View
   * constructor](http://backbonejs.org/#View-constructor).
   * @property attachDefaultOptions
   * @type {Object}
   * @protected
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
   * @param {Object} [subviewOptions] `Backbone.View` [constructor
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
      ,Subview.__super__
      ,Subview.prototype.__proto
      ,this.component
      ,subviewOptions
      ,this
    );

    this.subviews.push(subview);

    return subview;
  };

  /**
   * Meant to be overridden.  This method returns the object whose properties
   * are used as render variables in `{{#crossLink
   * "Lateralus.Component.View/renderTemplate"}}{{/crossLink}}`.
   * @method getTemplateRenderData
   * @protected
   * @return {Object}
   */
  fn.getTemplateRenderData = function () {
    return {};
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
        Mustache.render(this.template, this.getTemplateRenderData()));

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
   * Overrides [`Backbone.View#extend`](http://backbonejs.org/#View-extend) to
   * set up explicit prototype chain references for `{{#crossLink
   * "Lateralus.mixins/_super"}}{{/crossLink}}` calls.
   * @return {Object}
   */
  ComponentView.extend = function () {
    var extendedObject = Backbone.View.extend.apply(this, arguments);
    extendedObject.prototype.__proto = this.prototype;
    return extendedObject;
  };

  return ComponentView;
});

define('lateralus.component',[

  'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.component.view'

], function (

  _
  ,Backbone
  ,mixins
  ,ComponentView

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
   * @param {Lateralus.Component} __super__ The constructor that this subclass
   * is extending.
   * @param {Object} options Values to attach to this `{{#crossLink
   * "Lateralus.Component"}}{{/crossLink}}` instance.  This object also get
   * passed to the `{{#crossLink
   * "Lateralus.Component/initialize:property"}}{{/crossLink}}` method, if one
   * is defined.
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
  function Component (
      lateralus, __super__, options, viewOptions, opt_parentComponent) {

    /**
     * A reference to the central `{{#crossLink "Lateralus"}}{{/crossLink}}`
     * instance.
     * @property lateralus
     * @type {Lateralus}
     * @final
     */
    this.lateralus = lateralus;

    /**
     * A reference to the class which this `{{#crossLink
     * "Lateralus.Component"}}{{/crossLink}}` extends.
     * @property __super__
     * @private
     * @type {Lateralus.Component}
     * @final
     */
    this.__super__ = __super__;

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
      /**
       * If `{{#crossLink "Lateralus.Component/View:property"}}{{/crossLink}}`
       * is defined, this is an instance of that constructor.
       * @property view
       * @type {Lateralus.Component.View|undefined}
       * @default undefined
       */
      this.view = new this.View(
          lateralus
          ,this.View.__super__
          ,this.View.prototype.__proto
          ,this
          ,viewOptions
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
  }

  Component.View = ComponentView;

  /**
   * Create a `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` subclass.
   * @method extend
   * @param {Object} protoProps
   *   @param {string} protoProps.name The name of this component it should
   *   have no whitespace.
   *   @param {Lateralus.Component.View} [protoProps.View] The `{{#crossLink
   *   "Lateralus.Component.View"}}{{/crossLink}}` to render this component
   *   with.
   */
  Component.extend = function (protoProps) {
    var extendedComponent = Backbone.Model.extend.call(this, protoProps);

    var threwError = false;

    _.each([
          'name'
        ], function (prop) {
      if (typeof protoProps[prop] === 'undefined') {
        threwError = true;
        throw prop + ' was not provided to Component.extend.';
      }
    });

    if (threwError) {
      throw 'Component.extend failed.  See previous error message(s).';
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
  Component.prototype.mixin = function (mixin) {
    _.extend(this, _.omit(mixin, 'initialize'));

    if (typeof mixin.initialize === 'function') {
      mixin.initialize.call(this);
    }
  };

  // Prototype members
  //
  _.extend(Component.prototype, Backbone.Events);

  /**
   * The name of this component.  This is used internally by Lateralus.
   * @protected
   * @property name
   * @type string
   */
  Component.prototype.name = 'component';

  _.extend(Component.prototype, mixins);

  /**
   * Meant to be overridden by subclasses.
   * @method toJSON
   * @return {Object}
   */
  Component.prototype.toJSON = function () {
    return {};
  };

  /**
   * @method toString
   * @return {string} The name of this Component.  This is used internally by
   * Lateralus.
   */
  Component.prototype.toString = function () {
    return this.name;
  };

  return Component;
});

define('lateralus',[

  'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.component'

], function (

  _
  ,Backbone
  ,mixins
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
   * @protected
   * @param {Element} el The DOM element that contains the entire Lateralus
   * app.
   * @class Lateralus
   * @constructor
   */
  function Lateralus (el) {
    this.el = el;
    this.$el = $(el);
  }

  _.extend(Lateralus.prototype, Backbone.Events);

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
    return Lateralus.inherit(child, Lateralus);
  };

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/addComponent"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method addComponent
   */
  Lateralus.prototype.addComponent = mixins.addComponent;

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
    Lateralus.prototype[consoleMethodName] = function () {
      if (typeof console !== 'undefined' && console[consoleMethodName]) {
        console[consoleMethodName].apply(console, arguments);
      }
    };
  });

  /**
   * @method toString
   * @return {string} This is `"lateralus"`.
   */
  Lateralus.prototype.toString = function () {
    return 'lateralus';
  };

  Lateralus.Component = Component;

  return Lateralus;
});

