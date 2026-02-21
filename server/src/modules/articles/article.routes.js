const { Router } = require('express');
const articleController = require('./article.controller');
const validate = require('../../middlewares/validate.middleware');
const apiKeyMiddleware = require('../../middlewares/api-key.middleware');
const { listArticlesQuerySchema, hotArticlesQuerySchema } = require('./article.validation');

const router = Router();

router.get('/articles', validate(listArticlesQuerySchema), articleController.list.bind(articleController));
router.get('/articles/hot', validate(hotArticlesQuerySchema), articleController.hot.bind(articleController));

router.get('/articles/random', articleController.random.bind(articleController));
router.get('/categories', articleController.categories.bind(articleController));
router.get('/sources', articleController.sources.bind(articleController));

router.post('/admin/refresh', apiKeyMiddleware, articleController.refresh.bind(articleController));

module.exports = router;
