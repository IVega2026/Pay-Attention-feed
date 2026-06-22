const content = document.getElementById("content");
const filters = document.getElementById("filters");

fetch("./news.json")
  .then(r => r.json())
  .then(data => {

    document.getElementById("editionDate").innerText =
      data.edition;

    let total = 0;

    data.sections.forEach(s => total += s.items.length);

    document.getElementById("itemCount").innerText =
      total + " stories";

    createFilters(data.sections);
    renderSections(data.sections);

  });

function createFilters(sections){

  const allBtn = document.createElement("button");
  allBtn.className="filter-btn active";
  allBtn.innerText="All";

  allBtn.onclick = () => {
    document.querySelectorAll(".filter-btn")
      .forEach(b=>b.classList.remove("active"));

    allBtn.classList.add("active");
    renderSections(sections);
  };

  filters.appendChild(allBtn);

  sections.forEach(section=>{

    const btn=document.createElement("button");

    btn.className="filter-btn";
    btn.innerText=section.title;

    btn.onclick=()=>{

      document.querySelectorAll(".filter-btn")
        .forEach(b=>b.classList.remove("active"));

      btn.classList.add("active");

      renderSections([section]);
    };

    filters.appendChild(btn);

  });

}

function renderSections(sections){

  content.innerHTML="";

  sections.forEach(section=>{

    const wrapper=document.createElement("section");

    wrapper.className="section";

    wrapper.innerHTML=`
      <div class="section-header">
        <h2>${section.title}</h2>
        <span>${section.items.length} items</span>
      </div>
    `;

    section.items.forEach((item,index)=>{

      wrapper.innerHTML += `
        <div class="news-item">
          <div class="rank">${String(index+1).padStart(2,"0")}</div>

          <div>
            <a class="title" href="${item.url}" target="_blank">
              ${item.title}
            </a>

            <div class="source">
              ${item.source}
            </div>

            <div class="summary">
              ${item.summary}
            </div>
          </div>
        </div>
      `;

    });

    content.appendChild(wrapper);

  });

}
