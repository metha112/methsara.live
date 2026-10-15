// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Typing effect
const roles = ['Networking Enthusiast.', 'System Design Learner.', 'Future Network Engineer.'];
const typed = document.getElementById('typed');
let r = 0, c = 0, del = false;
function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1600); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 35 : 80);
}
if (reduce) typed.textContent = roles[0]; else type();

// Reveal sections on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Network topology animation: nodes, links, and packets travelling along links
const cv = document.getElementById('net');
const ctx = cv.getContext('2d');
let W, H, nodes = [], links = [], packets = [];

function build() {
  W = cv.width = innerWidth;
  H = cv.height = innerHeight;
  const count = Math.min(60, Math.floor(W * H / 22000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
  }));
  packets = [];
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  links = [];
  nodes.forEach(n => {
    if (!reduce) { n.x += n.vx; n.y += n.vy; }
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 170) {
        links.push([a, b]);
        ctx.strokeStyle = `rgba(56,214,232,${.28 * (1 - d / 170)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  ctx.fillStyle = '#38d6e8';
  nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 2.4, 0, 6.283); ctx.fill(); });

  if (!reduce && links.length && packets.length < 14 && Math.random() < .06) {
    const l = links[Math.floor(Math.random() * links.length)];
    packets.push({ a: l[0], b: l[1], t: 0 });
  }
  ctx.fillStyle = '#ffb454';
  packets = packets.filter(p => p.t < 1);
  packets.forEach(p => {
    p.t += .012;
    ctx.beginPath();
    ctx.arc(p.a.x + (p.b.x - p.a.x) * p.t, p.a.y + (p.b.y - p.a.y) * p.t, 3, 0, 6.283);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}

addEventListener('resize', build);
build();
draw();
