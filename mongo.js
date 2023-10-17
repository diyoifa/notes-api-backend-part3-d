const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`


const url = `mongodb+srv://test1002542235:${password}@cluster0.70zx4ii.mongodb.net/note-app?retryWrites=true&w=majority`;


mongoose.connect(url)
.then(result => {
     console.log('connected to MongoDB')
})
.catch((error) => { 
    console.log('error connecting to MongoDB:', error.message) 
})

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'HTML is Easy',
//     date: new Date(),
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })