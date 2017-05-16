import { _ } from 'underscore';
import Backbone from 'backbone';
import mixins from './lateralus.mixins';
import ComponentView from './lateralus.component.view';
import ComponentModel from './lateralus.component.model';
import ComponentCollection from './lateralus.component.collection';

/**
 * The constructor for this method should not be called directly.  Instead, use
 * the `{@link Lateralus.mixins#addComponent}` mixin method:
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
 * @param {Object} options Values to attach to this `{@link
 * Lateralus.Component}` instance.  This object also get passed to the `{@link
 * Lateralus.Component.initialize}` method, if one is defined.
 * @param {Object} [options.modelAttributes] Any attributes to pre-populate
 * the `{@link Lateralus.Component.Model}`
 * instance with, if there is one.
 * @param {Object} [options.modelOptions] Any parameters to pass to the
 * `{@link Lateralus.Component.Model}`
 * instance, if there is one.
 * @param {Object} viewOptions The `options` Object to pass to the
 * `{@link Lateralus.Component.View}`
 * constructor.
 * @param {Lateralus.Component} [opt_parentComponent] The parent component of
 * this component, if any.
 * @mixes http://backbonejs.org/#Events
 * @mixes Lateralus.mixins
 * @constructs Lateralus.Component
 */
function Component (lateralus, options, viewOptions, opt_parentComponent) {

  /**
   * A reference to the central `{@link Lateralus}`
   * instance.
   * @member Lateralus.Component#lateralus
   * @type {Lateralus}
   * @final
   */
  this.lateralus = lateralus;

  /**
   * If a `{@link Lateralus.Component}` has `mixins` defined on its `prototype`
   * before it is instantiated, the objects within `mixins` will be merged into
   * this `{@link  "Lateralus.Component}` at instantiation-time with `{@link
   * Lateralus.Component/mixin}`.
   * @property mixins
   * @type {Object|Array(Object)|undefined}
   * @default undefined
   */
  if (this.mixins) {
    _.each(this.mixins, _.bind(this.mixin, this));
  }

  if (opt_parentComponent) {
    /**
     * If this is a subcomponent of another `{@link Lateralus.Component}`, this
     * property is a reference to the parent `{@link Lateralus.Component}`.
     * @member Lateralus.Component#parentComponent
     * @type {Lateralus.Component|undefined}
     * @default undefined
     */
    this.parentComponent = opt_parentComponent;
  }

  /**
   * The `{@link Lateralus.Component.View}` constructor to use, if any.  If
   * this `{@link Lateralus.Component}` is intended to render to the DOM,
   * `View` should be defined on the `prototype` before instantiating:
   *
   *     var ExtendedComponent = Lateralus.Component.extend({
   *       name: 'extended'
   *       ,View: Lateralus.Component.View
   *       ,template: '<div></div>'
   *     });
   * @member Lateralus.Component#View
   * @type {Lateralus.Component.View|undefined}
   * @default undefined
   */
  if (this.View) {
    var augmentedViewOptions = viewOptions;

    // A model instance provided to addComponent takes precendence over the
    // prototype property.
    if (this.Model && !viewOptions.model) {

      options.modelOptions = _.extend(options.modelOptions || {}, {
        lateralus: lateralus,
        component: this
      });

      this.model = new this.Model(
        options.modelAttributes
        ,options.modelOptions
      );

      augmentedViewOptions.model = this.model;
    }

    /**
     * If `{@link Lateralus.Component.View}` is defined, this is an instance of
     * that constructor.
     * @member Lateralus.Component#view
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
   * A method to be called when this `{@link Lateralus.Component}` has been set
   * up.
   * @member Lateralus.Component#initialize
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
 * Create a `{@link Lateralus.Component}` subclass.
 * @method Lateralus.Component#extend
 * @param {Object} protoProps
 * @param {string} protoProps.name The name of this component.  It should have
 * no whitespace.
 * @param {Lateralus.Component.View} [protoProps.View] The `{@link
 * Lateralus.Component.View}` to render this component with.
 * @param {Lateralus.Component.Model} [protoProps.Model] The optional `{@link
 * Lateralus.Component.Model}` to be provided to `protoProps.View` when it is
 * instantiated.  This does nothing if `protoProps.View` is not defined.
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
 * @private
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
 * Remove this `{@link Lateralus.Component}` from memory.  Also remove any
 * nested components added by `{@link Lateralus.mixins#addComponent}`.
 * @method Lateralus.Component#dispose
 */
fn.dispose = function () {
  _(this).lateralusDispose(_.bind(function () {
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
  }, this));
};

/**
 * Meant to be overridden by subclasses.
 * @method Lateralus.Component#toJSON
 * @return {Object}
 */
fn.toJSON = function () {
  return {};
};

/**
 * @method Lateralus.Component#toString
 * @return {string} The name of this Component.  This is used internally by
 * Lateralus.
 */
fn.toString = function () {
  return this.name;
};

export default Component;
