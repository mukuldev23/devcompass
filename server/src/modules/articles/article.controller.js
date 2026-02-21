const articleService = require('./article.service');

class ArticleController {
  async list(req, res, next) {
    try {
      const data = await articleService.listArticles(req.query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async random(req, res, next) {
    try {
      const article = await articleService.getRandomArticle();
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'No articles available yet'
        });
      }

      return res.json({ success: true, data: article });
    } catch (error) {
      return next(error);
    }
  }

  async hot(req, res, next) {
    try {
      const data = await articleService.getHotArticles(req.query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async categories(req, res, next) {
    try {
      const data = await articleService.getCategories();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async sources(req, res, next) {
    try {
      const data = await articleService.getSources();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const report = await articleService.refreshArticles();
      res.status(202).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArticleController();
