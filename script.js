/* Maroon & Gold nikah invitation — plain JS */
(function () {
  "use strict";

  /* ---------------- opening video → couple photo → invitation ---------------- */
  var intro = document.getElementById("intro");
  var video = document.getElementById("openingVideo");
  var veil = document.getElementById("introVeil");
  var playButton = document.getElementById("playButton");
  var coupleReveal = document.getElementById("coupleReveal");
  var couplePhoto = document.getElementById("couplePhoto");
  var site = document.getElementById("site");
  var entered = false;
  var playing = false;
  var showingCouple = false;

  // No couple photo file yet -> keep the elegant monogram placeholder behind.
  couplePhoto.addEventListener("error", function () { couplePhoto.style.display = "none"; });

  document.body.classList.add("locked");

  function enter() {
    if (entered) return;
    entered = true;
    try { video.pause(); } catch (e) {}
    intro.classList.add("leaving");
    site.hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { sizeCanvas(); });
    setTimeout(function () { intro.style.display = "none"; }, 900);
  }

  function startPlayback() {
    veil.classList.add("gone");
    playing = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  // The moment the video ends, the bride & groom photo appears — no separate
  // "open invitation" step. A tap during playback jumps straight to the photo,
  // and a tap on the photo enters the invitation.
  function showCouple() {
    if (entered || showingCouple) return;
    showingCouple = true;
    try { video.pause(); } catch (e) {}
    veil.classList.add("gone");
    video.classList.add("dim");
    coupleReveal.hidden = false;
    requestAnimationFrame(function () { coupleReveal.classList.add("in"); });
  }

  playButton.addEventListener("click", function (e) { e.stopPropagation(); startPlayback(); });
  veil.addEventListener("click", startPlayback);

  intro.addEventListener("click", function (e) {
    if (entered) return;
    if (e.target.closest("#introVeil")) return; // veil starts playback itself
    if (showingCouple) { enter(); return; }
    if (playing) showCouple();
  });

  video.addEventListener("ended", function () {
    playing = false;
    showCouple();
  });
  video.addEventListener("error", function () { showCouple(); });

  /* ---------------- reveal on scroll ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------------- scratch-to-reveal ---------------- */
  var canvas = document.getElementById("scratchCanvas");
  var wrap = canvas.parentElement;
  var ctx = canvas.getContext("2d", { willReadFrequently: true });
  var revealed = false;
  var drawing = false;
  var last = null;

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = wrap.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return; // site still hidden — will size on enter
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    paintFoil();
  }

  function paintFoil() {
    var w = canvas.width, h = canvas.height;
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#6b1020");
    g.addColorStop(0.4, "#3a0812");
    g.addColorStop(0.65, "#52101c");
    g.addColorStop(1, "#2b060d");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // gold diagonal sheen
    ctx.strokeStyle = "rgba(201,162,74,0.28)";
    ctx.lineWidth = Math.max(5, w * 0.018);
    for (var x = -h; x < w + h; x += w * 0.13) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.5, h); ctx.stroke();
    }
    // gold dotted texture
    ctx.fillStyle = "rgba(201,162,74,0.22)";
    var step = Math.max(10, w * 0.03);
    for (var yy = step / 2; yy < h; yy += step)
      for (var xx = step / 2; xx < w; xx += step) {
        ctx.beginPath(); ctx.arc(xx, yy, Math.max(1.5, w * 0.004), 0, 7); ctx.fill();
      }
    // label
    ctx.fillStyle = "rgba(243,226,179,0.92)";
    ctx.font = "400 " + Math.round(h * 0.12) + "px Jost, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✦  SCRATCH HERE  ✦", w / 2, h / 2);
  }

  function scratchAt(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    var dpr = canvas.width / r.width;
    var x = (clientX - r.left) * dpr;
    var y = (clientY - r.top) * dpr;
    var rad = Math.max(24, r.width * 0.07) * dpr;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    if (last) {
      ctx.lineWidth = rad * 2;
      ctx.lineCap = "round";
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, rad, 0, 7);
      ctx.fill();
    }
    last = { x: x, y: y };
  }

  function clearedFraction() {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var step = 32, total = 0, clear = 0;
    for (var i = 3; i < data.length; i += 4 * step) {
      total++;
      if (data[i] < 40) clear++;
    }
    return clear / total;
  }

  function finishReveal() {
    revealed = true;
    canvas.classList.add("gone");
    setTimeout(function () { canvas.style.display = "none"; }, 800);
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (revealed) return;
    drawing = true; last = null;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    scratchAt(e.clientX, e.clientY);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drawing || revealed) return;
    scratchAt(e.clientX, e.clientY);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
    canvas.addEventListener(ev, function () {
      if (!drawing) return;
      drawing = false; last = null;
      if (!revealed && clearedFraction() > 0.4) finishReveal();
    });
  });

  window.addEventListener("resize", function () {
    if (!revealed) sizeCanvas();
  });
  sizeCanvas();

  /* ---------------- story carousel ---------------- */
  var track = document.getElementById("carouselTrack");
  var dotsBox = document.getElementById("carouselDots");
  var slides = track.children.length;
  var idx = 0;
  var autoTimer = null;

  for (var d = 0; d < slides; d++) {
    (function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to photo " + (n + 1));
      b.addEventListener("click", function () { goTo(n); restartAuto(); });
      dotsBox.appendChild(b);
    })(d);
  }
  var dots = dotsBox.children;

  function goTo(n) {
    idx = (n + slides) % slides;
    track.style.transform = "translateX(-" + idx * 100 + "%)";
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === idx);
  }
  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(idx + 1); }, 5500);
  }
  document.getElementById("carPrev").addEventListener("click", function () { goTo(idx - 1); restartAuto(); });
  document.getElementById("carNext").addEventListener("click", function () { goTo(idx + 1); restartAuto(); });

  // basic touch swipe
  var touchX = null;
  track.addEventListener("pointerdown", function (e) { touchX = e.clientX; });
  track.addEventListener("pointerup", function (e) {
    if (touchX === null) return;
    var dx = e.clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) { goTo(idx + (dx < 0 ? 1 : -1)); restartAuto(); }
  });
  goTo(0);
  restartAuto();

  /* ---------------- countdown to the nikah ---------------- */
  var target = new Date("2026-11-15T10:30:00+05:30").getTime();
  var cdD = document.getElementById("cdDays");
  var cdH = document.getElementById("cdHours");
  var cdM = document.getElementById("cdMins");
  var cdS = document.getElementById("cdSecs");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var s = Math.floor(diff / 1000);
    cdD.textContent = pad(Math.floor(s / 86400));
    cdH.textContent = pad(Math.floor((s % 86400) / 3600));
    cdM.textContent = pad(Math.floor((s % 3600) / 60));
    cdS.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------- RSVP (demo) ---------------- */
  var form = document.getElementById("rsvpForm");
  var success = document.getElementById("rsvpSuccess");
  var nameInput = document.getElementById("rsvpName");
  var nameEcho = document.getElementById("rsvpNameEcho");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    nameEcho.textContent = (nameInput.value || "dear guest").trim() || "dear guest";
    form.hidden = true;
    success.hidden = false;
  });
  document.getElementById("rsvpEdit").addEventListener("click", function () {
    success.hidden = true;
    form.hidden = false;
  });
})();
