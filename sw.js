// code load startegies : ... install , clear , fetch  ,..
let cachname="static-cache";
let cachedassets=[
    './index.html',
    './contact.html',
    './UP/1.jpg',
    './UP/2.jpg',
    './style.css',
    './fallback.json'
];



// install :  event with service worker : write caches 

self.addEventListener('install',async function(){

    console.log('From Install');
    // write cache files :
    // use caches api : open (create) | match () , delete , keys , put :  caches API
    // create cache file use caches.open
    let createdcache=await caches.open(cachname);
    // 
    await createdcache.addAll(cachedassets);
    // call skiWaiting from serbice worker object
    await self.skipWaiting();
});//end of install event 

// activate : clear cach
self.addEventListener('activate',async function(){
console.log('From activate');
// delete ununsed caches : 
// get all keys for all cahces :
// let allcaches = await caches.keys();
// for(let i=0; i < allcaches.length;i++){
//     if(allcaches[i]!=cachname){
//         await caches.delete(allcaches[i]);
//     }
// }
});//end of actiavte

// fetch :  fetch : From cach , or from netwrok
self.addEventListener('fetch',async function(event){
    // console.log('From Fetch',event.request);
    // by default from netwrok :
    // respond with caches : 

    // strategy : cach first : online or offline : respond with cach
    // return await event.respondWith(caches.match(event.request));// in case : connected : online : load data from netwrok : else load data from cache

    // check connectivity : online or offline 
    if(!navigator.onLine)
    {
                // incase offline : respond from cach()
                // return await event.respondWith(caches.match(event.request));
                return await event.respondWith(cachefirst(event.request));// cachfirst


    }else{
        //return await event.respondWith(fetch(event.request));// netwrok : online : create cach-dynamic (put all requests )
        return await event.respondWith(netwrokfirst(event.request));

    }
    // incase online : respond from netwrok

    

});


async function cachefirst(req){
    return await caches.match(req)||await caches.match('fallback.json');
}
async function netwrokfirst(req){
    // return await caches.match(req);
    // create dynamic cach : put any request plus response
    let dynamiccache = await caches.open('dynamic-cache');
    // fetch response for current passed req
    let resp=await fetch(req);
    // pust req plus resp inside dynamic cach
    await dynamiccache.put(req,resp.clone());
    return resp;





}


