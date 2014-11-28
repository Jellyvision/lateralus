define([

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
  'use strict';

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
   * This method returns the object whose properties are used as render
   * variables in `{{#crossLink
   * "Lateralus.Component.View/renderTemplate"}}{{/crossLink}}`.  The method
   * can be overridden.
   * @method getTemplateRenderData
   * @protected
   * @return {Object} The [raw `Backbone.Model`
   * data](http://backbonejs.org/#Model-toJSON), if this View has a Model.
   * Otherwise, an empty object is returned.
   */
  fn.getTemplateRenderData = function () {
    var renderData = {};

    if (this.model) {
      _.extend(renderData, this.model.toJSON());
    }

    return renderData;
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
