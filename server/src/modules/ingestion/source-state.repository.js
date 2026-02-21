const SourceState = require('./source-state.model');

class SourceStateRepository {
  async getBySourceKey(sourceKey) {
    return SourceState.findOne({ sourceKey }).lean();
  }

  async markSuccess(sourceKey) {
    await SourceState.findOneAndUpdate(
      { sourceKey },
      {
        $set: {
          active: true,
          failureCount: 0,
          lastError: '',
          blockedUntil: null,
          lastCheckedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  async markFailure(sourceKey, errorMessage, coolOffHours = 6) {
    const blockedUntil = new Date(Date.now() + coolOffHours * 60 * 60 * 1000);

    await SourceState.findOneAndUpdate(
      { sourceKey },
      {
        $inc: { failureCount: 1 },
        $set: {
          active: false,
          lastError: errorMessage,
          blockedUntil,
          lastCheckedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  async isBlocked(sourceKey) {
    const state = await this.getBySourceKey(sourceKey);

    if (!state || !state.blockedUntil) {
      return false;
    }

    return new Date(state.blockedUntil) > new Date();
  }

  async listAll() {
    return SourceState.find({}).lean();
  }
}

module.exports = new SourceStateRepository();
