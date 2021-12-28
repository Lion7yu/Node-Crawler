const RedisService = require("./redis_service");
const Spider = require("./spider_demo");

switch (process.argv[2]) {
  case "generate_ids":
    RedisService.generateZhihuToRedis(
      Number(process.argv[3]),
      Number(process.argv[4])
    )
      .then((r) => {
        console.log("done");
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
    break;

  case "start_getting_articles":
    Spider.spideringArticles(Number(process.argv[3]))
      .then((r) => {
        console.log("done");
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
    break;
}
