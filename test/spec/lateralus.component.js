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

  return function () {
    describe('Lateralus.Component', function () {
      describe('Prototype', function () {
        describe('dispose()', function () {
          var App = getLateraralusApp();
          var app = new App();
          var component = app.addComponent(Lateralus.Component);

          var beforeDisposeWasHeard = false;
          component.on('beforeDispose', function () {
            beforeDisposeWasHeard = true;
          });

          component.dispose();

          it('Emitted beforeDispose event', function () {
            assert.isTrue(beforeDisposeWasHeard);
          });
        });
      });

      describe('mixins', function () {
        describe('delegateLateralusEvents', function () {
          describe('Inheritance', function () {
            var App = getLateraralusApp();
            var app = new App();
            var testWasCalled = false;

            var BaseComponent = Lateralus.Component.extend({
              name: 'base'
              ,lateralusEvents: {
                test: function () {
                  testWasCalled = true;
                }
              }
            });

            var ChildComponent = BaseComponent.extend({
              name: 'child'
              ,lateralusEvents: {
                foo: _.noop
              }
            });

            app.addComponent(ChildComponent);
            app.emit('test');

            it('Inherited the parent component\'s lateralusEvents map',
                function () {
              assert.isTrue(testWasCalled);
            });
          });
        });
      });
    });
  };
});
