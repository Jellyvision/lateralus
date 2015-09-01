define([

  'lateralus'

  ,'{{appName}}.component.container'

], function (

  Lateralus

  ,ContainerComponent

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constructor
   */
  var {{appCtor}} = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
    this.containerComponent = this.addComponent(ContainerComponent);
  });

  return {{appCtor}};
});
