const express = require('express')
const router = express.Router()
const steamController = require('../controllers/steam') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, steamController.steamLogin) 
router.get('/updateUser', ensureAuth, steamController.updateUser)
router.get('/:steamID', ensureAuth, steamController.getDashboard)
// pulls up the dashboard and passes in the user's steamId so the dashboard can be rendered
//router.get('/:steamID/:appID', ensureAuth, steamController.getGameData)
// pulls up specific game information and passes in the user and app id to render it
// -- game todos will also be connected to this route


// router.put('/updateUser', ensureAuth, steamController.updateUser)
// This is main route for steam/ , first thing it does is run 'ensureAuth' which is
// imported from middleware/auth.js file getsteam method in todo's controller

// TODO: Suggestions for Steam version of routes (feel free to modify, add to, or remove these comments):

//  steamController.getGames
//  steamController.getFriends
//  steamController.getAchievements
//  steamController.getStats


module.exports = router
