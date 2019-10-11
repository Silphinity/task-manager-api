//CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const databaseName = 'task-manager'

MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser:true, useUnifiedTopology:true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database! '+error)
    }

    const db = client.db(databaseName)

    // db.collection('users').findOne({_id: new ObjectID('5d8e00ab2f33e0494ca30f94')}, (error, user) => {
    //     if (error){
    //         console.log(error)
    //     }

    //     console.log(user)
    // })
    const tasks = db.collection('tasks')
    const users = db.collection('users')

//    users.updateOne({_id: new ObjectID('5d8dfdcce7097200e8c123cc')}, {
//         $inc: {
//             age: 1
//         }
//     }).then(({result}) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

// //REMOVE A FIELD IN A COLLECTION
//     tasks.updateMany({}, {$unset: {complete: ""}}).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

// tasks.updateMany({}, {$set: {completed: true}}).then(({result}) => {
//     console.log("YEAH!",result)
// }).catch((error) => {
//     console.log(error)
// })

    users.deleteOne({name: "Jen"}).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

})
