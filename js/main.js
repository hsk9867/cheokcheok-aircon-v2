(function(){
  'use strict';
  var PHONE = '01077235728';

  /* ---- mobile menu ---- */
  var menuBtn = document.querySelector('[data-menu]');
  var mnav = document.querySelector('[data-mnav]');
  if (menuBtn && mnav) {
    menuBtn.addEventListener('click', function(){
      var open = mnav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    mnav.addEventListener('click', function(e){
      if (e.target.tagName === 'A') { mnav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded','false'); }
    });
  }

  /* ---- hero typography ---- */
  var heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    var idx0 = 0;
    heroTitle.innerHTML = heroTitle.innerHTML.split(/(<br\s*\/?>)/i).map(function(part){
      if (/^<br/i.test(part)) return part;
      return part.trim().split(/\s+/).filter(Boolean).map(function(w){
        return '<span class="w"><span style="--i:' + (idx0++) + '">' + w + '</span></span>';
      }).join(' ');
    }).join('');
    requestAnimationFrame(function(){ document.body.classList.add('hero-ready'); });
  }

  /* ---- hero slideshow ---- */
  var slides = document.querySelectorAll('[data-slides] img');
  var dotsBox = document.querySelector('[data-dots]');
  if (slides.length > 1) {
    var idx = 0, dots = [];
    for (var i = 0; i < slides.length; i++) {
      var d = document.createElement('i'); if (i === 0) d.className = 'is-on';
      dotsBox && dotsBox.appendChild(d); dots.push(d);
    }
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setInterval(function(){
      slides[idx].classList.remove('is-on'); dots[idx].classList.remove('is-on');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-on'); dots[idx].classList.add('is-on');
    }, 5000);
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ---- quick quote form ---- */
  var form = document.querySelector('[data-qform]');
  if (form) {
    form.querySelectorAll('.chips').forEach(function(group){
      group.addEventListener('click', function(e){
        var chip = e.target.closest('.chip'); if (!chip) return;
        group.querySelectorAll('.chip').forEach(function(c){ c.classList.toggle('is-on', c === chip && !c.classList.contains('is-on')); });
      });
    });
    function picked(name){ var c = form.querySelector('[data-group="'+name+'"] .chip.is-on'); return c ? c.textContent.trim() : ''; }
    function buildMessage(){
      var lines = ['[척척박사 시스템에어컨 견적문의]'];
      var p = picked('product'), s = picked('space');
      var qty = form.querySelector('#q-qty').value.trim();
      var area = form.querySelector('#q-area').value.trim();
      var memo = form.querySelector('#q-memo').value.trim();
      if (p) lines.push('설치 제품: ' + p);
      if (s) lines.push('설치 공간: ' + s);
      if (qty) lines.push('설치 대수: ' + qty);
      if (area) lines.push('설치 지역: ' + area);
      if (memo) lines.push('요청 사항: ' + memo);
      if (lines.length === 1) lines.push('견적 상담을 요청합니다.');
      return lines.join('\n');
    }
    function isMobile(){ return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }
    function copyText(text, btn){
      var done = function(){ var o = btn.textContent; btn.textContent = '복사되었습니다'; setTimeout(function(){ btn.textContent = o; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function(){ fallback(text); done(); });
      else { fallback(text); done(); }
      function fallback(t){ var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e){} document.body.removeChild(ta); }
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = buildMessage();
      if (isMobile()) {
        var sep = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?';
        window.location.href = 'sms:' + PHONE + sep + 'body=' + encodeURIComponent(msg);
      } else {
        copyText(msg, form.querySelector('[data-copy]'));
        window.alert('문의 내용이 복사되었습니다.\n문자(010-7723-5728)로 붙여넣어 보내주시거나 전화로 문의해 주세요.');
      }
    });
    var copyBtn = form.querySelector('[data-copy]');
    copyBtn && copyBtn.addEventListener('click', function(){ copyText(buildMessage(), copyBtn); });
  }
})();
