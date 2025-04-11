async function fetchPosts(lang = 'ko') {
  const res = await fetch(`/api/fetchNotionData?lang=${lang}`);
  const posts = await res.json();
  console.log("Fetched posts:", data);
  renderPosts(posts);
}

function renderPosts(posts) {
  const container = document.getElementById('post-list');
  container.innerHTML = '';
  posts.forEach(post => {
    const title = post.properties.Title.title[0]?.text.content || '';
    const tags = post.properties.Tags.multi_select.map(t => t.name).join(', ');
    const date = post.properties.Date.date.start;
    const content = post.properties.Content.rich_text.map(t => t.text.content).join('');
    const imageUrl = post.properties.Image?.files?.[0]?.file?.url || '';

    const el = document.createElement('div');
    el.className = "post-card";
    el.innerHTML = `
      <h3>${title}</h3>
      <p>${date} | Tags: ${tags}</p>
      <p>${content}</p>
      ${imageUrl ? `<img src="${imageUrl}" alt="image" style="max-width:100%">` : ""}
    `;
    container.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => fetchPosts());
