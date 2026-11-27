const languageButton = document.querySelector('#language');
const translations = [...document.querySelectorAll('[data-en]')].map(element => ({
  element, russian: element.textContent, english: element.dataset.en
}));
const image = document.querySelector('[data-alt-en]');
const russianAlt = image.alt;

languageButton.addEventListener('click', () => {
  const english = document.documentElement.lang === 'ru';
  document.documentElement.lang = english ? 'en' : 'ru';
  document.title = english ? 'Bucks for Vladosik · V.V.V' : 'Бабосики для Владосика · V.V.V';
  languageButton.lang = english ? 'ru' : 'en';
  languageButton.textContent = english ? 'RU' : 'EN';
  image.alt = english ? image.dataset.altEn : russianAlt;
  renderSceneText();
  for (const {element, russian, english: translation} of translations) {
    element.textContent = english ? translation : russian;
  }
});

const localPlayers = [...document.querySelectorAll('audio')];
for (const player of localPlayers) {
  player.addEventListener('play', () => {
    for (const other of localPlayers) {
      if (other !== player) other.pause();
    }
  });
}

const sceneImage = document.querySelector('#stage-image');
const sceneCaption = document.querySelector('#stage-caption');
const sceneButton = document.querySelector('#play-cat');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [
  ['walk', 'Обход владений', 'Inspecting the kingdom'],
  ['dance', 'Танцы после отчёта', 'Dancing after the audit'],
  ['milk', 'Молочный перерыв', 'Milk break'],
  ['throne', 'На троне', 'On the throne']
];
let sceneIndex = 3;
let sceneTimer;

function renderSceneText() {
  const english = document.documentElement.lang === 'en';
  sceneCaption.textContent = scenes[sceneIndex][english ? 2 : 1];
  sceneButton.textContent = reducedMotion.matches
    ? (english ? 'Next scene' : 'Следующая сцена')
    : sceneTimer
      ? (english ? 'Stop scene' : 'Остановить сцену')
      : (english ? 'Play the cat’s scene' : 'Включить сцену с котом');
}

function showScene(index) {
  sceneIndex = index;
  const [name] = scenes[index];
  sceneImage.src = 'media/cat-' + name + '.webp';
  sceneImage.dataset.action = sceneTimer ? name : '';
  renderSceneText();
}

function stopScene() {
  clearTimeout(sceneTimer);
  sceneTimer = undefined;
  showScene(sceneIndex);
}

function playScene(index) {
  sceneTimer = setTimeout(() => {
    if (index + 1 < scenes.length) playScene(index + 1);
    else stopScene();
  }, 2700);
  showScene(index);
}

sceneButton.addEventListener('click', () => {
  if (sceneTimer) stopScene();
  else if (reducedMotion.matches) showScene((sceneIndex + 1) % scenes.length);
  else playScene(0);
});
reducedMotion.addEventListener('change', stopScene);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && sceneTimer) stopScene();
});
renderSceneText();

const guide = document.querySelector('.cat-guide');
const dock = document.querySelector('.cat-dock');
const guideLayout = matchMedia('(min-width: 1340px) and (prefers-reduced-motion: no-preference)');
let dockVisible = false;
let guideFrame = 0;
let stepTimer;

function positionGuide() {
  guideFrame = 0;
  const distance = document.documentElement.scrollHeight - innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
  const visible = guideLayout.matches && !dockVisible && scrollY > 60;
  guide.classList.toggle('visible', visible);
  if (!visible) return;
  guide.style.setProperty('--guide-y', (18 + progress * 57) + 'vh');
  guide.classList.add('walking');
  clearTimeout(stepTimer);
  stepTimer = setTimeout(() => guide.classList.remove('walking'), 480);
}

function queueGuidePosition() {
  if (!guideFrame) guideFrame = requestAnimationFrame(positionGuide);
}

new IntersectionObserver(([entry]) => {
  dockVisible = entry.isIntersecting;
  dock.classList.toggle('arrived', dockVisible);
  queueGuidePosition();
}).observe(dock);
window.addEventListener('scroll', queueGuidePosition, {passive: true});
window.addEventListener('resize', queueGuidePosition);
guideLayout.addEventListener('change', queueGuidePosition);
queueGuidePosition();
