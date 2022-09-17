const User = require('../models/User')
const steamAuth = require('../config/steamAuth')
const steam = require('../middleware/steam')
require('dotenv').config({path: './config/.env'})

module.exports = {
    // Function declarations are possible within object literals as of ES6. No need to define as key/value pairs.
    // For more info: https://mariuszprzydatek.com/2017/04/22/ecmascript-es6-es2015-changes-overview
    // Section 12: "function expressions in object literals vs. method definitions"
    async steamLogin(req, res) {
        console.log(req.params)
        try {
            const redirectUrl = await steamAuth.getRedirectUrl();
            return res.redirect(redirectUrl);
        } catch (error) {
            console.log(error)
        }
    },

    async updateUser(req, res) {
        console.log(req.params)
        try {
            const user = await steamAuth.authenticate(req);
            console.log(user)
            // Updates user in db with steamId and steamUsername
            await User.updateOne({"_id": req.user.id}, {
                $set: {
                    steamUserName: `${user.username}`,
                    steamID: `${user.steamid}`
                }
            })
            // updates the user with steamID, owned games, etc
            console.log('Successfully updated user')
            //redirect to dashboard
            res.redirect(`/steam/${user.steamid}`)
        } catch (error) {
            console.log(error);
        }
    },

    // req.params = { steamID: < user steam ID here> }
    // also having ensureAuth passes in the current user
    async getDashboard(req, res) {
        try {
            const ownedGames = await steam.getSortedGames(req)
            const playerIsPublic = await steam.getPlayerPublicStatus(req)
            console.log("🐟 Player is public?", playerIsPublic)
            // updating the user DB to reflect any updates
            await User.updateOne({"_id": req.user.id}, {
                $set: {
                    ownedGames: ownedGames,
                }
            })
            // This is where all the game data is served to the dashboard.
            res.render('dashboard.ejs', {
                user: req.user,
                games: ownedGames,
                playerIsPublic
                
            })
        } catch (err) {
            console.log(err)
            res.redirect('/')
        }
    },
    // Currently not in use
    //req.params = { steamID: < user steam ID here>, appId: < steam appID here > }
    getGameData(req, res) {
        console.log(req.params)
        res.render('dashboard.ejs')
    }
}
