import chai from 'chai';
import { _ } from 'underscore';
import Backbone from 'backbone';
import Lateralus from '../../scripts/lateralus';
import { getLateralusApp } from '../utils';

var assert = chai.assert;

describe('Lateralus.Component.Model', function () {
  describe('constructor', function () {
    var App = getLateralusApp();
    var app = new App();
    var component = app.addComponent(Lateralus.Component);
    var model = component.initModel(Lateralus.Component.Model);

    it('Is an instance of Backbone.Model', function () {
      assert.instanceOf(model, Backbone.Model);
    });

    it('Is an instance of Lateralus.Component.Model', function () {
      assert.instanceOf(model, Lateralus.Component.Model);
    });
  });

  describe('Prototype', function () {
    describe('dispose()', function () {
      var App = getLateralusApp();
      var app = new App();
      var component = app.addComponent(Lateralus.Component);
      var model = component.initModel(Lateralus.Component.Model);
      var collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      model.dispose();

      it('Is removed from the collection to which it belongs', function () {
        assert.equal(0, collection.length);
      });
    });

    describe('destroy', function () {
      var App = getLateralusApp();
      var app = new App();
      var component = app.addComponent(Lateralus.Component);
      var model = component.initModel(Lateralus.Component.Model);
      var collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      var afterAddLength = collection.length;
      it('Adds a Lateralus.Component.Model instance', function () {
        assert.equal(1, afterAddLength);
      });

      var beforeDisposeWasCalled = false;
      model.on('beforeDispose', function () {
        beforeDisposeWasCalled = true;
      });

      model.destroy({ dispose: true });

      var afterDestroyLength = collection.length;
      it('Removed the model', function () {
        assert.equal(0, afterDestroyLength);
      });

      it('Called .dispose() on the model', function () {
        assert.isTrue(beforeDisposeWasCalled);
      });
    });
  });
});
