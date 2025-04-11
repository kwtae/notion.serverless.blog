let nextCursor = null;
let isLoading = false;
const container = document.getElementById("post-list");

async function fetchPosts(lang = 'ko', cursor = null) {
  if (isLoading) return;
  isLoading = true;
  showLoading();

  const res = await fetch(`/api/fetchNotionData?lang=${lang}${cursor ? `&cursor=${cursor}` : ''}`);
  const data = await res.json();

  renderPosts(data.posts);
  nextCursor = data.nextCursor;

  toggleLoadMoreButton(nextCursor !== null);
  hideLoading();
  isLoading = false;
}

function renderPosts(posts) {
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

function toggleLoadMoreButton(show) {
  document.getElementById("load-more").style.display = show ? 'block' : 'none';
}

function showLoading() {
  document.getElementById("loading").style.display = 'block';
}
function hideLoading() {
  document.getElementById("loading").style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => fetchPosts());

window.loadNextPage = () => {
  if (nextCursor) fetchPosts('ko', nextCursor);
};
