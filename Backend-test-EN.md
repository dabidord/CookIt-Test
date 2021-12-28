# Technical Test - Backend

## Context

You work for Meal-kits company. The company has a factory where food boxes are created and filled manually by workers on the production line. At the beginning of the assembly of each box, the workers must scan a label that provides a list of items that must be included in the box.

The items are organized on shelves in a two-dimensional grid. Each item has a unique position (station) that indicates where it should be picked up.

## Statement

You are asked to create an API with a route returning the positions(s) (station) of all items passed in parameters. The route will be used by a UI that will display to the production line employees the position of the food items to be collected to complete the box. The service will have to be able to indicate the items that are out of inventory (volume == 0).

Items can be of several different categories (recipes, desserts, misc, etc), they must be obtained by calling the ItemService API (url below). Recipes sometimes contain items that need to be kept separate, especially meat. Therefore, the appropriate meat station should be added if the recipe contains meat. Position of meats and fish can be obtained from the Protein Service API (below). It is possible to determine if a recipe contains meat by looking in the `displayName` field. A letter indicates the code in the list below. For example, in the recipe 'Chicken with oranges' we have a `displayName': "2P-C-159`. The 2nd character followed by a `-` represents the portion, followed by a letter that represents the meat code, followed by the ID. If the recipe does not contain meat or fish, the letter code will be missing, for example `"displayName": "2P--160`.


**API Item Service** : `https://cookit.proxy.beeceptor.com/items`

**API Protein Service** : `https://cookit.proxy.beeceptor.com/proteins`

## Technical constraints

The language used should be Java, Node (js or ts) or Go. The frameworks used are up to the candidate.

The solution must be "production ready", which means that the solution must be tested and deployable.

Bonus points given for Dockerizing the application.

### Expected request format

```json
{
  "item-ids": [1, 2, 3, 4, 9999]
}
```

### Expected Response format

```json
{
  "picks": ["Z2", "Y8"],
  "out-of-stock": ["Z2"]
}
```

## Notes

Points are given not only for the solution to the problem, but also for the structure and elements that will make the application stable and maintainable according to industry standards. Be creative and don't limit yourself to answering the statement.

You will have 48 hours to complete the statement. The project must be published on Github and be publicly accessible. The link to the Repo should be sent by email.
