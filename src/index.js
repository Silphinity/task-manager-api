const express = require('express')
require ('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server up on port '+port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'fsdkljf' }, 'thisismtynewcourse', { expiresIn: '4 years'})
//     console.log(token)
//     const data = jwt.verify(token, 'thisismtynewcourse')
//     console.log(data)
// }

// myFunction()

// const pet = {
//     name: 'Fido'
// }

// pet.toJSON = function () {
//     return {}
// }

// console.log(JSON.stringify(pet))

//a toJSON method is called implicitly whenever a JSON.stringify function is called

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5d9c39c08153fb358035ec0d')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5d9c38d4535f0d3e7045a3f4')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()

//IMAGES

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000,
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error('File Must be an image (jpg / png)'))
//         }

//         cb(undefined, true)
//     }
// })

// const errorMiddleWare = (req, res, next) => {
//     throw new Error('From my middleware')
// }


// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })