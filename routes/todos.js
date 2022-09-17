const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todos') 
const { ensureAuth } = require('../middleware/auth')

router.get('/:steamID/:appID/:gameName', ensureAuth, todosController.getTodos) 
// This is main route for todos/ , first thing it does is run 'ensureAuth' which is
// imported from middleware/auth.js file getTodos method in todo's controller

router.post('/createTodo/:steamID/:appID/:gameName', todosController.createTodo)

router.put('/markComplete', todosController.markComplete)

router.put('/markIncomplete', todosController.markIncomplete)

router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router
