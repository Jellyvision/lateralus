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
    it('Defines Lateralus constructor', function () {
      assert.isFunction(Lateralus);
    });

    it('Defines Lateralus.Component', function () {
      assert.isFunction(Lateralus.Component);
    });

    it('Defines Lateralus.Model', function () {
      assert.isFunction(Lateralus.Model);
    });

    it('Defines Lateralus.Router', function () {
      assert.isFunction(Lateralus.Router);
    });
  });

});
