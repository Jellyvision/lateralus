# Lateralus

[![Code Climate](https://codeclimate.com/github/Jellyvision/lateralus/badges/gpa.svg)](https://codeclimate.com/github/Jellyvision/lateralus)

Lateralus is a single page web application framework.  It is designed around the idea that UIs should be divided into discreet, reusable, loosely-coupled components.  These components should communicate only indirectly and be easily swappable or removable.  Lateralus provides patterns and utilities to cleanly isolate individual components of your app.

Lateralus is built upon Backbone, Lodash, jQuery, and Mustache.

**[Link: A simple demo app built with Lateralus](https://github.com/Jellyvision/marker)**

## Dependencies

The standard build of Lateralus does not have its dependencies baked, so you must provide them at runtime.  Lateralus expects and is tested with:

  * [Backbone](http://backbonejs.org/) 1.3.3
  * [lodash-compat](https://www.npmjs.com/package/lodash-compat) 3.10.2
  * [jQuery](http://jquery.com/) 1.12.4
  * [Mustache](https://github.com/janl/mustache.js/) 0.8.2

## Installation

To install Lateralus into an existing app:

````
npm install --save lateralus
````

## Running tests

You can run the Lateralus unit tests both in your browser as well as in a command line environment.  To run the tests in your browser:

```
npm run start
```

And then navigate to http://127.0.0.1:8080/test/.

To run them at the command line:

```
npm test
```

## Publishing new versions

Once things are ready, you should use `npm version`.
This will:
 - change the version in the `package.json` file.
 - build the documentation (with the new version).
 - commit the new documentation
 - tag the new version
 - push to the repo.

Once this is done, Travis will publish the change to NPM.
