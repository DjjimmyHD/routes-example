require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const winston = require('winston')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const uuid = require('uuid/v4')
const cardRoute = require('../routes/card')
const listRoute = require('../routes/list')
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});
  
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(express.json());

// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN
//   const authToken = req.get('Authorization')

//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//     logger.error(`Unauthorized request to path: ${req.path}`);
//     return res.status(401).json({ error: 'Unauthorized request' })
//   }
//   // move to the next middleware
//   next()
// })


app.get('/', (req,res,next) => {
    res.send('👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻')
})

app.use(cardRoute)
app.use(listRoute)

app.post('/list', (req, res) => {
  const { header, cardIds = [] } = req.body;
  if(!header) {
    logger.error(`Header is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  // check card ids
  if( cardIds.length > 0 ) {
    let valid = true;
    cardIds.forEach(cid => {
      const card = cards.find(c => c.id == cid);
      if(!card) {
        logger.error(`Card with id ${cid} not found in cards array.`);
        valid = false;
      } 
    });

    if(!valid) {
      return res
        .status(400)
        .send('Invalid data');
    }
  }

  // get an id
  const id = uuid();

  const list = {
    id,
    header,
    cardIds
  };

  lists.push(list);

  logger.info(`List with id ${id} created`);
  
  res
    .status(201)
    .location(`http://localhost:5555/list/${id}`)
    .json({id});

});

app.delete('/list/:id', (req, res) => {
  const { id } = req.params;

  const listIndex = lists.findIndex(li => li.id === id);

  if( listIndex === -1 ) {
    logger.error(`List with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  lists.splice(listIndex, 1);

  logger.info(`List with id ${id} deleted.`);
  res
    .status(204)
    .end();

});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app