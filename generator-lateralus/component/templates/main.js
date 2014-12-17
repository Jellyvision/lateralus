define([

  'lateralus'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var {{componentClassName}}Component = Lateralus.Component.extend({
    name: '{{componentName}}'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return {{componentClassName}}Component;
});
