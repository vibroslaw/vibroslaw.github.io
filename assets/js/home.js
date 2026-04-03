
const q = (s, p = document) => p.querySelector(s);
const qa = (s, p = document) => [...p.querySelectorAll(s)];

const revealItems = qa('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach(item => revealObserver.observe(item));

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.documentElement.style.setProperty('--progress', `${progress}%`);
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const hero = q('.hero');
const updateParallax = () => {
  if (document.body.classList.contains('reduced-motion') || !hero) return;
  const rect = hero.getBoundingClientRect();
  const offset = Math.max(-30, Math.min(30, rect.top * -0.04));
  document.documentElement.style.setProperty('--hero-parallax', `${offset}px`);
};
window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

const pageTransition = q('#pageTransition');
qa('a[href]:not([href^="#"]):not([target="_blank"])').forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    pageTransition?.classList.add('active');
  });
});

const storageKeys = {
  project: 'lastVisitedProject',
  motion: 'siteReducedMotion'
};

const trackedLinks = qa('[data-track]');
trackedLinks.forEach(link => {
  link.addEventListener('click', () => {
    const title = link.dataset.track;
    const href = link.getAttribute('href');
    localStorage.setItem(storageKeys.project, JSON.stringify({ title, href }));
  });
});

const continueBanner = q('#continueBanner');
const continueButton = q('#continueButton');
const continueText = q('#continueText');
const dismissContinue = q('#dismissContinue');
const storedProject = localStorage.getItem(storageKeys.project);
const dismissed = sessionStorage.getItem('dismissedContinue');

if (storedProject && !dismissed && continueBanner && continueButton && continueText) {
  try {
    const project = JSON.parse(storedProject);
    if (project && project.href && project.title) {
      continueButton.href = project.href;
      continueButton.textContent = continueButton.dataset.label.replace('{title}', project.title);
      continueText.textContent = continueText.dataset.label.replace('{title}', project.title);
      continueBanner.classList.add('visible');
    }
  } catch {}
}
dismissContinue?.addEventListener('click', () => {
  continueBanner?.classList.remove('visible');
  sessionStorage.setItem('dismissedContinue', 'true');
});

const cinematicToggle = q('#cinematicToggle');
const cinematicHeroButton = q('#cinematicHeroButton');
const toggleCinematicMode = () => {
  document.body.classList.toggle('cinematic-mode');
  const active = document.body.classList.contains('cinematic-mode');
  if (cinematicToggle) cinematicToggle.textContent = active ? cinematicToggle.dataset.exit : cinematicToggle.dataset.enter;
  if (cinematicHeroButton) cinematicHeroButton.textContent = active ? cinematicHeroButton.dataset.exit : cinematicHeroButton.dataset.enter;
};
cinematicToggle?.addEventListener('click', toggleCinematicMode);
cinematicHeroButton?.addEventListener('click', toggleCinematicMode);

const reducedMotionToggle = q('#reducedMotionToggle');
if (localStorage.getItem(storageKeys.motion) === 'true') {
  document.body.classList.add('reduced-motion');
  if (reducedMotionToggle) reducedMotionToggle.textContent = reducedMotionToggle.dataset.restore;
}
reducedMotionToggle?.addEventListener('click', () => {
  document.body.classList.toggle('reduced-motion');
  const enabled = document.body.classList.contains('reduced-motion');
  localStorage.setItem(storageKeys.motion, enabled ? 'true' : 'false');
  reducedMotionToggle.textContent = enabled ? reducedMotionToggle.dataset.restore : reducedMotionToggle.dataset.reduce;
});

q('#scrollTopButton')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: document.body.classList.contains('reduced-motion') ? 'auto' : 'smooth' });
});

const quoteElement = q('#memoryQuoteText');
try {
  const quotes = JSON.parse(document.body.dataset.quotes || '[]');
  if (quoteElement && quotes.length) {
    const quoteIndex = new Date().getDate() % quotes.length;
    quoteElement.textContent = quotes[quoteIndex];
  }
} catch {}

const navToggle = q('#navToggle');
const mobilePanel = q('#mobilePanel');
const closeMenu = () => document.body.classList.remove('menu-open');
navToggle?.addEventListener('click', () => document.body.classList.toggle('menu-open'));
qa('.mobile-link', mobilePanel).forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
mobilePanel?.addEventListener('click', (e) => {
  if (e.target === mobilePanel) closeMenu();
});

const mobileCinematic = q('#mobileCinematicToggle');
mobileCinematic?.addEventListener('click', () => {
  toggleCinematicMode();
  closeMenu();
});
