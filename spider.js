const RedisService = require("./redis_service");
const Spider = require("./spider_demo");

switch (process.argv[2]) {
  case "generate_ids":
    RedisService.generateZhihuIdsToRedis(
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
    // Spider.spideringArticles(Number(process.argv[3]))
    getArticlesBG()
      .then((r) => {
        console.log("done");
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
    break;

  case "get_single_article":
    Spider.getSingleArticle(process.argv[3])
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

async function getArticlesBG() {
  const remainingCount = await RedisService.getRemainingIDCount();
  console.log(remainingCount);
  const numbersPerTime = 5;
  while (remainingCount >= 5) {
    console.log("4");
    await Spider.spideringArticles(numbersPerTime)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
