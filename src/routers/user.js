const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const {sendWelcomeEmail,userGoodByeEmail} = require('../emails/account')

const router = new express.Router()


//Create a user
router.post('/users',async (req,res)=>{ 
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e){
        res.status(400).send(e)
    }
})
// Login
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})
// Log out
router.post('/users/logout',auth,async (req,res)=>{

    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token !== req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }
})
// Logout all from all the devices and locations
router.post('/users/logoutAll',auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()

    }
})
// Find me with authentication
router.get('/users/me',auth ,async (req,res)=>{
   res.send(req.user)
})

// Update a user with validated format
router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})
// Delete a user without any condition
router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove(),
        userGoodByeEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send()

    }
})
const upload = multer({limits:{fileSize:1000000},fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload an image'))
    }
    cb(undefined,true)
}})

router.post('/users/me/avatar',auth,upload.single('upload'),async(req,res)=>{

    const buffer = await sharp(req.file.buffer).resize({width:150,height:150}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},
    (err,req,res,next)=>{
    res.status(400).send({error:err.message})
})
router.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }
})
module.exports = router