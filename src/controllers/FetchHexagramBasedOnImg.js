const logger = require('../utils/Logger');
const { fetchHexagramBasedOnImgArr } = require('../models/Hexagram');

module.exports = (req, res) => fetchHexagramBasedOnImgArr(req.query.imgArray)
  .then(result => res.json(result))
  .catch(err => {
    logger.error('/fetchHexagramBasedOnImg', err);
    res.end();
  });
