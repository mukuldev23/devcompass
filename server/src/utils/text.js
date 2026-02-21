const cheerio = require('cheerio');

function stripHtml(input = '') {
  const $ = cheerio.load(`<div>${input}</div>`);
  return $('div').text().replace(/\s+/g, ' ').trim();
}

function truncate(input = '', maxLength = 280) {
  if (input.length <= maxLength) return input;
  return `${input.slice(0, maxLength - 3)}...`;
}

module.exports = {
  stripHtml,
  truncate
};
