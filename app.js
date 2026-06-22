fetch('news.json')
  .then(response => response.json())
  .then(data => {

    document.getElementById("editionDate").innerText =
      `Edition: ${data.date}`;

    const container = document.getElementById("content");

    data.sections.forEach(section => {

      const sectionElement = document.createElement("section");

      sectionElement.innerHTML = `
        <h2>${section.title}</h2>
      `;

      section.items.forEach(item => {

        const div = document.createElement("div");

        div.className = "news-item";

        div.innerHTML = `
          <a href="${item.url}" target="_blank">
            ${item.title}
          </a>
          <br>
          <span class="source">${item.source}</span>
          <p class="summary">${item.summary}</p>
        `;

        sectionElement.appendChild(div);

      });

      container.appendChild(sectionElement);

    });

  });
