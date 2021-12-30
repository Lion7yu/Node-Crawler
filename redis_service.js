const Redis = require("ioredis");
const redis = new Redis();

const ZHIHU_ID_SET_REDIS_KEY = "zhihu_id_set";
const ZHIHU_ARTICLE_GOT_ID_SET = "zhihu_article_got_id_set";

async function generateZhihuIdsToRedis(min, max) {
  const ITERATION = 10000;
  for (let i = min; i < max; i++) {
    const arr = new Array(ITERATION);
    for (let j = 0; j < ITERATION; j++) {
      arr.push(i * ITERATION + j);
    }
    await redis.sadd(ZHIHU_ID_SET_REDIS_KEY, arr);
  }
}

async function getRandomZhihuIds(count) {
  const ids = await redis.spop(ZHIHU_ID_SET_REDIS_KEY, count);
  return ids;
}

async function markArticleIdSucceed(id) {
  await redis.sadd(ZHIHU_ARTICLE_GOT_ID_SET, id);
}

async function idBackInPool(id) {
  await redis.sadd(ZHIHU_ID_SET_REDIS_KEY, id);
}

async function getRemainingIDCount() {
  const idCount = await redis.scard(ZHIHU_ID_SET_REDIS_KEY);
  return idCount;
}

module.exports = {
  generateZhihuIdsToRedis,
  getRandomZhihuIds,
  markArticleIdSucceed,
  idBackInPool,
  getRemainingIDCount,
};
