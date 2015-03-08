/* global describe, it */
define([

  'chai'
  ,'lateralus'

], function (

  chai
  ,Lateralus

) {
  'use strict';

  var assert = chai.assert;

  describe('Bootup', function () {
    it('Should define Lateralus constructor', function () {
      assert.isFunction(Lateralus);
    });
  });

});
