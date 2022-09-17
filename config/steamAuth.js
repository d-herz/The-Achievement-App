const SteamAuth = require("node-steam-openid");
require('dotenv').config({path: './config/.env'})

if (!process.env.STEAM_API_KEY) {
    console.log("-------------------------------------------------------------");
    console.error("🐠 STEAM_API_KEY is not set in .env file! If you don't have one, grab one from https://steamcommunity.com/dev/apikey 🐠")
    process.exit(1)
}

// NEED TO ADD HTTPS IN PROD
const steam = new SteamAuth({
  realm: `http://localhost:${process.env.PORT}/`, // Site name displayed to users on logon
  returnUrl: `http://localhost:${process.env.PORT}/steam/updateUser/`, // Your return route NEED TO ADD HTTPS IN PRODUCTION
  apiKey: process.env.STEAM_API_KEY // Steam API key
});

module.exports = steam
