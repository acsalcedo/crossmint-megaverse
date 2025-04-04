# Crossmint coding challenge

This is the coding challenge for Crossmint. This program fetches the goal map from the Crossmint API, transforms the data and then creates the megaverse objects accordingly for my own megaverse map.

## How to build and run project

- Make sure to have npm installed

- Install dependencies: `npm install`

- Build project: `npm run build`

- Run project: `npm start`

## How to run tests

- Run tests: `npm test`

## Possible improvements/changes

- Move candidate id to environment variable
- Create all megaverse objects at the same time instead of waiting for each one to complete. However, I decided against this since the crossmint API is already rate limited.

