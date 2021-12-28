const Redis = require("ioredis");

const redis = new Redis();

(async () => {
  const abc = await redis.get("abc");
  const hgetall = await redis.hgetall("my_hash_1");
  const smembers = await redis.smembers("my_set_1");

  console.log(abc);
  console.log(hgetall);
  console.log(smembers);
})()
  .then((r) => {})
  .catch((e) => {});
