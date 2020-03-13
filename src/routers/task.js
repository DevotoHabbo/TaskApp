const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewares/auth')
const router = new express.Router()
// Creating a task
router.post('/tasks',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        createdby: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>res.status(201).send(task)).catch((err)=>res.status(400).send(err))
})

// Reading all tasks
// GET /tasks?completed=true || false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc||desc
router.get('/tasks',auth, async(req,res)=>{ 
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try{ 
        // const task = await Task.find({createdby:req.user._id})
        await req.user.populate({path:'tasks',match,options:{limit: parseInt(req.query.limit),skip: parseInt(req.query.skip),sort }}).execPopulate()
        res.send(req.user.tasks)
}   catch(e){
    res.status(500).send(e)
}  
})
// Read a task
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,createdby:req.user._id})

        if(!task){
            res.status(404).send(e)
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>allowUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update'})
    }
    try{     
        const task = await Task.findOne({_id:req.params.id,createdby:req.user._id})
        // const task = await Task.findById(req.params.id)
        if(!task){
            res.status(404).send()
        }
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send()

    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,createdby:req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()

    }
})

module.exports = router