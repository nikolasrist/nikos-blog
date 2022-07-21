const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const slugify = require("@sindresorhus/slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addFilter("readableDateMonthAndYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL yyyy");
  });

  eleventyConfig.addCollection("bloglist", (collection) => {
    const blogs = collection.getFilteredByTag("blog");
    return blogs.reverse();
  });

  eleventyConfig.addCollection("talklist", (collection) => {
    const talks = collection.getFilteredByTag("talk");
    return talks.reverse();
  });

  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(), // wraps the heading text in an anchor so the heading is also the accessible name
    slugify: (s) => slugify(s), // gets rid of any special characters in the anchor link url
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "public",
      data: "globals",
    },
  };
};
