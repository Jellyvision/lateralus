define([

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
      var augmentedViewOptions = viewOptions;

      // A model instance provided to addComponent takes precendence over the
      // prototype property.
      if (this.Model && !viewOptions.model) {
        augmentedViewOptions.model = new this.Model();
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
          ,this.View.__super__
          ,this.View.prototype.__proto
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
  }

  Component.View = ComponentView;

  /**
   * Create a `{{#crossLink "Lateralus.Component"}}{{/crossLink}}` subclass.
   * @method extend
   * @param {Object} protoProps
   * @param {string} protoProps.name The name of this component it should have
   * no whitespace.
   * @param {Lateralus.Component.View} [protoProps.View] The `{{#crossLink
   * "Lateralus.Component.View"}}{{/crossLink}}` to render this component with.
   * @param {Backbone.Model} [protoProps.Model] The optional
   * [`Backbone.Model`](http://backbonejs.org/#Model) to be provided to
   * `protoProps.View` when it is instantiated.  This does nothing if
   * `protoProps.View` is not defined.
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
