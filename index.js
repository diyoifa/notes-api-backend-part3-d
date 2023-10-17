require('dotenv').config()

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Note = require('./models/note');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

  morgan.token('post-data', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '-';
  });
  app.use(morgan(function (tokens, req, res) {
    return [
      'Método:', tokens.method(req, res),
      'URL:', tokens.url(req, res),
      'Código de estado:', tokens.status(req, res),
      'Tiempo de respuesta:', tokens['response-time'](req, res), 'ms',
      'Datos POST:', tokens['post-data'](req, res), 
    ].join(' ');
  }));

  app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
  
      .catch(error => next(error))
  })

  app.get('/api/notes', (request, response, next) => {
    Note.find({}).then(notes => {
      notes.forEach(note => {
        console.log(note)
      })
      response.json(notes)
    })
  })

  app.post('/api/notes', (request, response, next) => {
    const body = request.body
    //controlado por el esquema
    // if (body.content === undefined) {
    //   return response.status(400).json({ error: 'content missing' })
    // }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })

    note
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error)) 
  })

  app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  app.use(unknownEndpoint)
  //levantamos el servidor
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })



  
