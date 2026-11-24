
/* Orthographic sphere with real geographic land particles. All resources local.
   Canvas is rendered on demand when paused, hidden, or reduced motion is enabled. */
(()=>{
'use strict';
const section=document.querySelector('.section_global .global_card');
if(!section||!window.MAURYAN_GLOBE_DATA)return;
const headerEl=section.querySelector('.global_header');
const stageImg=section.querySelector('.global_globe');
const list=section.querySelector('.global_locations');
const controls=section.querySelector('.global_controls');
if(!list)return;
const items=[].slice.call(list.children);
const canvas=document.createElement('canvas');
canvas.className='global_canvas';canvas.tabIndex=0;canvas.setAttribute('role','img');
canvas.setAttribute('aria-label','Rotating globe showing our locations. Drag to rotate. Use left and right arrow keys to change location, or Space to pause.');
section.insertBefore(canvas,section.firstChild);
if(stageImg)stageImg.style.visibility='hidden';
const ctx=canvas.getContext('2d',{alpha:false});
const bloomCanvas=document.createElement('canvas');
const bloom=bloomCanvas.getContext('2d');
let hoverX=-10000,hoverY=-10000,hoverStrength=0,hoverTarget=0;
const data=window.MAURYAN_GLOBE_DATA;
const CYCLE_DURATION=10000;
let cycleElapsed=0;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const DEG=Math.PI/180, TAU=Math.PI*2;
const locations=items.map(function(el,i){var n=el.querySelector('.global_location-name');return{key:'loc'+i,name:n?n.textContent.trim():'',lat:parseFloat(el.getAttribute('data-lat')),lon:parseFloat(el.getAttribute('data-lon'))};}).filter(function(l){return isFinite(l.lat)&&isFinite(l.lon);});
if(!locations.length)return;
let selected=0, yaw=(-108+(matchMedia("(max-width:600px)").matches?46:0))*DEG, tilt=-6*DEG, width=0,height=0,radius=0,cx=0,cy=0,dpr=1;
let paused=reduceMotion.matches,visible=true,frame=0,last=0,elapsed=0,dragging=false,pointer=null,dragDistance=0;
let focus=null,holdUntil=0,hovered=-1,drawnMarkers=[],titleTimer;
let buckets=Array.from({length:48},()=>[]);
const points=new Float32Array(data.points);
const projected=new Float32Array(3);
const regionWeight=new Float32Array(points.length/4);
const repelX=new Float32Array(points.length/4),repelY=new Float32Array(points.length/4);
let renderDelta=1/60,repelMax=0;
const vec=(lat,lon)=>{const a=lat*DEG,b=lon*DEG;return [Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)];};
locations.forEach(l=>l.vector=vec(l.lat,l.lon));
// Light follows land around the two confirmed locations, not an arbitrary screen circle.
for(let i=0;i<points.length;i+=4){
 let influence=0;
 locations.forEach((l,index)=>{const v=l.vector,dot=points[i]*v[0]+points[i+1]*v[1]+points[i+2]*v[2];influence=Math.max(influence,Math.exp((dot-1)/(index===0?.012:.0045)));});
 regionWeight[i/4]=influence;
}
function project(x,y,z,sy,cyaw,st,ct){const ax=x*cyaw+z*sy,az=z*cyaw-x*sy;projected[0]=ax;projected[1]=y*ct-az*st;projected[2]=y*st+az*ct;return projected;}
function resize(){const box=section.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);bloomCanvas.width=Math.ceil(width/3);bloomCanvas.height=Math.ceil(height/3);ctx.setTransform(dpr,0,0,dpr,0,0);const mobile=width<=600;radius=mobile?width*1.02:Math.min(width*.385,height*.55);cx=width*(mobile?.53:.54);cy=Math.max(mobile?height*.68:height*.89,(headerEl?headerEl.offsetTop+headerEl.offsetHeight:0)+radius+18);radius*=.8;canvas.dataset.radius=radius.toFixed(2);render();}
function paintFill(){var n=section.querySelector('[data-global-next]');if(n)n.style.setProperty('--p',(Math.min(1,cycleElapsed/CYCLE_DURATION)*100).toFixed(2)+'%');}
function locationTitle(index){items.forEach((el,i)=>{const on=i===index,desc=el.children[1];el.className=on?'global_location-active':'global_location';if(desc)desc.className=on?'global_location-desc-active':'global_location-desc';el.setAttribute('aria-current',String(on));});}
function choose(index){cycleElapsed=0;selected=(index+locations.length)%locations.length;locationTitle(selected);paintFill();const l=locations[selected];let target=-l.lon*DEG+(matchMedia("(max-width:600px)").matches?46*DEG:0);while(target-yaw>Math.PI)target-=TAU;while(target-yaw< -Math.PI)target+=TAU;focus={start:performance.now(),from:yaw,to:target,fromTilt:tilt,toTilt:(l.lat-9)*DEG};holdUntil=performance.now()+6000;if(reduceMotion.matches){yaw=target;tilt=focus.toTilt;focus=null;render();}else requestRender();}
function setPaused(value){paused=value;canvas.dataset.paused=String(paused);last=0;requestRender();}
function requestRender(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
function render(){if(!width)return;ctx.clearRect(0,0,width,height);ctx.fillStyle='#03020f';ctx.fillRect(0,0,width,height);
 const sy=Math.sin(yaw),cyaw=Math.cos(yaw),st=Math.sin(tilt),ct=Math.cos(tilt);
 const body=ctx.createRadialGradient(cx-radius*.3,cy-radius*.4,radius*.1,cx,cy,radius);body.addColorStop(0,'#05081d');body.addColorStop(.72,'#030518');body.addColorStop(1,'#01010b');ctx.fillStyle=body;ctx.beginPath();ctx.arc(cx,cy,radius,0,TAU);ctx.fill();
 // A faint geographic surface under the point cloud gives the unlit globe mass.
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,TAU);ctx.clip();ctx.fillStyle='#0a0b24';ctx.globalAlpha=.45;
 for(const ring of data.rings){let front=0;for(const v of ring){project(...v,sy,cyaw,st,ct);if(projected[2]>.02)front++;}if(front!==ring.length)continue;ctx.beginPath();ring.forEach((v,i)=>{project(...v,sy,cyaw,st,ct);const x=cx+projected[0]*radius,y=cy-projected[1]*radius;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fill();}
 ctx.restore();
 // A low-resolution geographic light layer creates the reference's soft, irregular bloom.
 bloom.clearRect(0,0,bloomCanvas.width,bloomCanvas.height);
 const breathing=reduceMotion.matches?1:.88+.12*Math.sin(elapsed*1.5);
 for(let i=0;i<points.length;i+=4){
  const weight=regionWeight[i/4];if(weight<.035)continue;
  project(points[i],points[i+1],points[i+2],sy,cyaw,st,ct);if(projected[2]<.04)continue;
  const px=cx+projected[0]*radius,py=cy-projected[1]*radius;
  bloom.fillStyle=`rgba(17,48,255,${Math.min(.85,weight*.7*breathing*(1+hoverStrength*.45))})`;
  bloom.fillRect(px/3,py/3,2.5,2.5);
 }
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,TAU);ctx.clip();ctx.globalCompositeOperation='screen';ctx.filter='blur(17px)';ctx.drawImage(bloomCanvas,0,0,width,height);ctx.filter='blur(7px)';ctx.globalAlpha=.4;ctx.drawImage(bloomCanvas,0,0,width,height);ctx.restore();
 buckets.forEach(b=>b.length=0);
 repelMax=0;
 const settle=1-Math.exp(-renderDelta*9);
 const repelRadius=width<=600?75:115;
 for(let i=0;i<points.length;i+=4){const x=points[i],y=points[i+1],z=points[i+2],random=points[i+3];project(x,y,z,sy,cyaw,st,ct);const depth=projected[2];const particle=i/4;if(depth<.018){repelX[particle]*=1-settle;repelY[particle]*=1-settle;continue;}const weight=regionWeight[i/4];const highlighted=weight>.075;const px=cx+projected[0]*radius,py=cy-projected[1]*radius;const proximity=hoverStrength*Math.exp(-((px-hoverX)**2+(py-hoverY)**2)/13000);const rim=Math.pow(Math.max(0,1-depth),2);const phase=elapsed*(1.1+random*1.8)+random*90;const twinkle=reduceMotion.matches?1:.18+.82*Math.pow(.5+.5*Math.sin(phase),2);const alpha=Math.min(.97,(.21+random*.64+rim*.3)*Math.pow(depth,.36)*twinkle+proximity*.06);const bucket=Math.min(15,Math.floor(alpha*16))+(highlighted?32:random>.54?16:0);const size=(random>.955?2.7:.8+random*1.05)*(width<=600?.8:1);
 const dx=px-hoverX,dy=py-hoverY,distance=Math.hypot(dx,dy);
 const force=!reduceMotion.matches&&!dragging&&distance<repelRadius?hoverStrength*30*Math.pow(1-distance/repelRadius,1.6):0;
 // Screen-space offsets leave the geographic coordinates and rotation intact.
 const direction=distance>.01?distance:1;
 repelX[particle]+=(dx/direction*force-repelX[particle])*settle;
 repelY[particle]+=(dy/direction*force-repelY[particle])*settle;
 repelMax=Math.max(repelMax,Math.hypot(repelX[particle],repelY[particle]));
 let drawX=px+repelX[particle],drawY=py+repelY[particle];
 const edge=Math.hypot(drawX-cx,drawY-cy);
 if(edge>radius-1){const limit=(radius-1)/edge;drawX=cx+(drawX-cx)*limit;drawY=cy+(drawY-cy)*limit;}
 buckets[bucket].push(drawX,drawY,size);
 }
 buckets.forEach((bucket,index)=>{if(!bucket.length)return;const group=Math.floor(index/16),alpha=((index%16)+1)/16;ctx.fillStyle=group===2?`rgba(99,135,255,${alpha})`:group===1?`rgba(244,242,255,${alpha})`:`rgba(144,151,183,${alpha*.75})`;ctx.beginPath();for(let j=0;j<bucket.length;j+=3)ctx.rect(bucket[j],bucket[j+1],bucket[j+2],bucket[j+2]);ctx.fill();});
 drawnMarkers=[];
 locations.forEach((l,i)=>{project(...l.vector,sy,cyaw,st,ct);if(projected[2]<.08)return;const x=cx+projected[0]*radius,y=cy-projected[1]*radius;drawnMarkers.push({x,y,index:i});const active=i===selected;const glow=ctx.createRadialGradient(x,y,0,x,y,active?48:24);glow.addColorStop(0,active?'rgba(71,107,255,.85)':'rgba(71,107,255,.5)');glow.addColorStop(.25,'rgba(35,80,230,.3)');glow.addColorStop(1,'rgba(35,80,230,0)');ctx.fillStyle=glow;ctx.fillRect(x-48,y-48,96,96);ctx.strokeStyle=active?'#a0b8ff':'#526ca8';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,active?8:5,0,TAU);ctx.stroke();ctx.fillStyle=active?'#ffffff':'#98b3ff';ctx.beginPath();ctx.arc(x,y,active?2.7:1.8,0,TAU);ctx.fill();if(active||hovered===i){const mobile=width<=600;ctx.font=`${mobile?11:13}px Helvetica,Arial,sans-serif`;ctx.textAlign='left';ctx.fillStyle='#c5c9e0';ctx.fillText(l.name,x+16,y+4);}});
 canvas.dataset.repel=repelMax.toFixed(3);canvas.dataset.rotation=yaw.toFixed(5);canvas.dataset.location=locations[selected].key;
}
function tick(now){frame=0;if(!visible||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;renderDelta=dt||1/60;elapsed+=dt;hoverStrength+=(hoverTarget-hoverStrength)*Math.min(1,dt*7);canvas.dataset.hover=hoverStrength.toFixed(3);if(!paused&&!dragging){cycleElapsed+=dt*1000;if(cycleElapsed>=CYCLE_DURATION)choose(selected+1);}paintFill();if(focus){const p=Math.min(1,(now-focus.start)/1700),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;yaw=focus.from+(focus.to-focus.from)*e;tilt=focus.fromTilt+(focus.toTilt-focus.fromTilt)*e;if(p===1)focus=null;}else if(!paused&&!dragging&&now>holdUntil){yaw-=dt*.045;tilt+=(-6*DEG-tilt)*.012;}
 render();if((!paused||focus||hoverStrength>.001||repelMax>.03)&&!reduceMotion.matches)requestRender();}
items.forEach((el,i)=>{el.style.cursor='pointer';el.addEventListener('click',()=>choose(i));});
if(controls)controls.addEventListener('click',e=>{const r=controls.getBoundingClientRect();choose(selected+(e.clientX<r.left+r.width/2?-1:1));});
if(controls)controls.style.cursor='pointer';
canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(selected+(e.key==='ArrowRight'?1:-1));}else if(e.code==='Space'){e.preventDefault();setPaused(!paused);}});
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;pointer={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};dragDistance=0;focus=null;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;hoverX=x;hoverY=y;hoverTarget=Math.hypot(x-cx,y-cy)<radius?1:0;if(dragging&&pointer){const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;yaw+=dx*.004;tilt=Math.max(-.8,Math.min(.8,tilt+dy*.0025));dragDistance+=Math.abs(dx)+Math.abs(dy);pointer.x=e.clientX;pointer.y=e.clientY;holdUntil=performance.now()+1200;render();}else{hovered=drawnMarkers.find(m=>Math.hypot(m.x-x,m.y-y)<22)?.index??-1;canvas.style.cursor=hovered<0?'grab':'pointer';if(paused)requestRender();}});
function endDrag(e){if(!dragging)return;if(dragDistance<7){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,m=drawnMarkers.find(m=>Math.hypot(m.x-x,m.y-y)<28);if(m)choose(m.index);}dragging=false;pointer=null;last=0;requestRender();}
canvas.addEventListener('pointerleave',()=>{hoverTarget=0;hovered=-1;if(paused)requestRender();});
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',()=>{dragging=false;pointer=null;requestRender();});
new ResizeObserver(resize).observe(section);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;requestRender();}else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.01}).observe(section);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=0;requestRender();}});
reduceMotion.addEventListener('change',e=>setPaused(e.matches));
locationTitle(0);setPaused(paused);resize();requestRender();
})();

