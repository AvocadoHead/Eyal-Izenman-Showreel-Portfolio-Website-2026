// Generated from the user-owned cut3 source; no reel file is changed.
// Dependency: Three.js r158 (injected options.THREE, or dynamically loaded).
const sat=x=>Math.min(1,Math.max(0,x));
const lerp=(a,b,k)=>a+(b-a)*k;
const INTRO_EXTENSION=5,TB=20,TE=77.5,ZC=-279;
export const GALLERY_RANGE=Object.freeze({start:TB,end:TE});
export const GALLERY_CHAPTERS=Object.freeze([
  {start:20,id:'01',title:'AI FILMS',detail:'concept · direction · generation · edit'},
  {start:41.2,id:'02',title:'COMMERCIAL',detail:'Normande · Customer Success Hub · Osher Ad'},
  {start:55.2,id:'03',title:'ART',detail:'stills · series · watercolours'},
  {start:68.6,id:'04',title:'CODE & TOOLS',detail:'Aether Gallery · The 3D Book · Simpler · this reel'}
]);
const KEYS=[[15,-3,2.4,14, 0,1.6,0],[17.5,0,2.6,2, 0,2.6,-20],[19,0,2.6,-10, 0,2.6,-38],[23,.9,2.6,-34, 0,2.6,-60],[27,-.9,2.6,-58, 0,2.6,-84],[31,.9,2.6,-82, 0,2.6,-108],
 [34.5,0,2.6,-103, 0,2.7,-130],[37.5,0,3,-126, 0,3.6,-152],[41,-3.6,2.8,-132.5, -10.4,3.6,-148.3],[45,3.6,2.8,-133.5, 10.4,3.6,-148.3],[47.6,0,8.8,-146, 0,3,-190],
 [50,0,4,-186, 0,2.6,-224],[52,0,2.7,-215, 0,2.5,-224],[54.25,0,2.7,-215, 9,2.5,-215],[56.5,0,2.7,-215, 0,2.5,-206],[58.75,0,2.7,-215, -9,2.5,-215],[61,0,2.7,-215, 0,2.5,-224],
 [63,0,3.2,-240, 0,2,-276],[66,-7,4.6,-262, 0,2.2,-279],[71,7,3.4,-265, 0,2.4,-280],[73.6,0,3.2,-300, 0,2,-335],[76.2,-2.6,2.4,-320.6, 0,1.6,-335],[84,-1.2,2.55,-321, 0,1.6,-335]].map(key=>[key[0]+INTRO_EXTENSION,...key.slice(1)]);
const _k=new Float32Array(6);
function camAt(t,o){let i=0;while(i<KEYS.length-2&&t>=KEYS[i+1][0])i++;const a=KEYS[Math.max(0,i-1)],b=KEYS[i],c=KEYS[i+1],d=KEYS[Math.min(KEYS.length-1,i+2)];
  const u=sat((t-b[0])/(c[0]-b[0])),u2=u*u,u3=u2*u;
  for(let k=0;k<6;k++){const p0=a[k+1],p1=b[k+1],p2=c[k+1],p3=d[k+1];o[k]=.5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u2+(-p0+3*p1-3*p2+p3)*u3);}}
const FILMS=['The Flower Heads','Les Muses Géantes','Surreal','Puzzlement','Waiting at a Bus Stop','SinCity SimCity',"What's Inside the Stone?",'Nabi the Rabbit','A Friendly Advice to a Lot of Young Men','Surreal — Sora','Surrealness','Surreal — second excerpt'];
// Give each corridor work a short held look, with eased turns between screens.
// Shot times follow the existing travel speed; the camera's position and flock route stay intact.
const FILM_SHOTS=FILMS.map((name,i)=>{
  const z=-22-8*i,view=new Float32Array(6);let lo=17.5+INTRO_EXTENSION,hi=36.2+INTRO_EXTENSION;
  for(let n=0;n<28;n++){const mid=(lo+hi)/2;camAt(mid,view);if(view[2]>z+15)lo=mid;else hi=mid;}
  return {t:(lo+hi)/2,x:(i%2?1:-1)*5.6,y:2.7,z};
});
function smoothLook(x){x=sat(x);return x*x*x*(x*(x*6-15)+10);}
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
  const CAMERA_DEFAULTS=Object.freeze({
    gazeSigma:.60,anticipation:.12,anticipationVariation:.018,
    filmEnter:1.8,filmExit:1.65,filmExitDelay:.20,
    filmX:.72,filmXSecondary:.12,filmY:.12,filmYSecondary:.025,filmPeriod:10.8,filmFade:1.8,
    artX:1.65,artXSecondary:.20,artZ:.78,artZSecondary:.12,artPeriod:10.7,artFade:1.5,
    artStartOffset:37,artEndOffset:46
  });
  function createCamera(options){
    if(!options||!Array.isArray(options.shots)||options.shots.length<2)throw new TypeError('At least two source-time film shots are required');
    const shots=options.shots.map(s=>({t:Number(s.t),x:Number(s.x),y:Number(s.y),z:Number(s.z)}));
    if(shots.some((s,i)=>![s.t,s.x,s.y,s.z].every(Number.isFinite)||(i&&s.t<=shots[i-1].t)))
      throw new RangeError('Film shot times must be finite and strictly increasing');
    const d=Object.freeze({...CAMERA_DEFAULTS,...options.config});
    const first=shots[0].t,last=shots[shots.length-1].t,bodyStart=options.bodyStart===undefined?20:options.bodyStart;
    const artStart=bodyStart+d.artStartOffset,artEnd=bodyStart+d.artEndOffset;
    const enter=t=>smooth((t-first+d.filmEnter)/d.filmEnter);
    const exit=t=>1-smooth((t-last-d.filmExitDelay)/d.filmExit);
    function gaze(t){
      const anticipate=d.anticipation+d.anticipationVariation*Math.sin((t-first)*.43+.35);
      const sample=t+anticipate,weights=shots.map(s=>Math.exp(-.5*((sample-s.t)/d.gazeSigma)**2));
      let sum=0,x=0,y=0,z=0;
      weights.forEach((weight,i)=>{sum+=weight;x+=shots[i].x*weight;y+=shots[i].y*weight;z+=shots[i].z*weight;});
      if(sum<1e-14){const s=sample<first?shots[0]:shots[shots.length-1];return [s.x,s.y,s.z];}
      // The curve lifts by less than a tenth of a world unit; it never nods on beats.
      return [x/sum,y/sum+.055*Math.sin((t-first)*.51+.2),z/sum];
    }
    function look(t,view){
      const film=enter(t)*exit(t);
      if(film>0){const target=gaze(t);for(let i=0;i<3;i++)view[i+3]=lerp(view[i+3],target[i],film);}
      const art=smooth((t-artStart)/d.artFade)*(1-smooth((t-artEnd+d.artFade)/d.artFade));
      if(art>0){
        const u=clamp((t-artStart)/(artEnd-artStart));
        // A continuous orbit replaces four cardinal-direction targets in the round room.
        // Mild phase variation changes the cadence without introducing stops or reversals.
        const phase=2*Math.PI*(u+.014*Math.sin(2*Math.PI*u));
        const target=[12.5*Math.sin(phase),2.5,-215-12.5*Math.cos(phase)];
        for(let i=0;i<3;i++)view[i+3]=lerp(view[i+3],target[i],art);
      }
      return view;
    }
    function drift(t,view){
      const film=smooth((t-first+d.filmFade)/d.filmFade)*(1-smooth((t-last)/d.filmFade));
      if(film>0){
        const p=(t-first)*2*Math.PI/d.filmPeriod,phase=p+.15*Math.sin(.43*p+.3);
        view[0]+=(d.filmX*Math.sin(phase)+d.filmXSecondary*Math.sin(1.61*p+.8))*film;
        view[1]+=(d.filmY*Math.sin(2*phase+.24)+d.filmYSecondary*Math.sin(.71*p-.3))*film;
      }
      const art=smooth((t-artStart)/d.artFade)*(1-smooth((t-artEnd+d.artFade)/d.artFade));
      if(art>0){
        const p=(t-artStart)*2*Math.PI/d.artPeriod,phase=p+.22*Math.sin(.5*p+.4);
        view[0]+=(d.artX*Math.sin(phase)+d.artXSecondary*Math.sin(1.43*p-.5))*art;
        view[2]+=(d.artZ*Math.sin(2*phase+.34)+d.artZSecondary*Math.sin(.67*p+.2))*art;
      }
      return view;
    }
    return Object.freeze({look,drift,gaze,config:d,intervals:{film:[first-d.filmEnter,last+d.filmExitDelay+d.filmExit],art:[artStart,artEnd]},
      bounds:{filmX:d.filmX+d.filmXSecondary,filmY:d.filmY+d.filmYSecondary,filmZ:0,artX:d.artX+d.artXSecondary,artZ:d.artZ+d.artZSecondary}});
  }


const CUT4_CAMERA=createCamera({shots:FILM_SHOTS,bodyStart:TB});
const GALLERY_DRIFT=CUT4_CAMERA.config;
function galleryLook(t,view){return CUT4_CAMERA.look(t,view);}
function galleryDrift(t,view){return CUT4_CAMERA.drift(t,view);}

export {FILMS as FILM_TITLES,GALLERY_DRIFT,FILM_SHOTS};
export function galleryView(progress,options={}){
  const t=lerp(TB,TE,sat(Number(progress)||0)),view=new Float64Array(6);
  camAt(t,view);galleryLook(t,view);
  if(!options.reducedMotion)galleryDrift(t,view);
  return {time:t,position:Array.from(view.slice(0,3)),target:Array.from(view.slice(3))};
}
export function chapterAt(progress){
  const t=lerp(TB,TE,sat(Number(progress)||0));
  return GALLERY_CHAPTERS.reduce((current,chapter)=>t>=chapter.start?chapter:current,GALLERY_CHAPTERS[0]);
}
// A tap must finish on the same work, without scrolling or camera travel.
export function createTapGate(config={}){
  const maxDistance=config.maxDistance??8,maxDuration=config.maxDuration??550,progressTolerance=config.progressTolerance??.002;
  let down=null;
  const valid=e=>e&&e.isPrimary!==false&&(e.button===undefined||e.button===0)&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)&&!e.ctrlKey&&!e.metaKey&&!e.altKey;
  const stamp=e=>Number.isFinite(e.timeStamp)?e.timeStamp:performance.now();
  return {
    begin(e,meta={}){
      down=null;
      if(!valid(e)||!meta.hitId)return false;
      down={id:e.pointerId,x:e.clientX,y:e.clientY,time:stamp(e),epoch:meta.epoch,progress:meta.progress,hitId:meta.hitId};
      return true;
    },
    move(e){if(down&&e.pointerId===down.id&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>maxDistance)down=null;},
    cancel(){down=null;},
    end(e,meta={}){
      const start=down;down=null;
      if(!start||!valid(e)||e.pointerId!==start.id||start.hitId!==meta.hitId||start.epoch!==meta.epoch)return false;
      const elapsed=stamp(e)-start.time;
      return elapsed>=0&&elapsed<=maxDuration&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<=maxDistance&&
        Number.isFinite(meta.progress)&&Math.abs(meta.progress-start.progress)<=progressTolerance;
    }
  };
}

const DEFAULT_THREE_URLS=[
  'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js',
  'https://unpkg.com/three@0.158.0/build/three.module.js'
];
async function resolveThree(options){
  if(options.THREE)return options.THREE;
  if(globalThis.THREE)return globalThis.THREE;
  const urls=options.threeURL?[options.threeURL]:DEFAULT_THREE_URLS;
  let failure;
  for(const url of urls){try{return await import(url);}catch(error){failure=error;}}
  throw failure||new Error('Three.js unavailable');
}
function node(tag,className,text){
  const el=document.createElement(tag);if(className)el.className=className;
  if(text!==undefined)el.textContent=text;return el;
}

// Place host inside a sticky viewport. Scroll is never intercepted or prevented.
// Pass scrollRoot (the tall section), or call setProgress(0..1) yourself.
export async function mountEiScrollGallery(host,options={}){
  if(!host||host.nodeType!==1)throw new TypeError('A gallery host element is required');
  const base=new URL(options.assetBase||'./',document.baseURI);
  if(!base.pathname.endsWith('/'))base.pathname+='/';
  const asset=path=>new URL(path,base).href;
  let destroyed=false,failed=false,raf=0,visible=true,dirty=true,current=0,target=0;
  let lastFrame=0,lastDraw=0,lastVideoSync=-Infinity,renderer,scene,cam,sun,THREE;
  let isReduced=options.reducedMotion===undefined?
    !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches:!!options.reducedMotion;
  let model=null,activeVideos=[],blocked=false,lastChapter='',manualVideoOptIn=false;
  let interactionPaused=false,nearestFilm=null,interactionEpoch=0;
  const tapGate=createTapGate();
  const listeners=[],observers=[],videoRecords=[],ownedTextures=new Set();
  const viewport=node('div','ei-gallery-viewport');
  const status=node('p','ei-gallery-status','Loading gallery…');
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const fallback=node('div','ei-gallery-fallback');fallback.hidden=true;
  const enable=node('button','ei-gallery-enable','Play visible videos');
  enable.type='button';enable.hidden=true;
  const watch=node('button','ei-gallery-watch','Watch full film');
  watch.type='button';watch.hidden=true;watch.setAttribute('aria-haspopup','dialog');
  if(options.dialogId)watch.setAttribute('aria-controls',options.dialogId);
  host.classList.add('ei-scroll-gallery');
  viewport.append(status,enable,watch);host.append(viewport,fallback);
  const on=(el,name,fn,opts)=>{el.addEventListener(name,fn,opts);listeners.push(()=>el.removeEventListener(name,fn,opts));};
  function notify(type,detail){
    host.dispatchEvent(new CustomEvent('ei-gallery:'+type,{detail}));
    if(type==='progress')options.onProgress?.(detail);
    if(type==='error')options.onError?.(detail);
  }
  function addFallbackLink(parent,title,path,isImage){
    const a=node('a','ei-gallery-work');a.href=asset(path);
    if(isImage){const img=node('img');img.loading='lazy';img.src=asset(path);img.alt=title;a.append(img);}
    a.append(node('span',null,title));parent.append(a);
  }
  function buildFallback(){
    if(fallback.childElementCount)return;
    fallback.append(node('p',null,'Explore the works directly.'));
    const films=node('div','ei-gallery-work-list');
    FILMS.forEach((title,i)=>{
      const id='f'+String(i).padStart(2,'0'),path='v/'+id+'.mp4';
      if(typeof options.onOpenWork==='function'){
        const button=node('button','ei-gallery-work ei-gallery-work-button','Watch full film · '+title);
        button.type='button';button.setAttribute('aria-haspopup','dialog');
        on(button,'click',()=>openWork({workId:id,title,path},'fallback'));films.append(button);
      }else addFallbackLink(films,title,path,false);
    });
    ['Normande','Customer Success Hub','Osher Ad'].forEach((title,i)=>
      addFallbackLink(films,title,'v/commercial-2025-'+String(i+1).padStart(2,'0')+'.mp4',false));
    fallback.append(films);
    const art=node('div','ei-gallery-art-grid');
    [0,1,2,3,4,5,6,7,8,9,10,11,12,14,15,16].forEach(n=>
      addFallbackLink(art,'Artwork '+String(n+1).padStart(2,'0'),'art/a'+String(n).padStart(2,'0')+'.jpg',true));
    addFallbackLink(art,'Aether Gallery','art/aether.jpg',true);const aether=art.lastElementChild;aether.href='https://gallery3-d.vercel.app/';aether.target='_blank';aether.rel='noopener';fallback.append(art);
  }
  function workDetail(record,trigger){
    return {id:record.workId,title:record.title,kind:'film',previewSrc:asset(record.path),previewPath:record.path,trigger};
  }
  function setPaused(value=true){
    interactionPaused=!!value;tapGate.cancel();watch.disabled=interactionPaused;enable.disabled=interactionPaused;
    if(interactionPaused){pauseVideos();cancelAnimationFrame(raf);raf=0;lastFrame=0;}
    else{lastVideoSync=-Infinity;wake();}
  }
  function openWork(record,trigger){
    if(destroyed||interactionPaused||!record?.workId||typeof options.onOpenWork!=='function')return false;
    const detail=workDetail(record,trigger);setPaused(true);
    try{
      const opened=options.onOpenWork(detail);
      if(opened===false){setPaused(false);return false;}
      // A returned promise may represent loading, not dialog lifetime: only errors resume.
      if(opened&&typeof opened.then==='function')opened.catch(error=>{
        if(destroyed)return;setPaused(false);notify('workerror',{...detail,message:error?.message||String(error)});
      });
      notify('openwork',detail);return true;
    }catch(error){setPaused(false);notify('workerror',{...detail,message:error?.message||String(error)});return false;}
  }
  function updateWatchControl(){
    const available=nearestFilm&&typeof options.onOpenWork==='function';
    watch.hidden=!available;watch.disabled=interactionPaused;
    if(available){
      watch.textContent='Watch full film · '+nearestFilm.title;
      watch.setAttribute('aria-label','Watch full film: '+nearestFilm.title);
      watch.dataset.workId=nearestFilm.workId;
    }else{delete watch.dataset.workId;}
  }
  function pauseVideos(){
    for(const r of videoRecords){r.wanted=false;r.attempt++;r.video.pause();}
    activeVideos=[];enable.hidden=true;
  }
  function showFallback(reason){
    failed=true;cancelAnimationFrame(raf);raf=0;pauseVideos();buildFallback();
    viewport.hidden=true;fallback.hidden=false;host.dataset.galleryState='fallback';
    notify('error',{message:reason?.message||String(reason||'WebGL unavailable')});
  }
  function wake(){
    dirty=true;
    if(!destroyed&&!failed&&!interactionPaused&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);
  }
  function setProgress(value,{immediate=false}={}){
    target=sat(Number(value)||0);
    if(immediate||isReduced)current=target;
    wake();
  }
  function readScroll(){
    if(!options.scrollRoot)return;
    const rect=options.scrollRoot.getBoundingClientRect();
    const travel=Math.max(1,rect.height-window.innerHeight);
    setProgress(-rect.top/travel);
  }
  function handleVisibility(){
    if(document.hidden||!visible){tapGate.cancel();pauseVideos();cancelAnimationFrame(raf);raf=0;lastFrame=0;}
    else wake();
  }
  function requestVideo(record,userGesture=false){
    if(!record.wanted||record.failed||record.pending||(!record.video.paused))return;
    if(record.blocked&&!userGesture)return;
    const attempt=++record.attempt;record.pending=true;
    const promise=record.video.play();
    Promise.resolve(promise).then(()=>{
      if(destroyed||interactionPaused||!record.wanted||!visible||document.hidden||attempt!==record.attempt)record.video.pause();
      record.blocked=false;
    }).catch(()=>{
      if(attempt===record.attempt&&record.wanted){record.blocked=true;blocked=true;enable.hidden=false;}
    }).finally(()=>{record.pending=false;wake();});
  }
  function createGalleryVideo(path){
    const video=document.createElement('video');
    video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='metadata';
    video.setAttribute('muted','');video.setAttribute('playsinline','');
    if(new URL(asset(path)).origin!==location.origin)video.crossOrigin='anonymous';
    const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;
    const workMatch=path.match(/^v\/(f\d{2})\.mp4$/),workId=workMatch?.[1]||null;
    const record={video,texture,path,workId,title:workId?FILMS[Number(workId.slice(1))]:null,
      wanted:false,pending:false,blocked:false,failed:false,attempt:0,stand:null,screen:null};
    videoRecords.push(record);ownedTextures.add(texture);
    on(video,'loadeddata',wake);on(video,'seeked',wake);on(video,'canplay',wake);
    on(video,'error',()=>{record.failed=true;record.wanted=false;video.pause();
      notify('mediaerror',{path,message:'This clip could not be loaded.'});wake();});
    // No src/network request until the exhibit is near the camera.
    return texture;
  }
  const controller={
    setProgress,setPaused,
    openNearestWork(){return openWork(nearestFilm,'control');},
    refresh(){resize();readScroll();wake();},
    getState(){return {status:destroyed?'destroyed':failed?'fallback':model?'ready':'loading',
      progress:current,target,time:lerp(TB,TE,current),activeVideos:activeVideos.map(r=>r.path),
      reducedMotion:isReduced,paused:interactionPaused,nearestWork:nearestFilm?.workId||null,stats:{stands:model?.stands.length||0,videos:videoRecords.length,birds:0}};},
    showFallback(){showFallback('Static gallery selected');},
    destroy(){
      if(destroyed)return;destroyed=true;tapGate.cancel();nearestFilm=null;cancelAnimationFrame(raf);pauseVideos();
      listeners.splice(0).forEach(fn=>fn());observers.splice(0).forEach(observer=>observer.disconnect());
      for(const r of videoRecords){r.video.removeAttribute('src');r.video.load();}
      const geometries=new Set(),materials=new Set(),textures=new Set(ownedTextures);
      scene?.traverse(object=>{
        if(object.geometry)geometries.add(object.geometry);
        for(const m of (Array.isArray(object.material)?object.material:[object.material])){
          if(!m)continue;materials.add(m);
          for(const value of Object.values(m))if(value?.isTexture)textures.add(value);
        }
      });
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
      renderer?.dispose();viewport.remove();fallback.remove();host.classList.remove('ei-scroll-gallery');
    }
  };
  on(watch,'click',()=>openWork(nearestFilm,'control'));
  on(enable,'click',()=>{
    if(interactionPaused)return;
    blocked=false;manualVideoOptIn=true;enable.hidden=true;
    activeVideos.forEach(record=>{record.wanted=true;record.blocked=false;requestVideo(record,true);});wake();
  });
  on(document,'visibilitychange',handleVisibility);
  on(window,'scroll',()=>{interactionEpoch++;tapGate.cancel();},{passive:true});
  on(window,'wheel',()=>tapGate.cancel(),{passive:true});
  on(window,'blur',()=>tapGate.cancel());
  on(window,'pointerup',()=>tapGate.cancel());
  if(globalThis.IntersectionObserver){
    const io=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);handleVisibility();},{threshold:0});
    io.observe(host);observers.push(io);
  }
  if(options.reducedMotion===undefined&&globalThis.matchMedia){
    const mq=matchMedia('(prefers-reduced-motion: reduce)');
    const change=event=>{isReduced=event.matches;current=target;pauseVideos();wake();};
    if(mq.addEventListener)on(mq,'change',change);
  }
  if(options.scrollRoot){
    on(window,'scroll',readScroll,{passive:true});
    on(window,'resize',readScroll,{passive:true});
    readScroll();current=target;
  }
  on(window,'resize',()=>{resize();wake();},{passive:true});
  if(globalThis.ResizeObserver){
    const observer=new ResizeObserver(()=>{resize();readScroll();wake();});
    observer.observe(host);if(options.scrollRoot)observer.observe(options.scrollRoot);observers.push(observer);
  }
  function resize(){
    if(!renderer)return;
    const rect=host.getBoundingClientRect(),availableWidth=Math.max(1,rect.width);
    const availableHeight=rect.height>80?rect.height:availableWidth*9/16;
    const width=Math.max(1,Math.min(availableWidth,availableHeight*16/9)),height=width*9/16;
    viewport.style.width=width+'px';viewport.style.height=height+'px';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,options.maxDpr||1.5));
    renderer.setSize(width,height,false);
    cam.aspect=width/height;cam.fov=34;cam.updateProjectionMatrix();dirty=true;
  }
  let frustum,projection,center,delta,normal,worldQuaternion,raycaster,rayPoint;
  function pickFilm(clientX,clientY){
    if(!cam||!renderer||!model||destroyed||failed||interactionPaused||!visible||document.hidden)return null;
    const rect=renderer.domElement.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0||clientX<rect.left||clientX>rect.right||clientY<rect.top||clientY>rect.bottom)return null;
    rayPoint.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);
    cam.updateMatrixWorld();scene.updateMatrixWorld();raycaster.setFromCamera(rayPoint,cam);
    const records=videoRecords.filter(r=>r.workId&&r.screen&&r.stand.visible&&r.screen.visible);
    const hits=raycaster.intersectObjects(records.map(r=>r.screen),false);
    for(const hit of hits)if(hit.distance<=55){const record=records.find(r=>r.screen===hit.object);if(record)return record;}
    return null;
  }
  function bindScreenInteractions(){
    const canvas=renderer.domElement;
    raycaster=new THREE.Raycaster();rayPoint=new THREE.Vector2();
    on(canvas,'pointerdown',event=>{
      if(typeof options.onOpenWork!=='function'||interactionPaused){tapGate.cancel();return;}
      const hit=pickFilm(event.clientX,event.clientY);
      tapGate.begin(event,{hitId:hit?.workId,epoch:interactionEpoch,progress:current});
    },{passive:true});
    on(canvas,'pointermove',event=>{
      tapGate.move(event);
      if(event.pointerType==='mouse')canvas.style.cursor=typeof options.onOpenWork==='function'&&pickFilm(event.clientX,event.clientY)?'pointer':'';
    },{passive:true});
    on(canvas,'pointerup',event=>{
      const hit=pickFilm(event.clientX,event.clientY);
      if(tapGate.end(event,{hitId:hit?.workId,epoch:interactionEpoch,progress:current}))openWork(hit,'screen');
    },{passive:true});
    on(canvas,'pointercancel',()=>tapGate.cancel(),{passive:true});
    on(canvas,'pointerleave',()=>{canvas.style.cursor='';});
  }
  function syncVideos(){
    cam.updateMatrixWorld();scene.updateMatrixWorld();
    projection.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projection);
    const candidates=[];
    for(const r of videoRecords){
      if(!r.screen)continue;
      r.screen.getWorldPosition(center);const distance=cam.position.distanceTo(center);
      if(distance<(options.preloadDistance||65)&&!r.video.getAttribute('src')&&!r.failed){
        r.video.src=asset(r.path);r.video.load();
      }
      if(distance>55||!frustum.intersectsObject(r.screen))continue;
      r.screen.getWorldQuaternion(worldQuaternion);normal.set(0,0,1).applyQuaternion(worldQuaternion);
      delta.copy(cam.position).sub(center).normalize();
      if(normal.dot(delta)<=0)continue;
      candidates.push({record:r,distance});
    }
    candidates.sort((a,b)=>a.distance-b.distance);
    // Reduced-motion preference leaves clips paused until the viewer explicitly opts in.
    nearestFilm=candidates.find(c=>c.record.workId)?.record||null;updateWatchControl();
    activeVideos=candidates.filter(c=>!c.record.failed).slice(0,Math.min(2,Math.max(1,options.maxPlayingVideos||2))).map(c=>c.record);
    const autoplayAllowed=!isReduced||manualVideoOptIn||options.playVideosWithReducedMotion===true;
    const active=new Set(activeVideos);
    for(const r of videoRecords){
      const wanted=active.has(r)&&visible&&!document.hidden&&!interactionPaused&&autoplayAllowed;
      if(r.wanted!==wanted){r.wanted=wanted;r.attempt++;if(!wanted)r.video.pause();}
      if(wanted)requestVideo(r);
    }
    blocked=activeVideos.some(r=>r.blocked);
    enable.hidden=(!blocked&&autoplayAllowed)||!activeVideos.length;
  }
  function frame(now){
    raf=0;if(destroyed||failed||interactionPaused||!visible||document.hidden||!model)return;
    const dt=lastFrame?Math.min(.1,(now-lastFrame)/1000):1/60;lastFrame=now;
    const remaining=target-current;
    current=isReduced?target:current+remaining*(1-Math.exp(-dt/(options.smoothing||.14)));
    if(Math.abs(target-current)<.00002)current=target;
    const moving=Math.abs(target-current)>.000001;
    const hasPlaying=activeVideos.some(r=>r.wanted&&!r.video.paused);
    const due=now-lastDraw>=1000/(options.maxFps||30)-1;
    if(due||!lastDraw){
      const view=galleryView(current,{reducedMotion:isReduced});
      cam.position.fromArray(view.position);cam.lookAt(...view.target);
      sun.position.set(cam.position.x+12,24,cam.position.z+6);
      sun.target.position.set(cam.position.x,0,cam.position.z-8);
      // In this silent gallery labels remain fixed; scroll already supplies the motion.
      if(now-lastVideoSync>180||moving||dirty){syncVideos();lastVideoSync=now;}
      try{renderer.render(scene,cam);}catch(error){showFallback(error);return;}
      lastDraw=now;dirty=false;
      const chapter=chapterAt(current);
      if(chapter.id!==lastChapter){lastChapter=chapter.id;notify('chapter',chapter);}
      notify('progress',{progress:current,time:view.time,chapter});
    }
    if(moving||hasPlaying||dirty)raf=requestAnimationFrame(frame);
  }
  try{
    THREE=await resolveThree(options);
    if(destroyed)return controller;
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
    renderer.shadowMap.enabled=options.shadows!==false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    renderer.domElement.setAttribute('aria-label','Eyal Izenman: scroll through the gallery. Select a film screen, or use the Watch full film button.');
    renderer.domElement.setAttribute('role','img');viewport.prepend(renderer.domElement);
    on(renderer.domElement,'webglcontextlost',event=>{event.preventDefault();showFallback('The gallery graphics context was interrupted.');});
    const BG=0xf3f0e9;scene=new THREE.Scene();scene.background=new THREE.Color(BG);scene.fog=new THREE.Fog(BG,26,98);
    cam=new THREE.PerspectiveCamera(34,16/9,.1,400);
    scene.add(new THREE.HemisphereLight(0xffffff,0xd9d2c4,1.5));
    sun=new THREE.DirectionalLight(0xfff6e8,2.6);sun.castShadow=options.shadows!==false;
    sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-38,right:38,top:38,bottom:-38,near:1,far:110});
    sun.shadow.bias=-.0006;sun.shadow.radius=4;scene.add(sun);scene.add(sun.target);
    const fill=new THREE.DirectionalLight(0xdfe6ff,1.6);fill.position.set(-9,5,-4);scene.add(fill);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.ShadowMaterial({opacity:.2}));
    floor.rotation.x=-Math.PI/2;floor.position.z=-170;floor.receiveShadow=true;scene.add(floor);
    const galleryTextureLoader={load(path,callback){
      return new THREE.TextureLoader().load(asset(path),texture=>{
        if(destroyed){texture.dispose();return;}ownedTextures.add(texture);callback(texture);wake();
      },undefined,()=>{notify('mediaerror',{path,message:'This artwork could not be loaded.'});wake();});
    }};
    // The original scene construction below preserves media order, titles, geometry and placement.
    let ready;
    try{ready=document.fonts?.load('500 74px Heebo');}catch(e){}
    if(ready)await Promise.race([ready,new Promise(resolve=>setTimeout(resolve,1200))]).catch(()=>{});
    if(destroyed)return controller;

const stands=[],frameMat=new THREE.MeshStandardMaterial({color:0x17171d,roughness:.5});
function labelTex(txt){
  const c=document.createElement('canvas');c.width=1536;c.height=224;
  const x=c.getContext('2d'),text=txt.toUpperCase(),words=text.split(/\s+/),maxW=c.width-72;
  let size=74,lines=[text];x.fillStyle='#17171d';x.textBaseline='middle';
  if('letterSpacing' in x)x.letterSpacing='3px';
  const setFont=()=>{x.font='500 '+size+'px Heebo, sans-serif';};
  const width=s=>x.measureText(s).width;setFont();
  if(width(text)>maxW&&words.length>1){
    let best=Infinity;
    for(let i=1;i<words.length;i++){
      const pair=[words.slice(0,i).join(' '),words.slice(i).join(' ')],span=Math.max(...pair.map(width));
      if(span<best){best=span;lines=pair;}
    }
  }
  while(Math.max(...lines.map(width))>maxW&&size>20){size-=1;setFont();}
  const leading=size*1.22,firstY=c.height/2-(lines.length-1)*leading/2;
  lines.forEach((line,i)=>x.fillText(line,36,firstY+i*leading));
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  t.userData.labelLayout={lines:lines.slice(),fontSize:size,width:c.width,height:c.height,maxLineWidth:Math.max(...lines.map(width)),availableWidth:maxW};
  return t;
}
function stand(w,h,map,label,legs=true){const G=new THREE.Group(),y0=legs?.9:0,localFrameMat=frameMat.clone();
  const fr=new THREE.Mesh(new THREE.BoxGeometry(w+.16,h+.16,.14),localFrameMat);fr.position.y=y0+h/2;fr.castShadow=true;G.add(fr);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false}));pl.position.set(0,y0+h/2,.075);G.add(pl);
  if(legs)for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(.09,y0,.09),localFrameMat);l.position.set(s*(w/2-.35),y0/2,0);l.castShadow=true;G.add(l);}
  if(label){
    const labelWidth=w*.98,lb=new THREE.Mesh(new THREE.PlaneGeometry(labelWidth,labelWidth*224/1536),new THREE.MeshBasicMaterial({map:labelTex(label),transparent:true,toneMapped:false}));
    lb.position.set(0,y0-.40,.095);G.add(lb);
    G.userData.label=lb;G.userData.labelRestY=lb.position.y;G.userData.labelPhase=label.length*.37;
  }
  G.userData.fadeMaterials=[...new Set(G.children.map(m=>m.material))].map(material=>({
    material,transparent:material.transparent,depthWrite:material.depthWrite
  }));
  G.userData.reveal=1;G.visible=true;G.userData.screen=pl;
  const record=videoRecords.find(r=>r.texture===map);if(record){record.stand=G;record.screen=pl;}
  stands.push(G);scene.add(G);return G;}
function video(src){return createGalleryVideo(src);}
function buildMedia(){
  FILMS.forEach((name,i)=>{const s=i%2?1:-1,G=stand(6.4,3.6,video('v/f'+String(i).padStart(2,'0')+'.mp4'),name);G.position.set(s*5.6,0,-22-8*i);G.rotation.y=-s*.78;});
  [['Normande',0,-152,0],['Customer Success Hub',-10.4,-148.3,.5],['Osher Ad',10.4,-148.3,-.5]].forEach((c,i)=>{const G=stand(5.4,5.4,video('v/commercial-2025-'+String(i+1).padStart(2,'0')+'.mp4'),c[0]);G.position.set(c[1],0,c[2]);G.rotation.y=c[3];});
  const ART=[0,1,2,3,4,5,6,7,8,9,10,11,12,14,15,16],tl=galleryTextureLoader;
  ART.forEach((n,i)=>{const right=i<8,j=right?i:i-8,phi=(right?28+j*(124/7):208+j*(124/7))*Math.PI/180;
    tl.load('art/a'+String(n).padStart(2,'0')+'.jpg',tx=>{tx.colorSpace=THREE.SRGBColorSpace;const ar=tx.image.width/tx.image.height,h=ar>1.2?2.5:ar<.8?3.9:3.1,w=h*ar;
      const G=stand(w,h,tx,null);G.position.set(12.5*Math.sin(phi),0,-215-12.5*Math.cos(phi));G.rotation.y=-phi;});});
  tl.load('art/aether.jpg',tx=>{tx.colorSpace=THREE.SRGBColorSpace;const G=stand(4.6,4.6,tx,'Aether Gallery');G.position.set(-2.9,0,ZC-3);G.rotation.y=.25;});
  {const c=document.createElement('canvas');c.width=1280;c.height=800;const x=c.getContext('2d');x.fillStyle='#17171d';x.fillRect(0,0,1280,800);x.font='500 34px "JetBrains Mono", monospace';
    const L=['// this reel is code — three.js, no keyframes','const NB = 42000            // birds','function flockXYZ(i, t, del, br, o) {','  const ang = tau*.9 + P.oy[i]*.3','  o[0] = cx + (P.ox[i]*ca - P.oz[i]*sa)*br','  o[1] = cy + P.oy[i]*br + sin(w*.9)*.6','  o[2] = cz + (P.ox[i]*sa + P.oz[i]*ca)*br','}','h = .05 + 3.6 * pow(band(bb[i], t - bdel[i]), 2.3)','','github.com/AvocadoHead'];
    L.forEach((s,i)=>{x.fillStyle=i===0?'#8f8c84':i===L.length-1?'#ff5a3a':'#efece5';x.fillText(s,56,96+i*60,1168);});
    const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const G=stand(5.9,3.7,tx,'The 3D Book · Simpler · Larynx');G.position.set(3.4,0,ZC-3);G.rotation.y=-.25;}
}

    buildMedia();model={stands};bindScreenInteractions();
    frustum=new THREE.Frustum();projection=new THREE.Matrix4();center=new THREE.Vector3();
    delta=new THREE.Vector3();normal=new THREE.Vector3();worldQuaternion=new THREE.Quaternion();
    host.dataset.galleryState='ready';status.hidden=true;resize();wake();
    notify('ready',{stands:stands.length,videos:videoRecords.length,range:GALLERY_RANGE});
  }catch(error){showFallback(error);}
  return controller;
}
