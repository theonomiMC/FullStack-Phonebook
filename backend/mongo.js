const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
let generateId = () => {
  return Math.floor(Math.random() * Math.floor(97))
}
const url =
  `mongodb+srv://fullstack:${password}@cluster0.mr1i6.mongodb.net/persons-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: generateId()
})
if (process.argv[3] && process.argv[4]) {
  person.save().then(response => {
    console.log(`person ${person.name} with number ${person.number} saved!`)
    mongoose.connection.close()
  })
}else{
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number} ${person.id}`)
    })
    mongoose.connection.close()
  })
}
