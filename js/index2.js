const mouse = document.querySelector(".cursor");
const main = document.querySelector("main");
const key = "Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU";
const form = document.querySelector(".search-form");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

//Cursor
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
  let xPosition = e.pageX + "px";
  let yPosition = e.pageY + "px";

  let width = Math.min(window.innerWidth / 10, 150) + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.tagName == "A" || item.tagName == "BUTTON") {
    gsap.to(mouse, 0.5, {
      border: "1rem double white",
      padding: "1.5rem",
    });
  } else if (item.tagName == "INPUT") {
    gsap.to(mouse, 0.5, {
      border: "1rem double black",
      padding: "1.5rem",
    });
  } else {
    gsap.to(mouse, 0.5, {
      border: "1rem solid white",
      padding: 0,
    });
  }
}

//Form

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

//API
//api.nytimes.com/svc/topstories/v2/arts.json?api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU
//api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=yourkey
async function fetchApi() {
  const dataFetch = await fetch(
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        //Authorization: auth,
      },
    }
  );
  const data = await dataFetch.json();
  return data;
}

async function useData() {
  const data = await fetchApi();
  //console.log(data);
  generateArticle(data);
}

useData();

function generateArticle(data) {
  const results = data.response.docs;
  results.forEach((result) => {
    console.log(results);
    const resultImg = result.multimedia[0].url;
    const article = document.createElement("div");
    article.classList.add("article");
    article.innerHTML = `
    <h1>${result.headline.main}</h1>    
    <div class="info">
    <img src="https://static01.nyt.com/${resultImg}"></img>
    <p>${result.abstract}</p>
    <div class="credit">
    <h2>${result.byline.original}</h2>
    <a href="${result.web_url}" target="_blank">Link</a>
    </div>
    </div>
        `;
    main.appendChild(article);
  });
}

//Event Listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
