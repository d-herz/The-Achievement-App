const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  // Storing user's ID with each created 'todo', so each unique user
  // can see the todo's they created on their dashboard
  userId: {
    type: String,
    required: true
  },
  steamId: {
    type: String,
    required: true
  },
  appId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
