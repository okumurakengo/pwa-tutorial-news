const apiKey = "56c3331a86d2409d80aac481157e190f";
const main = document.querySelector("main")
const sourceSelector = document.querySelector("#sourceSelector")
const defaultSource = "the-washington-post";

(async () => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener("change", e => {
        updateNews(e.target.value)
    })

    if ("serviceWorker" in navigator) {
        try {
            navigator.serviceWorker.register("sw.js")
            console.log("SW registered")
        } catch (e) {
            console.log("SW faild")
        }
    }
})();

async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    const json = await res.json()
    
    sourceSelector.innerHTML = json.sources
        .map(src => `<option value="${src.id}">${src.name}</option>`)
        .join("\n")
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${source}&from=2019-06-10&sortBy=publishedAt&apiKey=${apiKey}`)
    const json = await res.json()

    main.innerHTML = json.articles.map(createArticle).join("\n")
}

function createArticle(article) {
    return `
        <div class="article">
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}">
                <p>${article.description}</p>
            </a>
        </div>
    `
}
