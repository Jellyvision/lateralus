'use strict';
import chai from 'chai';
import Backbone from 'backbone';
import Lateralus from '../../src/lateralus';
import { getLateralusApp } from '../utils';

const assert = chai.assert;

describe('Lateralus.Component.Model', function () {
  describe('constructor', function () {
    const App = getLateralusApp();
    const app = new App();
    const component = app.addComponent(Lateralus.Component);
    const model = component.initModel(Lateralus.Component.Model);

    it('Is an instance of Backbone.Model', function () {
      assert.instanceOf(model, Backbone.Model);
    });

    it('Is an instance of Lateralus.Component.Model', function () {
      assert.instanceOf(model, Lateralus.Component.Model);
    });
  });

  describe('Prototype', function () {
    describe('dispose()', function () {
      const App = getLateralusApp();
      const app = new App();
      const component = app.addComponent(Lateralus.Component);
      const model = component.initModel(Lateralus.Component.Model);
      const collection =
        component.initCollection(Lateralus.Component.Collection);
      collection.add(model);

      model.dispose();

      it('Is removed from the collection to which it belongs', function () {
        assert.equal(0, collection.length);
      });
    });

    describe('destroy', function () {
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

      model.destroy({ dispose: true });

      const afterDestroyLength = collection.length;
      it('Removed the model', function () {
        assert.equal(0, afterDestroyLength);
      });

      it('Called .dispose() on the model', function () {
        assert.isTrue(beforeDisposeWasCalled);
      });
    });
  });
});
