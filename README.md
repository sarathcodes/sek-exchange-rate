# Exchange Rate App

This is a simple full stack [React](https://reactjs.org/) application with a [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) backend. Client side code is written in React and the backend API is written using Express. This application is configured with [Airbnb"s ESLint rules](https://github.com/airbnb/javascript) and formatted through [prettier](https://prettier.io/). Built using a [boilerplate](https://github.com/crsandeep/simple-react-full-stack) app. 

- [Configuration](#Configuration)
- [Development mode](#development-mode)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Future Work](#future-work)

## Configuration

The config.js contains 3 configrations. 
1. **secret** : Super secret key to use with JWT
2. **restCountryAPIKey** : https://fixer.io/ API key to get exchange rates
3. **apiLimitPerMinute** : Number of requests allower per minute per user


## Development mode

In the development mode, we will have 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sarathcodes/exhange-rate.git

# Go inside the directory
cd exchange-rate

# Install dependencies
yarn (or npm install)

# Start development server
yarn dev (or npm run dev)
```

Currently the user credential is hard coded. Use any one of these:
```
alice@ccc.com\test1234
bob@ccc.com\1234test
```

Since there is no logout functionality provided at the moment, to logout user can delete the cookies and reload the app.

## Documentation
- **requestLimitter.js** acts as both an authentication layer and also checks if API limit has been reached for a minute. The technique used to check API limit is sliding technique. At each minute new tokens are alloted and when consumed token are removed appropriately. The limit is applied at user level and not at token level. This is opposed to the requirement as if limitiing is applied at token level user can simply request for a new token using login. All `/api` end points pass through this middleware.
- **location.js** is responsible for getting country lookup and getting conversion rates
- **currency.js** is responsible for getting latest conversion rates. The API key used to retrieve this key has a limit of 1000 requests per month. That means approximately we would be only able to make approximately 1 request every 45 minutes. I have a cron function in this method (commneted now) that gets latest conversion rate every x milliseconds
-- The UI componets **countryList** and **login** deals with displaying the country info and login UI

## Future Work
- Move **secret** and **restCountryAPIKey** from config to environment variable as exposing of secret keys in config is not recommended
- Implement register fucntionality and remove hard coding of user info from code. This info should be persisted and retrieved from a DB
- Implement signout - its just a mmatter of removing token from cookie and setting state of loggedIn to false in App.js
- There's a memory leak in **requestLimitter.js**. The memory object that holds token info in never cleared. We can set up a background process to delete token info on expiry to overcome this. Even with 1000s of users this won't cause much problem as the datastructure used is very ligh weight.
- Implement remove function for added countries and disallow (if needed) adding duplicates to the countries list

## NPM packages used
- `axios` - To make API calls in server
- `bcryptjs` - For encryption
- `jsonwebtoken` - For JWT