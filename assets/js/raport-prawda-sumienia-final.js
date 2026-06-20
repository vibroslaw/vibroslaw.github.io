(function(){
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('reduced-motion');
  $$('[data-rp-expand-card]').forEach(card=>{
    const btn=$('button',card);
    const setOpen=(target,open)=>{
      target.classList.toggle('is-open',open);
      const targetBtn=$('button',target);
      if(targetBtn) targetBtn.setAttribute('aria-expanded',open?'true':'false');
    };
    const toggle=()=>{ const was=card.classList.contains('is-open'); $$('[data-rp-expand-card].is-open').forEach(c=>{if(c!==card)setOpen(c,false)}); setOpen(card,!was); };
    card.addEventListener('click',e=>{ if(e.target.closest('a,button')) return; toggle(); });
    if(btn){
      btn.addEventListener('click',e=>{e.stopPropagation();toggle();});
      btn.addEventListener('keydown',e=>{ if(e.key==='Escape'){e.preventDefault();setOpen(card,false);} });
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
