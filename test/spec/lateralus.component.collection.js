import chai from 'chai';
import { _ } from 'underscore';
import Backbone from 'backbone';
import Lateralus from '../../scripts/lateralus';
import { getLateralusApp } from '../utils';

var assert = chai.assert;

describe('Lateralus.Component.Collection', function () {
  describe('constructor', function () {
    var App = getLateralusApp();
    var app = new App();
    var component = app.addComponent(Lateralus.Component);
    var collection =
      component.initCollection(Lateralus.Component.Collection);

    it('Is an instance of Backbone.Collection', function () {
      assert.instanceOf(collection, Backbone.Collection);
    });

    it('Is an instance of Lateralus.Component.Collection', function () {
      assert.instanceOf(collection, Lateralus.Component.Collection);
    });
  });

  describe('Prototype (inherited)', function () {
    describe('add()', function () {
      var App = getLateralusApp();
      var app = new App();
      var component = app.addComponent(Lateralus.Component);
      var model = component.initModel(Lateralus.Component.Model);
      var collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      it('Adds a Lateralus.Component.Model instance', function () {
        assert.equal(1, collection.length);
      });
    });
  });

  describe('Prototype', function () {
    describe('remove()', function () {
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

      collection.remove(model, { dispose: true });

      var afterRemoveLength = collection.length;
      it('Removed the model', function () {
        assert.equal(0, afterRemoveLength);
      });

      it('Called .dispose() on the model', function () {
        assert.isTrue(beforeDisposeWasCalled);
      });
    });
  });
});
