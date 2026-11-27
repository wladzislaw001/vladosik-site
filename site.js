const languageButton = document.querySelector('#language');
const translations = [...document.querySelectorAll('[data-en]')].map(element => ({
  element, russian: element.textContent, english: element.dataset.en
}));
const image = document.querySelector('[data-alt-en]');
const russianAlt = image.alt;
const copyStatus = document.querySelector('#copy-status');

languageButton.addEventListener('click', () => {
  const english = document.documentElement.lang === 'ru';
  document.documentElement.lang = english ? 'en' : 'ru';
  document.title = english ? 'Bucks for Vladosik · V.V.V' : 'Бабосики для Владосика · V.V.V';
  languageButton.lang = english ? 'ru' : 'en';
  languageButton.textContent = english ? 'RU' : 'EN';
  image.alt = english ? image.dataset.altEn : russianAlt;
  copyStatus.textContent = '';
  for (const {element, russian, english: translation} of translations) {
    element.textContent = english ? translation : russian;
  }
});

document.querySelector('#copy').addEventListener('click', async () => {
  const iban = document.querySelector('#iban');
  const english = document.documentElement.lang === 'en';
  try {
    await navigator.clipboard.writeText(iban.textContent.replaceAll(' ', ''));
    copyStatus.textContent = english ? 'IBAN copied.' : 'IBAN скопирован.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(iban);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = english ? 'IBAN selected. Copy it manually.' : 'IBAN выделен. Скопируй его вручную.';
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
