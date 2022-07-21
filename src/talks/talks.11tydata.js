module.exports = {
  eleventyComputed: {
    permalink: (data) =>
      data.page.filePathStem.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-/, "") +
      ".html",
  },
};
