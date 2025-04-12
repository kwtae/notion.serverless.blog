
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== process.env.EDITOR_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, content, date, lang } = req.body;
  const databaseId = '1d2207bcc6ba8085aea4cba983df5edb';

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ text: { content: title } }]
        },
        Content: {
          rich_text: [{ text: { content: content } }]
        },
        Date: {
          date: { start: date }
        },
        Language: {
          select: { name: lang }
        }
      }
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
