function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("displayDate", formatDisplayDate);

  eleventyConfig.addFilter("groupPublicationsByYear", (items = []) => {
    const grouped = new Map();

    items.forEach((item) => {
      if (!grouped.has(item.year)) {
        grouped.set(item.year, []);
      }
      grouped.get(item.year).push(item);
    });

    return [...grouped.entries()]
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, entries]) => ({ year, entries }));
  });

  eleventyConfig.addFilter("groupPeople", (items = []) => {
    const grouped = new Map();

    items.forEach((item) => {
      if (!grouped.has(item.group)) {
        grouped.set(item.group, []);
      }
      grouped.get(item.group).push(item);
    });

    return [...grouped.entries()].map(([label, entries]) => ({ label, entries }));
  });

  eleventyConfig.addFilter("featuredOnly", (items = []) =>
    items.filter((item) => Boolean(item.featured))
  );

  eleventyConfig.addFilter("limit", (items = [], count = 3) => items.slice(0, count));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
