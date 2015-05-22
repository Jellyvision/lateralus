define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  return {
    /**
     * @param {Function} [extraConstructorCode]
     */
    getLateralusApp: function (extraConstructorCode) {
      return Lateralus.beget(function () {
        Lateralus.apply(this, arguments);

        if (extraConstructorCode) {
          extraConstructorCode.call(this);
        }
      });
    }
  };
});
