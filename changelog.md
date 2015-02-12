# 0.4.0

  * Add globalPartials map.

# 0.3.1

  * Add missing jQuery reference.

# 0.3.0

  * Improve generator-lateralus.  Added Grunt tasks:
    * grunt-gh-pages
    * grunt-bump
    * grunt-rev
  * Move "mixin" method to the mixins object.
  * Add support for templatePartials map.

# 0.2.0

  * Convert Component#delegateEvents to mixins.delegateLateralusEvents.
  * Remove Component.events map support.
  * Add mixin.initModel and mixin.initCollection.
  * Add Component.Collection.
  * Add Component.prototype.dispose.
  * Add Component.View deferredInitialize hook.

# 0.1.0

  * Consolidate ComponentModel and LateralusModel.
  * Properly mix in mixins module to all other modules.
  * Fix build process.
  * Remove _super.

# 0.0.7

  * Don't attach View constructor classnames for subviews.
  * Deprecate _super.
  * Add Component.prototype.delegateEvents, and events and lateralusEvents
    maps.
  * Add opt_base parameter to _super.
  * Introduce Lateralus.Model.

# 0.0.6

  * Introduce Lateralus.Component.Model.
  * Add support for providing a component-level Model constructor to Views.

# 0.0.5

  * Adds listenFor mixin method.
  * Makes Lateralus#toString @final.
  * Make Lateralus.Component.View#getTemplateRenderData return model data.

# 0.0.4

  * Adds displayName to beget constructor.
  * generator-lateralus sets up ContainerComponent.

# 0.0.3

  * Don't append subcomponents when they are added.
  * Get rid of the $appendTo option parameter for addComponent.
  * If a Lateralus.Component.View has a className defined on the prototype,
    attach it to $el in the initialize method.
  * generator-lateralus creates styles/main.sass for new components.
  * Add Lateralus#(log|warn|error) methods.

# 0.0.2

  * Lateralus.Component no longer requires a View parameter.
  * All protoProps properties are mixed into the Lateralus.Component subclass
    by Lateralus.Component.extend.
  * Adds options parameter to Lateralus.Component constructor and passes it to
    initialize function.
  * Adds build tasks and provides compiled binaries in dist/.

# 0.0.1

Initial open source release.
