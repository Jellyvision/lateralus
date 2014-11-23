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
