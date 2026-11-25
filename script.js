var b=document.querySelector('.menu'),l=document.getElementById('nl');
b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
l.addEventListener('click',function(e){if(e.target.closest('a')){l.classList.remove('open');b.setAttribute('aria-expanded',false)}});
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('in',e.isIntersecting)})},{threshold:.6});
 document.querySelectorAll('h1 span,h2 span').forEach(function(s){io.observe(s)});
 if(!rm){
  var cs=document.querySelectorAll('[data-n]');
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
   if(!e.isIntersecting)return;var el=e.target;co.unobserve(el);
   var n=+el.dataset.n,s=el.dataset.s||'',t0=null;
   function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/1800,1),v=1-Math.pow(1-p,3);el.textContent=Math.round(n*v)+s;if(p<1)requestAnimationFrame(f)}
   el.textContent='0'+s;requestAnimationFrame(f)})},{threshold:.5});
  cs.forEach(function(c){co.observe(c)});
 }
}else{document.querySelectorAll('h1 span,h2 span').forEach(function(s){s.classList.add('in')})}

document.querySelectorAll('form[data-lead]').forEach(function(f){
 var last=0;
 f.addEventListener('submit',function(e){
  e.preventDefault();
  var m=f.querySelector('.fm'),btn=f.querySelector('button[type=submit]');
  function say(t,err){m.className='fm'+(err?' err':'');m.textContent=t}
  if(!f.checkValidity()){f.reportValidity();return}
  var d=new FormData(f);
  if(d.get('hp_url')){return}
  if(Date.now()-last<30000){say('Your enquiry was just sent. Please wait a few seconds before sending another.',true);return}
  var c=window.RAYMARK_MAIL||{},toEmail=c.toEmail||'contact.raymarkdigital@gmail.com';
  var ph=function(x){return !x||/^YOUR_/.test(x)};
  var useEJ=!ph(c.serviceId)&&!ph(c.templateId)&&!ph(c.publicKey);
  var v=function(k){return String(d.get(k)||'').trim()};
  var when=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})+' IST';
  var ctl=new AbortController(),to=setTimeout(function(){ctl.abort()},15000),req;
  if(useEJ){
   var params={customer_name:v('name'),customer_email:v('email'),phone:v('phone'),company:v('company'),service:v('service'),subject:v('subject'),message:v('message'),submitted_at:when,page_url:location.href};
   req=fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},signal:ctl.signal,body:JSON.stringify({service_id:c.serviceId,template_id:c.templateId,user_id:c.publicKey,template_params:params})})
   .then(function(r){return r.text().then(function(tx){if(r.status===200&&tx.trim()==='OK')return;throw new Error('EmailJS '+r.status+': '+tx)})});
  }else{
   var body={'Customer Name':v('name'),'email':v('email'),'Phone Number':v('phone'),'Company':v('company'),'Service':v('service'),'Subject':v('subject'),'Message':v('message'),'Submission Date and Time':when,'Page':location.href,'_subject':'New enquiry: '+v('subject')+' ('+v('name')+')','_template':'table','_captcha':'false'};
   req=fetch('https://formsubmit.co/ajax/'+toEmail,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:ctl.signal,body:JSON.stringify(body)})
   .then(function(r){return r.json().catch(function(){return {}}).then(function(j){
    var msg=String(j.message||'');
    if(/activat/i.test(msg))console.warn('Raymark enquiry form: FormSubmit needs a one-time activation. Open the Gmail inbox of '+toEmail+', click "Activate Form" in the email from FormSubmit, then send the form again.');
    if(r.ok&&(j.success===true||j.success==='true')&&!/activat/i.test(msg))return;
    throw new Error('FormSubmit '+r.status+': '+JSON.stringify(j))})});
  }
  var t=btn.textContent;btn.disabled=true;btn.textContent='Sending...';say('');
  req.then(function(){last=Date.now();f.reset();say('Thank you! Your enquiry has been sent. We will reply soon.')})
  .catch(function(err){console.error('Enquiry send failed:',err);say('Sorry, your message could not be sent. Please try again, or email contact.raymarkdigital@gmail.com or call +91 8331-888-772.',true)})
  .then(function(){clearTimeout(to);btn.disabled=false;btn.textContent=t});
 });
});
(function(){
 if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 var rm2=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var ring=document.createElement('div'),dot=document.createElement('div');
 ring.className='cur-ring';dot.className='cur-dot';
 ring.setAttribute('aria-hidden','true');dot.setAttribute('aria-hidden','true');
 document.body.appendChild(ring);document.body.appendChild(dot);
 document.documentElement.classList.add('cc-on');
 var mx=0,my=0,rx=0,ry=0,seen=false;
 function place(el,x,y){el.style.transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%)'}
 function loop(){rx+=(mx-rx)*(rm2?1:.18);ry+=(my-ry)*(rm2?1:.18);place(ring,rx,ry);requestAnimationFrame(loop)}
 document.addEventListener('mousemove',function(e){
  mx=e.clientX;my=e.clientY;place(dot,mx,my);
  if(!seen){seen=true;rx=mx;ry=my;document.documentElement.classList.add('cc-show')}
  var t=e.target.closest?e.target:e.target.parentElement;
  ring.classList.toggle('is-hover',!!(t&&t.closest('a,button,summary,select,.card,.btn')));
  var txt=!!(t&&t.closest('input,textarea'));
  ring.classList.toggle('is-text',txt);dot.classList.toggle('is-text',txt);
 });
 document.addEventListener('mousedown',function(){ring.classList.add('is-down')});
 document.addEventListener('mouseup',function(){ring.classList.remove('is-down')});
 document.documentElement.addEventListener('mouseleave',function(){document.documentElement.classList.remove('cc-show');seen=false});
 loop();
})();

(function(){
 var rmm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var LAB=['SEO','Ads','Leads','Reach','ROI','Clicks','AI Search'];
 document.querySelectorAll('.hl,.ph').forEach(function(host){
  var dark=host.classList.contains('ph'),cv=document.createElement('canvas');
  cv.className='ai-net';cv.setAttribute('aria-hidden','true');host.insertBefore(cv,host.firstChild);
  var cx=cv.getContext('2d');if(!cx)return;
  var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),nodes=[],ms={x:-999,y:-999},vis=true,raf=0;
  var ink=dark?'255,255,255':'10,36,35',gold=dark?'242,169,59':'168,115,18';
  function build(){nodes=[];var n=Math.max(16,Math.min(56,Math.round(W*H/22000)));
   for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1.5+Math.random()*1.5,g:Math.random()<.2});
   if(W>900){var cnt={l:0,r:0};LAB.forEach(function(t,i){var l=i%2===0,k=l?cnt.l++:cnt.r++,sl=.76/(l?4:3),y0=H*(.12+k*sl),y1=y0+H*sl,a=l?.04:.8,b=l?.2:.96;nodes.push({lab:t,x:W*(a+Math.random()*(b-a)),y:y0+(y1-y0)*(.3+Math.random()*.4),y0:y0+14,y1:y1-14,vx:0,vy:(Math.random()<.5?-1:1)*(.1+Math.random()*.1),r:3})})}}
  function size(){var r=host.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);build();draw()}
  function step(){nodes.forEach(function(p){p.x+=p.vx;p.y+=p.vy;
   if(p.lab){if(p.y<p.y0||p.y>p.y1)p.vy*=-1}else{if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}})}
  function pill(p){cx.font='600 12px Jost,Montserrat,sans-serif';var tw=cx.measureText(p.lab).width,w=tw+22,h=24,x=p.x-w/2,y=p.y-h/2;
   cx.beginPath();cx.moveTo(x+12,y);cx.arcTo(x+w,y,x+w,y+h,12);cx.arcTo(x+w,y+h,x,y+h,12);cx.arcTo(x,y+h,x,y,12);cx.arcTo(x,y,x+w,y,12);cx.closePath();
   cx.fillStyle=dark?'rgba(255,255,255,.1)':'rgba(255,255,255,.75)';cx.fill();cx.strokeStyle='rgba('+gold+',.8)';cx.lineWidth=1.2;cx.stroke();
   cx.fillStyle=dark?'#fff':'#0A2423';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(p.lab,p.x,p.y+.5)}
  function draw(){cx.clearRect(0,0,W,H);
   for(var i=0;i<nodes.length;i++){var a=nodes[i];
    for(var j=i+1;j<nodes.length;j++){var b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
     if(d<130){cx.strokeStyle='rgba('+ink+','+((1-d/130)*.2).toFixed(3)+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
    var mx=a.x-ms.x,my=a.y-ms.y,md=Math.sqrt(mx*mx+my*my);
    if(md<170){cx.strokeStyle='rgba('+gold+','+((1-md/170)*.6).toFixed(3)+')';cx.lineWidth=1.2;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(ms.x,ms.y);cx.stroke()}}
   nodes.forEach(function(p){if(p.lab)return;cx.fillStyle=p.g?'rgba('+gold+',.75)':'rgba('+ink+',.35)';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()});
   nodes.forEach(function(p){if(p.lab)pill(p)})}
  function loop(){if(vis&&!document.hidden){step();draw()}raf=requestAnimationFrame(loop)}
  host.addEventListener('mousemove',function(e){var r=host.getBoundingClientRect();ms.x=e.clientX-r.left;ms.y=e.clientY-r.top});
  host.addEventListener('mouseleave',function(){ms.x=ms.y=-999});
  var tm;window.addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(size,200)});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(host);
  size();if(!rmm)loop();
 });
 if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.addEventListener('mousemove',function(e){var c=e.target.closest&&e.target.closest('.card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
 }
})();
