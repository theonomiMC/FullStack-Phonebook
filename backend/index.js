const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

morgan.token('body', req => {
  if (Object.keys(req.body).length) {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//----GET All Persons ---
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
//---Get Info about Persons ---
app.get('/api/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      ${new Date()}
    `);
  })
})
//---GET person by ID ----
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err)
      res.status(404).end()
    } else {
      res.json(data)
    }
  })
})


//----POST = create new person -----
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name===undefined || body.number===undefined) {
    return response.status(400).json({ error: 'Missing name and/or number!' })
  }
  new Person({
    name: body.name,
    number: body.number
  })
    .save()
    .then(savedPerson => response
      .status(201)
      .json(savedPerson))
      .catch(error => next(error))
  })
  //---MODIFY existing Person----
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
//----DELETE person----
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result =>  res.status(204).end())
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})