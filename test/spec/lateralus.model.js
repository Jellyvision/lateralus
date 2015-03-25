/* global describe, it */
define([

  'chai'
  ,'underscore'
  ,'backbone'
  ,'lateralus'
  ,'../utils'

], function (

  chai
  ,_
  ,Backbone
  ,Lateralus
  ,utils

) {
  'use strict';

  var assert = chai.assert;
  var getLateraralusApp = utils.getLateraralusApp;

  describe('Lateralus.Model', function () {
    describe('Prototype', function () {
      describe('onChange()', function () {
        var count = 0;
        var App = getLateraralusApp(function () {
          this.model.set('prop1', 'foo');
        });

        _.extend(App.prototype, {
          lateralusEvents: {
            'change:prop1': function () {
              count++;
              this.model.set('prop2', 'bar');
            }
          }
        });

        new App(document.createElement('div'));

        // NOTE: This test was originally written because of a bug wherein
        // global change: handlers were called redundantly.  It is important
        // that count is 1 and not 2:
        // https://github.com/Jellyvision/lateralus/commit/8975b1d3ce52eaad994a7136789d469f181688a6
        it('Calls the global change: handler once', function () {
          assert.equal(count, 1);
        });
      });

      describe('toString()', function () {
        var App = getLateraralusApp();
        var app = new App();

        it('Returns internal name', function () {
          assert.equal(app.model.toString(), 'lateralus-model');
        });
      });
    });
  });
});
