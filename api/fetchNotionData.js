const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

module.exports = async (req, res) => {
  const dbId = "1d2207bcc6ba8085aea4cba983df5edb";
  const lang = req.query.lang || "ko";
  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Language",
        select: { equals: lang }
      },
      sorts: [{ property: "Date", direction: "descending" }]
    });
    res.status(200).json(response.results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};