const mouse = document.querySelector(".cursor");
const main = document.querySelector("#main");
const key = "Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU";
const form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const next = document.querySelector("#next-pg");
const previous = document.querySelector("#prev-pg");
let searchValue;
let page = 0;
let currentSearch = "election";
let query;

/////
//Text Animation
/////

gsap.to(".slide", 2, { x: "100%", delay: 1 });
gsap.to("#logo", 1, { opacity: 1, delay: 1.5 });

/////
//Cursor
/////

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
//Event Listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
next.addEventListener("click", nextPage);
previous.addEventListener("click", prevPage);

/////
//Form
/////

searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchArticles(searchValue);
});

/////
//API
/////

function updateInput(e) {
  searchValue = e.target.value;
}

const electionUrl =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&page=0&api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU";

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      //Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generateArticle(data) {
  const results = data.response.docs;
  //console.log(results);
  results.forEach((result) => {
    let title;
    let image;
    if (result.headline.print_headline) {
      title = result.headline.print_headline;
    } else {
      title = result.headline.main;
    }

    //Uncaught (in promise) TypeError: result.multimedia[0] is undefined

    try {
      image = result.multimedia[0].url;
      //if (typeof image == "undefined") throw "image undefined";
    } catch (err) {
      console.log("error is " + err);
    }

    const article = document.createElement("div");
    article.classList.add("article");
    article.innerHTML = `
    <h1>${title}</h1>    
    <div class="info">
    <img src="https://static01.nyt.com/${image}"></img>
    <p>${result.abstract}</p>
    <div class="credit">
    <h2>${result.byline.original}</h2>
    <p>${result.pub_date.slice(0, 10)}</p>
    <a href="${result.web_url}" target="_blank">Link</a>
    </div>
    </div>
        `;
    main.appendChild(article);
  });
}

async function defaultLoad() {
  const data = await fetchApi(electionUrl);
  generateArticle(data);
  console.log("default executed");
}

async function searchArticles(query) {
  clear();
  let searchUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU`;
  const data = await fetchApi(searchUrl);
  generateArticle(data);
  console.log("search executed");
}

function clear() {
  main.innerHTML = "";
  searchInput.value = "";
  console.log("clear executed");
}

async function nextPage() {
  page++;
  clear();
  console.log("next executed");
  let searchUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentSearch}&page=${page}&api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU`;
  const data = await fetchApi(searchUrl);
  generateArticle(data);
}

async function prevPage() {
  if (page > 0) {
    page--;
  }
  clear();
  console.log("previous executed");
  let searchUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentSearch}&page=${page}&api-key=Z1VKpFMhlXrjqkDhhqKGTrpBFeNDnixU`;
  const data = await fetchApi(searchUrl);
  generateArticle(data);
}

defaultLoad();
