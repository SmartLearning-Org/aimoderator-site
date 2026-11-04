const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.hidden = false;
document.documentElement.classList.add('js');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
toggle.addEventListener('click', () => {
  const opened = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(opened));
  nav.classList.toggle('is-open', opened);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

// Settle directly opened section links after fonts have established the final layout.
// Never move the page back after the visitor has started interacting with it.
const initialHash = window.location.hash;
if (initialHash) {
  let visitorInteracted = false;
  const cancelCorrection = () => { visitorInteracted = true; };
  const interactionEvents = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
  interactionEvents.forEach(type => window.addEventListener(type, cancelCorrection, { once: true, passive: true }));
  const pageLoaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
  Promise.all([pageLoaded, document.fonts ? document.fonts.ready : Promise.resolve()]).then(() => requestAnimationFrame(() => {
    interactionEvents.forEach(type => window.removeEventListener(type, cancelCorrection));
    if (visitorInteracted || window.location.hash !== initialHash) return;
    let targetId;
    try { targetId = decodeURIComponent(initialHash.slice(1)); } catch { return; }
    const target = document.getElementById(targetId);
    if (!target) return;
    const inset = document.querySelector('.header-inner').getBoundingClientRect().height;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - inset), behavior: 'instant' });
  }));
}

// Keep the narrated films from talking over each other.
const films = [...document.querySelectorAll('.film-player video')];
films.forEach(film => film.addEventListener('play', () => {
  films.forEach(other => { if (other !== film) other.pause(); });
}));

const examples = {
  connect: {
    context: 'Earlier in this fictional discussion, the group has repeatedly offered different proposals without comparing the reasoning behind them.',
    one: '“Giving the team more autonomy would help.”',
    two: '“I think clearer roles are more important.”',
    response: '“Where could greater autonomy and clearer roles support each other?”',
    takeaway: 'One possible contribution from a profile that encourages students to connect and compare ideas.'
  },
  include: {
    context: 'In this fictional discussion, several relevant contributions have followed Alex’s question, but nobody has addressed it. The excerpt shows the question and a later reply.',
    one: '“How might this affect people who are new to the team?”',
    two: '“Returning to our earlier point about deadlines…”',
    response: '“Before we move on, how does Alex’s question about new colleagues affect your proposals?”',
    takeaway: 'One possible contribution from a profile that encourages students to engage with overlooked ideas.'
  },
  space: {
    context: 'In this fictional activity, the selected profile includes a planned pause while students check sources. The group uses this time to examine evidence and reflect.',
    one: '“Let me check the source before I respond.”',
    two: '“Take your time. I’m thinking through your example.”',
    response: null,
    takeaway: 'This is an explanation of the example, not a message sent to the group.'
  }
};
const tabs = [...document.querySelectorAll('[data-example]')];
const stackedExamples = window.matchMedia('(min-width: 801px), (max-width: 540px)');
function setExampleOrientation() {
  document.querySelector('.example-tabs').setAttribute('aria-orientation', stackedExamples.matches ? 'vertical' : 'horizontal');
}
setExampleOrientation();
stackedExamples.addEventListener('change', setExampleOrientation);
function selectExample(tab, focus = false) {
  const choice = tab.dataset.example;
  const example = examples[choice];
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  document.querySelector('#example-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#example-panel').dataset.example = choice;
  document.querySelector('#example-scenario').textContent = example.context;
  document.querySelector('#student-one').textContent = example.one;
  document.querySelector('#student-two').textContent = example.two;
  document.querySelector('#moderator-message').hidden = example.response === null;
  document.querySelector('#moderator-response').textContent = example.response ?? '';
  document.querySelector('#pause-annotation').hidden = example.response !== null;
  document.querySelector('#example-takeaway').textContent = example.takeaway;
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectExample(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectExample(tabs[next], true); }
  });
});
