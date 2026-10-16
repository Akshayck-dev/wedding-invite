/* Maroon & Gold wedding invitation — plain JS */
(function () {
  "use strict";

  /* ---------------- opening video ---------------- */
  var intro = document.getElementById("intro");
  var video = document.getElementById("openingVideo");
  var veil = document.getElementById("introVeil");
  var playButton = document.getElementById("playButton");
  var introCta = document.getElementById("introCta");
  var enterButton = document.getElementById("enterButton");
  var site = document.getElementById("site");
  var entered = false;
  var playing = false;

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
    if (p && p.catch) p.catch(function () { /* keep poster; user can tap again */ });
  }

  playButton.addEventListener("click", function (e) { e.stopPropagation(); startPlayback(); });
  veil.addEventListener("click", startPlayback);

  // A tap anywhere on the intro once the video is running (or finished) enters the invitation.
  // The veil handles playback start itself — its taps must not bubble into enter().
  intro.addEventListener("click", function (e) {
    if (entered) return;
    if (e.target.closest("#introVeil")) return;
    if (playing || !introCta.hidden) enter();
  });

  video.addEventListener("ended", function () {
    playing = false;
    introCta.hidden = false;
  });
  enterButton.addEventListener("click", function (e) { e.stopPropagation(); enter(); });

  // If the video cannot play at all, offer the enter button right away.
  video.addEventListener("error", function () {
    veil.classList.add("gone");
    introCta.hidden = false;
  });

  /* ---------------- navigation ---------------- */
  var menuToggle = document.getElementById("menuToggle");
  var siteNav = document.getElementById("siteNav");

  menuToggle.addEventListener("click", function () {
    var open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  function goTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  document.querySelectorAll("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      goTo(btn.getAttribute("data-go"));
    });
  });

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
  var title = document.getElementById("scratchTitle");
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
    g.addColorStop(0, "#b98a34");
    g.addColorStop(0.35, "#f3d98b");
    g.addColorStop(0.55, "#d4a94e");
    g.addColorStop(0.8, "#8a6420");
    g.addColorStop(1, "#c9a24a");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // diagonal sheen
    ctx.strokeStyle = "rgba(255,246,208,0.35)";
    ctx.lineWidth = Math.max(6, w * 0.02);
    for (var x = -h; x < w + h; x += w * 0.14) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.5, h); ctx.stroke();
    }
    // dotted texture
    ctx.fillStyle = "rgba(120,80,20,0.18)";
    var step = Math.max(10, w * 0.03);
    for (var yy = step / 2; yy < h; yy += step)
      for (var xx = step / 2; xx < w; xx += step) {
        ctx.beginPath(); ctx.arc(xx, yy, Math.max(1.5, w * 0.004), 0, 7); ctx.fill();
      }
    // label
    ctx.fillStyle = "rgba(58,20,8,0.85)";
    ctx.font = "500 " + Math.round(h * 0.11) + "px Jost, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var label = "✦  SCRATCH HERE  ✦";
    ctx.save();
    ctx.letterSpacing = Math.round(w * 0.012) + "px";
    ctx.fillText(label, w / 2, h / 2);
    ctx.restore();
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
    var w = canvas.width, h = canvas.height;
    var data = ctx.getImageData(0, 0, w, h).data;
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
    title.classList.add("gone");
    setTimeout(function () { canvas.style.display = "none"; }, 800);
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (revealed) return;
    drawing = true; last = null;
    canvas.setPointerCapture(e.pointerId);
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
