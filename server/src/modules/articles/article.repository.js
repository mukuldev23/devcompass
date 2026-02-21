const Article = require('./article.model');

class ArticleRepository {
  async upsertMany(articles) {
    if (!articles.length) return { insertedCount: 0, modifiedCount: 0 };

    const operations = articles.map((article) => ({
      updateOne: {
        filter: { url: article.url },
        update: { $set: article },
        upsert: true
      }
    }));

    const result = await Article.bulkWrite(operations, { ordered: false });

    return {
      insertedCount: result.upsertedCount || 0,
      modifiedCount: result.modifiedCount || 0
    };
  }

  async findPaginated({ category, page, limit }) {
    const query = category ? { category } : {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Article.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      Article.countDocuments(query)
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  async findRecent({ category, limit = 400 }) {
    const query = category ? { category } : {};
    return Article.find(query).sort({ publishedAt: -1 }).limit(limit).lean();
  }

  async findRandomCandidate({ excludedIds = [], excludedSource = null }) {
    const query = {};

    if (excludedIds.length) {
      query._id = { $nin: excludedIds };
    }

    if (excludedSource) {
      query.source = { $ne: excludedSource };
    }

    const [candidate] = await Article.aggregate([{ $match: query }, { $sample: { size: 1 } }]);

    return candidate || null;
  }

  async findRandomAny() {
    const [candidate] = await Article.aggregate([{ $sample: { size: 1 } }]);
    return candidate || null;
  }

  async findDistinctSources() {
    return Article.distinct('source');
  }

  async countByCategory() {
    const rows = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    return rows.reduce((acc, row) => {
      acc[row._id] = row.count;
      return acc;
    }, {});
  }
}

module.exports = new ArticleRepository();
