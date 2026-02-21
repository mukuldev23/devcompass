const { Router } = require('express');
const articleRoutes = require('../modules/articles/article.routes');

const router = Router();

router.use(articleRoutes);

module.exports = router;
