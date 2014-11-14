Dependencies:

  * [Yeoman](http://yeoman.io)

To install generator-lateralus:

````
cd generator-lateralus
npm link
````

To create and install a new Lateralus app:

````
yo lateralus
````

To create a new component:

````
yo lateralus:component [component-name]
````

Components must `be-named-like-this`.

__Note__: Components will not be automatically wired up as [RequireJS packages](http://requirejs.org/docs/api.html#packages) after being created.  This must be done manually in your `app/scripts/main.js` file.
