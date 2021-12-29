const Redis = require("ioredis");
const redis = new Redis();

const ZHIHU_ID_SET_REDIS_KEY = "zhihu_id_set";
const ZHIHU_ARTICLE_GOT_ID_SET = "zhihu_article_got_id_set";

async function generateZhihuToRedis(min, max) {
  for (let i = min; i < max; i++) {
    const arr = new Array(10000);
    for (let j = 0; j < 10000; j++) {
      arr.push(i * 10000 + j);
    }
    await redis.sadd(ZHIHU_ID_SET_REDIS_KEY, ...arr);
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

module.exports = {
  generateZhihuToRedis,
  getRandomZhihuIds,
  markArticleIdSucceed,
  idBackInPool,
};
