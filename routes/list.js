const express = require('express')
const router = express.Router()

const lists = [{
   id: 1,
   header: 'List One',
   cardIds: [1,2]
}];

router.get('/list', (req, res) => {
  res.json(lists);
});

router.get('/list/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find(li => li.id == id);

  // make sure we found a list
  if(!list) {
    logger.error(`List with id ${id} not found.`);
    return res
      .status(404)
      .send('List Not Found');
  }

  res.json(list);
});
module.exports = router