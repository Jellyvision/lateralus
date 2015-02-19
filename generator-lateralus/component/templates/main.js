define([

  'lateralus'

  ,'./{{prefix}}model'
  ,'./{{prefix}}view'
  ,'text!./{{prefix}}template.mustache'

], function (

  Lateralus

  ,Model
  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var {{componentClassName}}Component = Base.extend({
    name: '{{componentName}}'
    ,Model: Model
    ,View: View
    ,template: template
  });

  return {{componentClassName}}Component;
});
