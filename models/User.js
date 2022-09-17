const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// Embedded document for game info retrieved from Steam API
// Todo lists could also be embedded for each game, since they are only ever accessed per user, per game.
// This will take a lot of setup, however.
const GameSchema = new mongoose.Schema({
    appid: Number,
    name: String,
    playtime_forever: Number,
    img_icon_url: String,
    has_community_visible_stats: Boolean,
    playtime_windows_forever: Number,
    playtime_mac_forever: Number,
    playtime_linux_forever: Number,
    rtime_last_played: Number,
    total_achievements: Number,
    achievements_unlocked: Number,
})


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    steamUserName: String,
    steamID: String,
    // Array of game objects containing info about each of the user's owned games
    ownedGames: [GameSchema]
})


// Password hash middleware.
// See: https://mongoosejs.com/docs/middleware.html#pre
UserSchema.pre('save', async function save(next) {
    // For clarity of what "this" is.
    const user = this
    if (!user.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        return next()
    } catch (err) {
        return next(err)
    }
})


// Helper method for validating user's password.
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)
    })
}


module.exports = mongoose.model('User', UserSchema)
