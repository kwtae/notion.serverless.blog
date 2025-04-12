
let nextCursor = null;
let isLoading = false;

async function fetchPosts(lang = 'ko', cursor = null) {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loading").style.display = "block";

  const res = await fetch(`/api/fetchNotionData?lang=${lang}${cursor ? `&cursor=${cursor}` : ''}`);
  const data = await res.json();

  data.posts.forEach(post => {
    const title = post.properties.Title.title[0]?.plain_text || '';
    const content = post.properties.Content.rich_text.map(t => t.plain_text).join(' ');
    const date = post.properties.Date?.date?.start || '';

    const el = document.createElement("div");
    el.innerHTML = `<h3>${title}</h3><p>${date}</p><p>${content}</p><hr>`;
    document.getElementById("post-list").appendChild(el);
  });

  nextCursor = data.nextCursor;
  document.getElementById("load-more").style.display = nextCursor ? "block" : "none";
  document.getElementById("loading").style.display = "none";
  isLoading = false;
}

function loadNextPage() {
  if (nextCursor) fetchPosts('ko', nextCursor);
}

document.addEventListener("DOMContentLoaded", () => fetchPosts());
