const axios = require("axios");
const cherrio = require("cheerio");

(async () => {
  const res = await axios.get("https://zhuanlan.zhihu.com/p/419468589");
  const html = res.data;
  const $ = cherrio.load(html);
  const articleContent = $("article");
  const doms = $(articleContent).find("header, .Post-RichTextContainer,img");
  console.log(doms);
  // const doms = $(articleContent).find("p, p>img, div, div>img");

  const content = [];
  doms.map((i, d) => {
    const text = $(d).text();
    if (text) {
      content.push(text);
    } else if (d.name === "img") {
      const src = $(d).attr("src");
      content.push(src);
    }
  });

  console.log(content);
})()
  .then((r) => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
