const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    //const task = new Task(req.body)
    const task = new Task({
        ...req.body, //This is an ES6 methodology which copies all fields in an object into a new object
        owner: req.user._id  
    })
    
    try {
        await task.save()
        res.status(201).send(task)

    } catch(e) {
        res.status(400).send(e)
    }

})

// GET /tasks?completed=false
// limit and skip - pagination
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt_asc/desc
router.get('/tasks', auth, async (req, res) => {
    const match = {
    }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/tasks/:id', auth, async (req, res) =>{
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

//UPDATE TASKS

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send("Invalid Update Fields. Allowed: \n"+allowedUpdates)
    }

    try {

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

//DELETE
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()    
        }
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }

})



module.exports = router

