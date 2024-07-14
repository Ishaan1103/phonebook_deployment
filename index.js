import morgan from 'morgan'
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import PhoneBook from './modules/person.js'
const app = express()
const PORT = process.env.PORT
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(express.static('dist'))
// app.use(morgan((tokens, req, res) => {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//         JSON.stringify(req.body)
//     ].join()
// }));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errormessage=(error,req,res,next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error : 'malformatted id' })
  }
  else if(error.name === 'ValidationError'){
    return res.status(400).send(error.message)
  }
  next(error)
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :combined'))

morgan.token('combined', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
)

let persons = [
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Api for phoneBook</h1>')
})

app.get('/api/persons', (req, res) => {
  PhoneBook.find({})
    .then(numbers => {
      res.send(numbers)
    })

})

app.get('/info', (req, res) => {
  const date = new Date
  res.send(`<p>PhoneBook has info for ${persons.length} people</p><br/> ${date.toString()}`)
})

app.get('/api/persons/:id', (req, res,next) => {
  PhoneBook.findById(req.params.id)
    .then(number => {
      res.send(number)
    })
    .catch((err) => {
      return next(err)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new PhoneBook({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedNum => {
      res.json(savedNum)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id',(req,res,next) => {
  const { name,number } = req.body
  PhoneBook.findByIdAndUpdate(req.params.id, { name,number }, { new:true , runValidators: true, context: 'query' })
    .then(updated => {
      res.json(updated)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PhoneBook.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end().send(result)
    })
    .catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errormessage)

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`)
})