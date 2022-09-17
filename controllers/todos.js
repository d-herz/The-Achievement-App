const Todo = require('../models/Todo')
const steam = require('../middleware/steam')

module.exports = {
    async getTodos(req,res) {
        const steamid = req.params.steamID
        const appid = req.params.appID
        const gameName = req.params.gameName.split("_").join(" ")
        try {
            // Finding the todo's for the specific user ID
            const totalAchievements = await steam.getGameAchievements(appid)
            const userAchievements = await steam.getUserGameAchievements(req, res)
            const gameInfo = await steam.getGameInfo(appid)
            const todoItems = await Todo.find({
                userId: req.user._id,
                appId: appid
                // completed: false
            })
            const itemsLeft = todoItems.length
            // console.log(totalAchievements, userAchievements)
            res.render('todos.ejs', {
                gameName: gameName.split("_").join(" "),
                todos: todoItems, 
                left: itemsLeft, 
                user: req.user, 
                appID: appid,
                totalAchievements: totalAchievements,
                userAchievements: userAchievements,
                gameInfo: gameInfo
            })
        }catch(err){
            console.log(err)
        }
    },
    async createTodo(req, res) {
        console.log(req.params)
        try{
            await Todo.create({
                todo: req.body.todoItem, 
                completed: false, 
                userId: req.user.id,
                steamId: req.params.steamID,
                appId: req.params.appID
            })
            console.log('Todo has been added!')
            res.redirect(`/todos/${req.user.steamID}/${req.params.appID}/${req.params.gameName}`)
        }catch(err){
            console.log(err)
        }
    },
    async markComplete(req, res) {
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    async markIncomplete(req, res) {
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    async deleteTodo(req, res) {
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    
