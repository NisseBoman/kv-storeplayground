/// <reference types="@fastly/js-compute" />
import { includeBytes } from "fastly:experimental";
//import { get } from "http";
import { CacheOverride } from "fastly:cache-override";
//import { Console } from "console";
import { KVStore } from "fastly:kv-store";


let IndexPage = includeBytes("./src/index.html"); 


addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

//{kv-value}

async function handleRequest(event) {
  

  // Get the client request.
  let req = event.request;

  // Filter requests that have unexpected methods.
  if (!["HEAD", "GET", "PURGE"].includes(req.method)) {
    return new Response("This method is not allowed", {
      status: 405,
    });
  }

  let url = new URL(req.url);

  // If request is to the `/` path...
  if (url.pathname == "/") {

    // Connect to the KV store
    const files = new KVStore('testing');
    

    const entry = await files.get('magenta');
    let tmpValue = await entry.text();

    var tmpstring = new TextDecoder().decode(IndexPage);
    tmpstring = tmpstring.replace("{kv-value}", tmpValue);

  }

  return new Response(tmpstring, {
    status: 200,
    headers: new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=432000" }),
  });
}
