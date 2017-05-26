'use strict';
import chai from 'chai';
import Backbone from 'backbone';
import Lateralus from '../../src/lateralus';
import { getLateralusApp } from '../utils';

const assert = chai.assert;

describe('Lateralus.Component.Collection', function () {
  describe('constructor', function () {
    const App = getLateralusApp();
    const app = new App();
    const component = app.addComponent(Lateralus.Component);
    const collection =
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
      const App = getLateralusApp();
      const app = new App();
      const component = app.addComponent(Lateralus.Component);
      const model = component.initModel(Lateralus.Component.Model);
      const collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      it('Adds a Lateralus.Component.Model instance', function () {
        assert.equal(1, collection.length);
      });
    });
  });

  describe('Prototype', function () {
    describe('remove()', function () {
      const App = getLateralusApp();
      const app = new App();
      const component = app.addComponent(Lateralus.Component);
      const model = component.initModel(Lateralus.Component.Model);
      const collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      const afterAddLength = collection.length;
      it('Adds a Lateralus.Component.Model instance', function () {
        assert.equal(1, afterAddLength);
      });

      let beforeDisposeWasCalled = false;
      model.on('beforeDispose', function () {
        beforeDisposeWasCalled = true;
      });

      collection.remove(model, { dispose: true });

      const afterRemoveLength = collection.length;
      it('Removed the model', function () {
        assert.equal(0, afterRemoveLength);
      });

      it('Called .dispose() on the model', function () {
        assert.isTrue(beforeDisposeWasCalled);
      });
    });
  });
});
