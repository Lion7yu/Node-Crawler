const axios = require("axios");
const cherrio = require("cheerio");
const RedisServer = require("./redis_service");

const { MongoClient } = require("mongodb");

async function spideringArticles(count) {
  const ids = await RedisServer.getRandomZhihuIds(count);
  console.log(ids);
  for (let id of ids) {
    await getSingleArticle(id).catch((e) => {
      if (e.errorCode !== 4040000) throw e;
    });
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }
}

async function getSingleArticle(id) {
  const db = await MongoClient.connect("mongodb://localhost:27017/zhihu");
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
  if (!articleContent) {
    return;
  } else {
    await RedisServer.markArticleIdSucceed(id);
  }
  const dom = $(articleContent);
  const content = getTextOrImg(dom, []);
  // doms.map((i, d) => {
  //   const text = $(d).text();
  //   if (text) {
  //     content.push(text);
  //   } else if (d.name === "img") {
  //     const src = $(d).attr("src");
  //     content.push(src);
  //   }
  // });

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
  console.log(content);
  console.log(articleContent.html());
  await db.collection("articles").findOneAndUpdate(
    {
      zhihuId: id,
    },
    {
      content: content,
      articleContentHtml: articleContent,
      createAt: Date.now().valueOf(),
    },
    {
      upsert: true,
      returnNewValue: true,
    }
  );
}

module.exports = {
  spideringArticles,
  getSingleArticle,
};
