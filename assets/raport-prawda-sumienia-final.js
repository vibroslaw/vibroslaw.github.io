(function(){
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('reduced-motion');

  // Report Room world-class motion layer: scroll reveal + card spotlight.
  const fixReportRoomLanguageSwitch = () => {
    const path = window.location.pathname.replace(/\/index\.html$/i, "/");
    const isPlRoom = path.includes("/rap-ort/prawda-sumienia/exclusive/pl/");
    const isEnRoom = path.includes("/rap-ort/prawda-sumienia/exclusive/") && !isPlRoom;
    if (!isPlRoom && !isEnRoom) return;
    const enTarget = "/rap-ort/prawda-sumienia/exclusive/";
    const plTarget = "/rap-ort/prawda-sumienia/exclusive/pl/";
    const setLangLink = (selector, href, active) => {
      $$(selector).forEach((link) => {
        link.setAttribute("href", href);
        link.classList.toggle("active", active);
      });
    };
    setLangLink('.experience-language a[hreflang="en"], .mobile-lang-switch a[hreflang="en"]', enTarget, isEnRoom);
    setLangLink('.experience-language a[hreflang="pl"], .mobile-lang-switch a[hreflang="pl"]', plTarget, isPlRoom);
  };

  const fixReportRoomLanguageSwitchRetry = () => {
    fixReportRoomLanguageSwitch();
    window.requestAnimationFrame?.(fixReportRoomLanguageSwitch);
    window.setTimeout(fixReportRoomLanguageSwitch, 80);
    window.setTimeout(fixReportRoomLanguageSwitch, 350);
    window.setTimeout(fixReportRoomLanguageSwitch, 900);
  };
  const linkReportRoomSourceTokens = () => {
    if (!document.getElementById("source-register")) return;
    const pattern = /\b(S\d{2})\b/g;
    $$('.rp-card-meta strong,.rp-source-mini').forEach((el) => {
      if (el.dataset.rpSourcesLinked === "true" || el.querySelector('a.rp-source-token')) return;
      if (el.querySelector('a.rp-source-token')) { el.dataset.rpSourcesLinked = "true"; return; }
      el.innerHTML = el.innerHTML.replace(pattern, '<a class="rp-source-token" href="#source-$1">$1</a>');
      el.dataset.rpSourcesLinked = "true";
    });
  };
  if(document.body.classList.contains('rp-report-room')){
    fixReportRoomLanguageSwitchRetry();
    linkReportRoomSourceTokens();
    const revealTargets=$$('.rp-chapter-teaser,.rp-path-card,.rp-material-card,.rp-info-card,.rp-threshold-card,.rp-source-list');
    revealTargets.forEach((el,i)=>el.style.setProperty('--rp-stagger', String(Math.min(i%12, 11))));
    if(!reduced && 'IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('rp-room-visible'); io.unobserve(entry.target); } });
      },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
      revealTargets.forEach(el=>io.observe(el));
    } else {
      revealTargets.forEach(el=>el.classList.add('rp-room-visible'));
    }
    $$('.rp-chapter-teaser').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const x=((e.clientX-r.left)/Math.max(r.width,1))*100;
        const y=((e.clientY-r.top)/Math.max(r.height,1))*100;
        card.style.setProperty('--spot-x',x.toFixed(1));
        card.style.setProperty('--spot-y',y.toFixed(1));
      });
    });
  }
  // Report Room chapter expansion: clicked card opens as a near full-screen chapter room.
  const expandableCards=$$('[data-rp-expand-card]');
  let rpBackdrop=null;
  const ensureBackdrop=()=>{
    if(rpBackdrop) return rpBackdrop;
    rpBackdrop=document.createElement('div');
    rpBackdrop.className='rp-chapter-backdrop';
    rpBackdrop.setAttribute('aria-hidden','true');
    document.body.appendChild(rpBackdrop);
    rpBackdrop.addEventListener('click',()=>closeAllChapterCards());
    return rpBackdrop;
  };
  const updateModalState=()=>{
    const anyOpen=expandableCards.some(card=>card.classList.contains('is-open'));
    document.documentElement.classList.toggle('rp-card-modal-open',anyOpen);
    document.body.classList.toggle('rp-card-modal-open',anyOpen);
    const backdrop=ensureBackdrop();
    backdrop.classList.toggle('is-active',anyOpen);
  };
  const ensureCardCloseButton=(card)=>{
    let close=$('.rp-card-close',card);
    if(close) return close;
    close=document.createElement('button');
    close.type='button';
    close.className='rp-card-close';
    close.setAttribute('aria-label',document.body.dataset.lang==='pl'?'Zamknij pokój rozdziału':'Close chapter room');
    close.textContent='×';
    close.addEventListener('click',(e)=>{e.stopPropagation();setOpen(card,false);updateModalState();});
    card.appendChild(close);
    return close;
  };
  const setOpen=(target,open)=>{
    target.classList.toggle('is-open',open);
    if(open){
      ensureCardCloseButton(target);
      const label=$('h3',target)?.textContent?.trim()||'Chapter room';
      target.setAttribute('role','dialog');
      target.setAttribute('aria-modal','true');
      target.setAttribute('aria-label',label);
    } else {
      target.removeAttribute('role');
      target.removeAttribute('aria-modal');
      target.removeAttribute('aria-label');
    }
    const targetBtn=$('button',target);
    if(targetBtn){
      if(!targetBtn.dataset.rpClosedLabel) targetBtn.dataset.rpClosedLabel=targetBtn.textContent.trim();
      targetBtn.setAttribute('aria-expanded',open?'true':'false');
      targetBtn.textContent=open?(document.body.dataset.lang==='pl'?'Zamknij pokój rozdziału':'Close chapter room'):targetBtn.dataset.rpClosedLabel;
    }
  };
  const closeAllChapterCards=()=>{
    expandableCards.forEach(card=>setOpen(card,false));
    updateModalState();
  };
  expandableCards.forEach(card=>{
    const btn=$('button',card);
    const openCard=()=>{
      expandableCards.forEach(c=>{ if(c!==card) setOpen(c,false); });
      setOpen(card,true);
      updateModalState();
      setTimeout(()=>$('.rp-card-close',card)?.focus({preventScroll:true}),60);
    };
    const toggleCard=()=>{
      const wasOpen=card.classList.contains('is-open');
      if(wasOpen){ setOpen(card,false); updateModalState(); } else { openCard(); }
    };
    card.addEventListener('click',e=>{
      if(e.target.closest('a,button')) return;
      if(!card.classList.contains('is-open')) openCard();
    });
    if(btn){
      btn.addEventListener('click',e=>{e.stopPropagation();toggleCard();});
      btn.addEventListener('keydown',e=>{ if(e.key==='Escape'){e.preventDefault();setOpen(card,false);updateModalState();} });
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && expandableCards.some(card=>card.classList.contains('is-open'))){
      closeAllChapterCards();
    }
  });
  if(!reduced){
    $$('.rp-tilt').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
        card.style.setProperty('--ry',(x*7).toFixed(2)+'deg'); card.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');
        card.style.setProperty('--tilt-x',(x*8).toFixed(1)+'px'); card.style.setProperty('--tilt-y',(y*8).toFixed(1)+'px'); card.classList.add('is-tilting');
      });
      card.addEventListener('pointerleave',()=>{card.classList.remove('is-tilting');card.style.removeProperty('--rx');card.style.removeProperty('--ry');card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});
    });
  }
  $$('[data-rp-map-point]').forEach((p,i)=>{
    if(i===0) p.classList.add('is-active');
    p.addEventListener('click',()=>{
      $$('[data-rp-map-point]').forEach(x=>x.classList.remove('is-active')); p.classList.add('is-active');
      const panel=$('[data-rp-map-panel]'); if(!panel) return;
      const h=$('h3',panel), para=$('p',panel), small=$('small',panel);
      if(h) h.textContent=p.dataset.title||''; if(para) para.textContent=p.dataset.desc||''; if(small) small.textContent=p.dataset.kind||'';
    });
  });

  const safeFile=(value,fallback)=>String(value||fallback).trim().replace(/[^a-z0-9ąćęłńóśźż _-]+/gi,'').replace(/\s+/g,'-').slice(0,80)||fallback;
  const downloadBlob=(blob,name)=>{ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},500); };
  $$('[data-rp-download-certificate]').forEach(btn=>btn.addEventListener('click',()=>{
    const box=btn.closest('[data-rp-certificate]'); if(!box) return;
    const name=(box.querySelector('[data-rp-cert-name]')?.value||'Screening participant').trim();
    const date=(box.querySelector('[data-rp-cert-date]')?.value||'Screening date').trim();
    const place=(box.querySelector('[data-rp-cert-place]')?.value||'Screening location').trim();
    const lang=document.body.dataset.lang==='pl'?'pl':'en';
    const canvas=document.createElement('canvas'); canvas.width=1600; canvas.height=1000; const ctx=canvas.getContext('2d');
    ctx.fillStyle='#070604'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const grd=ctx.createLinearGradient(0,0,1600,1000); grd.addColorStop(0,'rgba(233,193,111,.24)'); grd.addColorStop(.55,'rgba(255,242,210,.04)'); grd.addColorStop(1,'rgba(233,193,111,.16)'); ctx.fillStyle=grd; ctx.fillRect(42,42,1516,916);
    ctx.strokeStyle='rgba(233,193,111,.78)'; ctx.lineWidth=4; ctx.strokeRect(70,70,1460,860); ctx.strokeStyle='rgba(255,242,210,.22)'; ctx.lineWidth=1; ctx.strokeRect(104,104,1392,792);
    ctx.textAlign='center'; ctx.fillStyle='#e9c16f'; ctx.font='700 36px Georgia, serif'; ctx.fillText('RAP-ORT: PRAWDA SUMIENIA',800,190);
    ctx.fillStyle='#fff2d2'; ctx.font='500 78px Georgia, serif'; ctx.fillText(lang==='pl'?'Zapis uczestnictwa':'Screening Participant Record',800,300);
    ctx.fillStyle='rgba(255,242,210,.74)'; ctx.font='500 30px Arial, sans-serif'; ctx.fillText(lang==='pl'?'Potwierdza się udział osoby:':'This records the participation of:',800,390);
    ctx.fillStyle='#fff2d2'; ctx.font='600 64px Georgia, serif'; ctx.fillText(name,800,480);
    ctx.fillStyle='rgba(255,242,210,.78)'; ctx.font='500 30px Arial, sans-serif'; ctx.fillText(lang==='pl'?'w projekcji audiowizualnego dzieła historycznego inspirowanego raportami rtm. Witolda Pileckiego':'in the screening of an audiovisual historical work inspired by the reports of Cavalry Captain Witold Pilecki',800,560);
    ctx.fillStyle='#e9c16f'; ctx.font='600 28px Arial, sans-serif'; ctx.fillText(`${date} · ${place}`,800,650);
    ctx.fillStyle='rgba(255,242,210,.62)'; ctx.font='500 23px Arial, sans-serif'; ctx.fillText(lang==='pl'?'Wygenerowano lokalnie w przeglądarce. Dane nie zostały zapisane.':'Generated locally in the browser. No personal data was stored.',800,760);
    ctx.fillStyle='rgba(233,193,111,.78)'; ctx.font='700 24px Arial, sans-serif'; ctx.fillText('Piotr Lichwała / VIBROSŁAW',800,830);
    canvas.toBlob(blob=>downloadBlob(blob,`rap-ort-participant-record-${safeFile(name,'participant')}.png`),'image/png');
  }));
  $$('[data-rp-download-report]').forEach(btn=>btn.addEventListener('click',()=>{
    const box=btn.closest('[data-rp-anon-report]'); const t=(box?.querySelector('[data-rp-report-text]')?.value||'').trim(); if(!t) return;
    const lang=document.body.dataset.lang==='pl'?'pl':'en';
    const body=(lang==='pl'?`Anonimowy raport po seansie Rap-Ort: Prawda Sumienia

${t}

Wygenerowano lokalnie. Brak zapisu danych na stronie.`:`Anonymous report after Rap-Ort: Prawda Sumienia

${t}

Generated locally. No data was stored on the site.`);
    downloadBlob(new Blob([body],{type:'text/plain;charset=utf-8'}),'rap-ort-anonymous-report.txt');
  }));
  $$('[data-rp-copy-report]').forEach(btn=>btn.addEventListener('click',async()=>{
    const box=btn.closest('[data-rp-anon-report]'); const t=(box?.querySelector('[data-rp-report-text]')?.value||'').trim(); if(!t||!navigator.clipboard) return;
    await navigator.clipboard.writeText(t); const old=btn.textContent; btn.textContent=document.body.dataset.lang==='pl'?'Skopiowano':'Copied'; setTimeout(()=>btn.textContent=old,1600);
  }));
  $$('[data-rp-mail-report]').forEach(a=>a.addEventListener('click',()=>{
    const box=a.closest('[data-rp-anon-report]'); const t=(box?.querySelector('[data-rp-report-text]')?.value||'').trim(); if(!t) return;
    const subject=document.body.dataset.lang==='pl'?'Anonimowy raport po seansie Rap-Ort':'Anonymous report after Rap-Ort screening';
    a.href=`mailto:peter.lichwala@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(t+'\n\n[Submitted by viewer for manual archive review]')}`;
  }));

})();
