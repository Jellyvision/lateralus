define([

  'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,template

) {
  'use strict';

  var {{componentClassName}}Component = Lateralus.Component.extend({
    name: '{{componentName}}'
    ,View: View
    ,template: template
  });

  return {{componentClassName}}Component;
});
