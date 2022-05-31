const express = require("express");
const app = express();

app.use(express.json())

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
  console.log({test: Object.keys(request)})


  if(!body.name) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const id = Math.round(Math.random()*100_000)
  const {name, number } = body
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
