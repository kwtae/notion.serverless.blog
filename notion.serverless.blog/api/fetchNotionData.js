
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

module.exports = async (req, res) => {
  const databaseId = '1d2207bcc6ba8085aea4cba983df5edb';
  const lang = req.query.lang || 'ko';
  const cursor = req.query.cursor;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor || undefined,
      page_size: 5,
      filter: {
        property: 'Language',
        select: { equals: lang }
      },
      sorts: [{ property: 'Date', direction: 'descending' }]
    });

    res.status(200).json({
      posts: response.results,
      nextCursor: response.has_more ? response.next_cursor : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
