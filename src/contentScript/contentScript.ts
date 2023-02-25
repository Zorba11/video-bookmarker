import { PLAYER_CONTROLS_CLASSNAME } from '../constants/componentNames';

function bookmarkButtonExist(): boolean {
  return document.getElementsByClassName('bookmark-button')[0] ? true : false;
}

function findElementByClassName(className: string): HTMLElement | null {
  let elements: HTMLCollectionOf<Element> = document.getElementsByTagName('*');

  if (elements.length === 0) return null;

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].classList.length > 0) {
      for (let j = 0; j < elements[i].classList.length; j++) {
        if (elements[i].classList[j].startsWith(className)) {
          return elements[i] as HTMLElement;
        }
      }
    }
  }
}

function setBookmarkButtonStyles(bookmarkButton: HTMLImageElement) {
  bookmarkButton.className = 'bookmark-button';
  bookmarkButton.src = `${chrome.runtime.getURL('bookmark.png')}`;
  bookmarkButton.title = 'Click to bookmark current timestamp';
  bookmarkButton.style.width = '37px';
  bookmarkButton.style.height = '27px';
  bookmarkButton.style.paddingLeft = '6px';
  bookmarkButton.style.paddingRight = '6px';
  bookmarkButton.style.marginTop = '4px';
  bookmarkButton.style.cursor = 'pointer';
}

const createBookmarkButton = () => {
  console.log('Hello from content script');

  if (bookmarkButtonExist()) return;

  const bookmarkButton: HTMLImageElement = document.createElement('img');
  const playerControlsBar: HTMLElement = findElementByClassName(
    PLAYER_CONTROLS_CLASSNAME
  );

  setBookmarkButtonStyles(bookmarkButton);

  if (!playerControlsBar) return;

  playerControlsBar.insertBefore(bookmarkButton, playerControlsBar.children[6]);

  // playerControlsBar.addEventListener('load', () => {

  // });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW') {
    /**
     * timeout is a temporary solution for the problem of the
     * button not being created due to the slow loading of the page
     * */
    setTimeout(createBookmarkButton, 2000);
  }

  // sendResponse('Button created');
});
