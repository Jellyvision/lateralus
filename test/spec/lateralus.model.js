import chai from 'chai';
import _ from 'lodash-compat';
import Backbone from 'backbone';
import Lateralus from '../../scripts/lateralus';
import { getLateralusApp } from '../utils';

var assert = chai.assert;

describe('Lateralus.Model', function () {
  describe('constructor', function () {
    var App = getLateralusApp();
    var app = new App();

    it('Is an instance of Backbone.Model', function () {
      assert.instanceOf(app.model, Backbone.Model);
    });

    it('Is an instance of Lateralus.Model', function () {
      assert.instanceOf(app.model, Lateralus.Model);
    });
  });

  describe('Prototype', function () {
    describe('onChange()', function () {
      var count = 0;
      var App = getLateralusApp(function () {
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
      var App = getLateralusApp();
      var app = new App();

      it('Returns internal name', function () {
        assert.equal(app.model.toString(), 'lateralus-model');
      });
    });
  });

  describe('Mixins', function () {
    describe('addComponent()', function () {
      var App = getLateralusApp();
      var app = new App();

      var component = app.model.addComponent(Lateralus.Component);

      it('Adds component to the central Lateralus instance', function () {
        assert.equal(component, app.components.component0);
      });
    });

    describe('emit()', function () {
      var App = getLateralusApp();

      var testWasCalled = false;
      App.prototype.lateralusEvents = {
        test: function () {
          testWasCalled = true;
        }
      };

      var app = new App();
      app.model.emit('test');

      it('Emits events to Lateralus', function () {
        assert.isTrue(testWasCalled);
      });
    });
  });
});
