const api = [
  {"name": "Revision Plan", "url": "https://docs.google.com/document/d/1uQWECI6QcetzX6gvcQ4YMCCDdTTYl5PSwnFvN04-78s/edit"},
  {"name" : "Link name2", "url": "https://linkurl1"},
  {"name" : "Link name3" , "url" : "https://linkurl3"},
  {"name" : "Link name4", "url" : "https://linkurl4"}
  ]
const staticPage = "https://static-links-page.signalnerve.workers.dev"
const profileImg = "https://lh3.googleusercontent.com/mg8UyDYFyu-8AaFhARoziojePHvFvT8FKDbeW7GuyszM1WyHo-mSKX2uuyrnkOVIScLcI84=s85"
class ElementHandler {
  constructor(links) {
    this.links = links
  }
  element(element) {
    if(element.tagName === 'div' && element.getAttribute('id') === 'links'){
      api.forEach(item => element.append('<a href="'+item.url+'">'+item.name+'</a><br/>', {"html": true}));
    }

    if(element.tagName === 'div' && element.getAttribute('id') === 'profile'){
      const attribute = element.getAttribute(this.links)
      if (attribute) {
        element.removeAttribute(this.links)
      }
    }

    if(element.tagName === 'div' && element.getAttribute('id') === 'social'){
      const attribute = element.getAttribute(this.links)
      if (attribute) {
        element.removeAttribute(this.links)
      }
      element.append('<div id="links"><a href="https://simpleicons.org/icons/elixir.svg"></a></div>', {"html": true});
       element.append('<div id="links"><a href="https://simpleicons.org/icons/slack.svg"></a></div>', {"html": true});
        element.append('<div id="links"><a href="https://simpleicons.org/icons/itunes.svg"></a></div>', {"html": true});
    }

    if(element.tagName === 'h1' && element.getAttribute('id') === 'name'){
      element.setInnerContent(this.links)
    }

    if(element.tagName === 'title'){
      element.setInnerContent(this.links)
    }

    if(element.tagName === 'body'){
      const attribute = element.getAttribute(this.links)
      if (attribute) {
        element.setAttribute(this.links, 'bg-indigo-900')
      }
    }

     if(element.tagName === 'img' && element.getAttribute('id') === 'avatar'){
        element.setAttribute(this.links, profileImg)
    }
   
  }
}
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }  else {
    return await response.text()
  }
}

const rewriter = new HTMLRewriter()
  .on('div#links', new ElementHandler('links'))
  .on('div#profile', new ElementHandler('style'))
  .on('h1#name', new ElementHandler('Soumya Purohit'))
  .on('title', new ElementHandler('Soumya Purohit'))
  .on('div#social', new ElementHandler('style'))
  .on('body', new ElementHandler('class'))
  .on('img#avatar', new ElementHandler('src'))

async function handleRequest(request) {
 const url = new URL(request.url)
 const { pathname } = url
 if(pathname == '/links') {
   const json = JSON.stringify(api, null, 2)
   return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
 }
 const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    }
  }
  const output = await fetch(staticPage, init)
  const results = await gatherResponse(output)
  const res = new Response(results, init);
  return rewriter.transform(res)
}
addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
