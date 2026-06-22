const state = {
  data: null,
  activeSection: "all"
};

const contentEl = document.getElementById("content");
const filtersEl = document.getElementById("filters");
const subtitleEl = document.getElementById("subtitle");
const editionDateEl = document.getElementById("editionDate");
const itemCountEl = document.getElementById("itemCount");

function setActiveFilter(button) {
  document.querySelectorAll(".pill").forEach((el) => el.classList.remove("active"));
  button.classList.add("active");
}

function formatSectionCount(count) {
  return `${count} item${count === 1 ? "" : "s"}`;
}

function renderFilters() {
  const sections = state.data?.sections ?? [];
  filtersEl.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.className = "pill active";
  allButton.type = "button";
  allButton.textContent = "All";
  allButton.addEventListener("click", () => {
    state.activeSection = "all";
    setActiveFilter(allButton);
    renderContent();
  });
  filtersEl.appendChild(allButton);

  sections.forEach((section) => {
    const btn = document.createElement("button");
    btn.className = "pill";
    btn.type = "button";
    btn.textContent = section.title;
    btn.addEventListener("click", () => {
      state.activeSection = section.title;
      setActiveFilter(btn);
      renderContent();
    });
    filtersEl.appendChild(btn);
  });
}

function renderContent() {
  const sections = state.data?.sections ?? [];
  const visibleSections =
    state.activeSection === "all"
      ? sections
      : sections.filter((section) => section.title === state.activeSection);

  contentEl.innerHTML = "";

  if (!visibleSections.length) {
    const empty = document.createElement("section");
    empty.className = "section-card";
    empty.innerHTML = `<div class="empty">No items in this section.</div>`;
    contentEl.appendChild(empty);
    itemCountEl.textContent = "0 items";
    return;
  }

  let totalItems = 0;

  visibleSections.forEach((section) => {
    const sectionCard = document.createElement("section");
    sectionCard.className = "section-card";

    const items = Array.isArray(section.items) ? section.items : [];
    totalItems += items.length;

    const head = document.createElement("div");
    head.className = "section-head";

    const title = document.createElement("h2");
    title.textContent = section.title;

    const count = document.createElement("span");
    count.className = "section-count";
    count.textContent = formatSectionCount(items.length);

    head.appendChild(title);
    head.appendChild(count);
    sectionCard.appendChild(head);

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No items added yet.";
      sectionCard.appendChild(empty);
      contentEl.appendChild(sectionCard);
      return;
    }

    const list = document.createElement("ol");
    list.className = "news-list";

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "news-item";

      const rank = document.createElement("div");
      rank.className = "rank";
      rank.textContent = String(index + 1).padStart(2, "0");

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("a");
      title.className = "card-title";
      title.href = item.url || "#";
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = item.title || "Untitled";

      body.appendChild(title);

      const metaRow = document.createElement("div");
      metaRow.className = "meta-row";

      if (item.source) {
        const source = document.createElement("span");
        source.className = "source";
        source.textContent = item.source;
        metaRow.appendChild(source);
      }

      if (item.tag) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = item.tag;
        metaRow.appendChild(tag);
      }

      if (metaRow.childNodes.length) {
        body.appendChild(metaRow);
      }

      if (item.summary) {
        const summary = document.createElement("p");
        summary.className = "summary";
        summary.textContent = item.summary;
        body.appendChild(summary);
      }

      li.appendChild(rank);
      li.appendChild(body);
      list.appendChild(li);
    });

    sectionCard.appendChild(list);
    contentEl.appendChild(sectionCard);
  });

  itemCountEl.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
}

async function init() {
  try {
    const response = await fetch("./news.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load news.json (${response.status})`);
    }

    const data = await response.json();
    state.data = data;

    if (data.edition) editionDateEl.textContent = data.edition;
    if (data.subtitle) subtitleEl.textContent = data.subtitle;

    renderFilters();
    renderContent();
  } catch (error) {
    contentEl.innerHTML = `
      <section class="section-card">
        <div class="empty">
          Could not load <strong>news.json</strong>. Check that the file exists in the repo root and that the JSON is valid.
        </div>
      </section>
    `;
    itemCountEl.textContent = "0 items";
    console.error(error);
  }
}

init();
