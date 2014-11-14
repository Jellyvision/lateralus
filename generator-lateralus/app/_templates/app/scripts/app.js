define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  /**
   * @param {Element} el
   * @extends {Lateralus}
   * @constuctor
   */
  var {{appCtor}} = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
  });

  return {{appCtor}};
});
