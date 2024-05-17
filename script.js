window.addEventListener('load', runScript);

async function runScript() {
  const strategiesResponse = await fetch('./strategies.json')
    .then(response => response.json()).then(json => json);

  console.log({
    strategiesResponse
  })
}
