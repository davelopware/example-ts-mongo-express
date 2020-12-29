# Example for TypeScript, MongoDB and Express

Simple example project to demonstrate basics of using TypeScript with MongoDB (via mongoose) and NodeJS Express

# Adding new Mongo Collection / API Resource

You can start with the database or with the API, it doesn't really matter. Here we'll start with the database.

We'll refer to the example book files for what to do:

1. Create a new file like ```src/models/bookModel.ts```
   1. ```IBookModel``` to list the model interface that will represent the db record's fields 
   2. ```BookSchema``` to define the db field names and types
   3. ```BookModel``` as the actual Model type
2. Create a new file like ```src/rest/hateoasBookHandler.ts```
   1. ```HateoasBookHandler``` extending ```HateoasResourceHandler<IBookModel>```
   2. Specify the content types, resourceTypeName, outFields and inFields for the rest endpoints in the super constructor
   3. Implement ```buildLinks()``` to return links for this type of resource 
3. Create a new file like ```src/routes/routesBook.ts```
   1. ```RoutesBook``` extending ```RoutesBase<IBookModel>```
   2. Specify the routeBase url for the api resource and the id field name in the super constructor
   3. Wire up the route methods in ```initialiseRoutes()```
   4. Implement resource specific routeUri returning methods
   5. Override model specific methods ```newModel()```, ```findOne()```, ```find()```, ```findOneAndUpdate()``` and ```idAsFindableConditionFromModel()```
4. Update ```src/routes/routeManager.ts```
   1. Add a property for the ```RoutesBook``` route and initialise it in the constructor



