const fetch = require('node-fetch')
require('dotenv').config({path: './config/.env'})

//      .getGames
//      .getFriends
//      .getAchievements
//      .getStats

module.exports = {
    async getSortedGames(req, res) {
        // fetch req in here, can't normally fetch from the server so installed node-fetch pkg and required it in server.js and here in the steam controller
        // requesting the user's owned games in json format
        // Retrieve the user's owned games using the WebAPI Key provided in .env, along with the user's steam ID, and include extended info for each game.
        // TODO: Automate setting up the WebAPI Key per user and storing in User's document in db, so that a user doesn't need to make their profile public to make use of these features.
        const ownedGamesResponse = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.user.steamID}&format=json&include_appinfo=true`)
        const ownedGames = await ownedGamesResponse.json()
        // Presort games by total time played in descending order
        return ownedGames.response.games.sort((a, b) => {
            return b.rtime_last_played - a.rtime_last_played
        })
    },

    async getPlayerPublicStatus(req, res) {
        // Check if the user's profile is public
        const playerPublicStatusResponse = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${req.user.steamID}`)
        const playerPublicStatus = await playerPublicStatusResponse.json()
        // For an explanation, check the Steam WebAPI docs under:
        // GetPlayerSummaries (v0002) > Return Value > Public Data > communityvisibilitystate
        // https://developer.valvesoftware.com/wiki/Steam_Web_API
        return playerPublicStatus.response.players[0].communityvisibilitystate === 3
    },

    //app id needs to be passed in with req
    async getGameAchievements(req, res) {
        //fetch game Schema from Steam Web API, which includes most stats
        // console.log("App id passed in here?" + req)
        try {
            const entireGameStatsResponse = await fetch(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${process.env.STEAM_API_KEY}&appid=${req}`)
            const entireGameStats = await entireGameStatsResponse.json()
            // console.log(entireGameStats)
            return entireGameStats.game.availableGameStats.achievements != { game: {} } ? entireGameStats.game.availableGameStats.achievements : {}
        } catch (err) {
            console.log(err)
        }

        //from response json object, look at the achievement array and count the elements
        // For an explanation, check the Steam WebAPI docs under:
        // ISteamUserStats Interface > GetSchemaForGame 
        //https://partner.steamgames.com/doc/webapi/ISteamUserStats
    },

    //need to pass in appid, steamid with req
    async getUserGameAchievements(req, res) {
        //fetch game user stats from Steam Web API, which includes most stats
        // console.log("request getusergameachievements" + req.appid + ' ' + req.steamid)
        try {
            const userStatsForGameResponse = await fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${process.env.STEAM_API_KEY}&steamid=${req.params.steamID}&appid=${req.params.appID}`)
            const userStatsForGame = await userStatsForGameResponse.json();
            // console.log(userStatsForGame)
            return userStatsForGame ? userStatsForGame.playerstats.achievements : {}
        } catch (err) {
            console.log(err)
        }

        //return userStatsForGame.game.availableGameStats.achievements.length
        //from response json object, look at the achievement array and count the elements
        // For an explanation, check the Steam WebAPI docs under:
        // ISteamUserStats Interface > GetUserStatsForGame 
        //https://partner.steamgames.com/doc/webapi/ISteamUserStats
    },

    //need to pass in appid
    async getGameInfo(req, res) {
        //fetch game info without using a key, returns game data including screenshots and cover img
        try {
            const gameInfoResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${req}`)
            const gameInfo = await gameInfoResponse.json()
            // console.log(gameInfo[`${req}`])
            return gameInfo[`${req}`]
        } catch (err) {
            console.log(err)
        }

        //return gameInfo
        //gameInfo.${appid}.data
        //                       .name
        //                     .steam_appid
        //                   .header_image
        //                 .background
        //               .background_raw

    }
}
