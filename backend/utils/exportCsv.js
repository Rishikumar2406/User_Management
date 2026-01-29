const { Parser } = require("json2csv");

module.exports = (res, data) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment("users.csv");
  return res.send(csv);
};
