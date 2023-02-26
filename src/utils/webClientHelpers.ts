import { IBookmark } from '../components/bookmark/Ibookmarks';
import {
  PLAYER_CONTROLS_CLASSNAME,
  WEB_CLIENT_PLAYER_ID,
  PLAYER_OVERLAY_DATE,
  PLAYER_OVERLAY_TIME,
} from '../constants/componentNames';
import { fetchBookmarks, requestCaptureThumbnail, storeBookmark } from './api';
import {
  autoAddBookMarkName,
  bookmarkButtonExist,
  captureThumbnail,
  findElementByClassName,
} from './domHelpers';

export function setBookmarkButtonStyles(
  bookmarkButton: HTMLImageElement
): void {
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

export async function addNewBookMarkHandler(videoId: string): Promise<void> {
  try {
    const currentTime = getCurrentTime();
    const newBookMark: IBookmark = {
      videoId,
      bookmarkName: 'bookmark 1',
      time: currentTime,
      timeDesc: new Date(currentTime).toString().slice(0, 24),
      thumbnail: 'thumbnail.png',
    };

    // always make sure to get the latest bookmarks
    const currentVideoBookmarks: IBookmark[] = await fetchBookmarks(videoId);

    autoAddBookMarkName(currentVideoBookmarks, newBookMark);

    captureThumbnail(newBookMark, WEB_CLIENT_PLAYER_ID, true, null);

    storeBookmark(newBookMark, currentVideoBookmarks);

    console.log(currentVideoBookmarks);
  } catch (error) {
    console.error(`error adding new bookmark: ${error}`);
  }
}

export function getCurrentTime(): number {
  // we are getting the current timestamp from the overlay date time values
  const playerOverlayTimeEl = findElementByClassName(PLAYER_OVERLAY_TIME);
  const playerOverlayDateEl = findElementByClassName(PLAYER_OVERLAY_DATE);

  const dateTime =
    playerOverlayTimeEl.textContent + ' ' + playerOverlayDateEl.textContent;

  return dateTime ? new Date(dateTime).getTime() : 0;
}

export function createBookmarkButton(videoId: string): void {
  console.log('Hello from content script');

  if (bookmarkButtonExist()) return;

  const bookmarkButton: HTMLImageElement = document.createElement('img');
  const playerControlsBar: HTMLElement = findElementByClassName(
    PLAYER_CONTROLS_CLASSNAME
  );

  setBookmarkButtonStyles(bookmarkButton);

  playerControlsBar.insertBefore(bookmarkButton, playerControlsBar.children[6]);

  bookmarkButton.addEventListener('click', () =>
    addNewBookMarkHandler(videoId)
  );
}
