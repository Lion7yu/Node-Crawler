const axios = require("axios");
const cherrio = require("cheerio");
const RedisServer = require("./redis_service");
const moment = require("moment");

const MongoClient = require("mongodb").MongoClient;
let db;

class Tag {
  constructor(name, score, value) {
    this.name = name;
    this.score = score;
    this.value = value;
  }
}

async function spideringArticles(count) {
  const ids = await RedisServer.getRandomZhihuIds(count);
  console.log(ids);
  let errCount = 0;
  let succeedCount = 0;
  for (let id of ids) {
    await getSingleArticle(id)
      .then((r) => {
        succeedCount++;
      })
      .catch((e) => {
        errCount++;
        if (e.errorCode !== 4040000) throw e;
      });
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }
  return {
    succeedCount,
    errCount,
  };
}

async function getSingleArticle(id) {
  if (!db) {
    db = await MongoClient.connect("mongodb://localhost:27017/zhihu");
  }
  const res = await axios
    .get(`https://zhuanlan.zhihu.com/p/${id}`)
    .catch((e) => {
      if (e.response && e.response.status && e.response.status == 404) {
        const err = new Error("Not Found");
        err.errorCode = 4040000;
        throw err;
      } else {
        throw e;
      }
    });
  const html = res.data;
  const $ = cherrio.load(html);
  const articleContent = $("div");
  const title = $(".Post-Header").children(".Post-Title").text();
  const originalCreateAt = moment(
    $(".ContentItem-time").text().split(" ")[1],
    "YYYY年MM月dd日 hh:mm:ss"
  );
  if (!articleContent) {
    return;
  } else {
    await RedisServer.markArticleIdSucceed(id);
  }
  const dom = $(articleContent);
  const content = getTextOrImg(dom, []);

  function getTextOrImg(dom, arr) {
    const d = $(dom);
    const children = d.children();
    if (children.length === 0) {
      if (d.text()) {
        arr.push(d.text());
      }
      if (d["0"].name === "img") {
        arr.push(d.attr("src"));
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        getTextOrImg(child, arr);
      }
    }
    return arr;
  }

  const article = {
    zhihuId: id,
    content: content,
    articleContentHtml: articleContent.html(),
    createAt: Date.now().valueOf(),
    originCreatedAt: originalCreateAt,
    title: title, //单个内容的名字
    tags: [],
  };

  console.log(article);

  // const zhihuDB = await db.db("zhihu");
  // await zhihuDB.collection("articles").findOneAndUpdate(
  //   {
  //     zhihuId: id,
  //   },
  //   {
  //     $set: { zhihuId: id },
  //     $set: { content: content },
  //     $set: { articleContentHtml: articleContent.html() },
  //     $push: { createAt: Date.now().valueOf() },
  //   },
  //   {
  //     upsert: true,
  //     returnNewDocument: true,
  //   }
  // );
  // console.log(content);
}

module.exports = {
  spideringArticles,
  getSingleArticle,
};
