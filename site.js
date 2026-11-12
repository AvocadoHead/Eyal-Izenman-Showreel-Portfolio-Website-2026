import {mountEiScrollGallery} from './ei-scroll-gallery.js';
import {mountFullFilmViewer,bindFullFilmIndex} from './full-film-viewer.js';
const journey=document.querySelector('#journey'),host=document.querySelector('#gallery'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fallback=()=>{document.body.classList.add('gallery-fallback');document.querySelector('.intro-foot span:last-child').textContent='EXPLORE THE WORKS BELOW';};
let gallery;
const catalog=await fetch('./full-film-catalog.json').then(r=>{if(!r.ok)throw Error('Film catalog unavailable');return r.json();});
const viewer=mountFullFilmViewer(catalog,{assetBase:'./',onOpen:()=>gallery?.setPaused(true),onClose:()=>gallery?.setPaused(false)});
bindFullFilmIndex(document.querySelector('#work-index'),viewer,catalog);
try{if(new URLSearchParams(location.search).get('view')==='classic'||reduced){fallback();}else gallery=await mountEiScrollGallery(host,{THREE:window.THREE,assetBase:'./',scrollRoot:journey,maxPixelRatio:1.5,reducedMotion:reduced,onOpenWork:work=>viewer.open(work.id),onError:fallback,onProgress:({progress,chapter})=>{
 document.querySelector('#progress-bar').style.transform=`scaleX(${progress})`;
 if(chapter){document.querySelector('#chapter-num').textContent=chapter.id+' / 04';document.querySelector('#chapter-name').textContent=chapter.title;document.querySelector('#chapter-detail').textContent=chapter.detail;document.querySelectorAll('[data-progress]').forEach((b,i)=>b.setAttribute('aria-current',Number(chapter.id)===i+1?'true':'false'));}
}});}catch(e){fallback();}
document.querySelectorAll('[data-progress]').forEach(b=>b.addEventListener('click',()=>{const p=Number(b.dataset.progress);scrollTo({top:journey.offsetTop+p*(journey.offsetHeight-innerHeight),behavior:reduced?'instant':'smooth'});}));
document.querySelector('#view-switch').addEventListener('click',()=>document.querySelector('#work-index').scrollIntoView({behavior:reduced?'instant':'smooth'}));
const clips=[...document.querySelectorAll('.work video')];clips.forEach(v=>v.addEventListener('play',()=>clips.forEach(other=>{if(other!==v)other.pause();})));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:0.05});clips.forEach(v=>observer.observe(v));
document.addEventListener('visibilitychange',()=>{if(document.hidden)clips.forEach(v=>v.pause());});
