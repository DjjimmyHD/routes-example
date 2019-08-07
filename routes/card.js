const express = require('express')
const router = express.Router()
const uuid = require('uuid/v4')
const winston = require('winston')

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

const cards = [{
  id: 1,
  title: 'Task One',
  content: 'This is card one'
},
{
    id: 2,
    title: 'Task2 ',
    content: 'This is card two'
}];

router.get('/card', (req, res, next) => {
  res.json(cards);
})

router.get('/card/:id', (req, res, next) => {
  const { id } = req.params;
  const card = cards.find(c => c.id == id);

  // make sure we found a card
  if(!card) {
    logger.error(`Card with id ${id} not found.`);
    return res
      .status(404)
      .send('Card Not Found');
  }

  res.json(card);
})
router.post('/card', (req, res, next) => {
  const { title, content } = req.body;

  if(!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  if(!content) {
    logger.error(`Content is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  const id = uuid();

  const card = {
    id,
    title,
    content
  };

  cards.push(card);

  logger.info(`Card with id ${id} created`);
  
  res
    .status(201)
    .location(`http://localhost:5555/card/${id}`)
    .json({id});
})

router.delete('/card/:id', (req, res) => {
  const { id } = req.params;

  const cardIndex = cards.findIndex(c => c.id == id);

  if( cardIndex === -1) {
    logger.error(`Card with id ${id} not found.`);
    return res
      .status(404)
      .send('Not found');
  }

  //remove card from lists
//   //assume cardIds are not duplicated in the cardIds array
//   lists.forEach(list => {
//     const cardIds = list.cardIds.filter(cid => cid !== id);
//     list.cardIds = cardIds;
//   });

  cards.splice(cardIndex, 1);

  logger.info(`Card with id ${id} deleted.`);

  res
    .status(204)
    .end();
})
module.exports = router