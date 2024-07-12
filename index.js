import morgan from 'morgan';
import express from 'express'
import cors from 'cors'
const app = express();
const PORT = 3001;
app.use(cors())
app.use(express.json());
app.use(express.static('dist'))
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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :combined'))

morgan.token('combined', (request) =>
    request.method === 'POST' && request.body.name
        ? JSON.stringify(request.body)
        : null
)

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Api for phoneBook</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date;
    res.send(`<p>PhoneBook has info for ${persons.length} people</p><br/> ${date.toString()}`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).json({
            error: "cannot find person"
        })
    }
})
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(person => parseInt(person.id))) : 0
    return (maxId + 1).toString();
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: 'Name Missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'Number Missing'
        })
    }
    const nameExist = persons.find((person) => person.name === body.name)
    if (nameExist) {
        res.status(400).json(
            { error: 'name must be unique' }
        )
    }
    const numberExist = persons.find((person) => person.number === body.number)
    if (numberExist) {
        res.status(400).json(
            { error: 'number must be unique' }
        )
    }
    else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person)
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const findId = persons.find(person => person.id === id)
    if (!findId) {
        return res.status(404).json({
            error: 'Not found'
        })
    }
    persons = persons.filter((person) => {
        return person.id !== id
    })
    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
})