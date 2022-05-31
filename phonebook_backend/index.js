const express = require("express");
const app = express();
const morgan = require('morgan');

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body); })
app.use(morgan( ':method :url :status :res[content-length] - :response-time ms \t :body'))
//app.use(morgan(':body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(`
        <p>Phone book has info for ${persons.length} people</p>
        <p>${new Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id == id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id)
  response.status(204).end()
})

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  const {name, number } = body

  if(!name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!number) {
    return response.status(400).json({
      error: "number is missing"
    })
  }
  if (persons.some((p) => p.name == name)) {
    return response.status(403).json({
      error: `${name} already exists`
    })
  }
  const id = Math.round(Math.random()*100_000)
  const person = {
    id, name, number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server runnin' on and on on port ${PORT}`);
});
