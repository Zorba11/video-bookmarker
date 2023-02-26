import { IBookmark } from '../components/bookmark/Ibookmarks';
import {
  PLAYER_CONTROLS_CLASSNAME,
  PLAYER_ID,
  PLAYER_OVERLAY_DATE,
  PLAYER_OVERLAY_TIME,
} from '../constants/componentNames';
import { fetchBookmarks, requestCaptureThumbnail, storeBookmark } from './api';
import { findElementByClassName } from './domHelpers';

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

    captureThumbnail(newBookMark);

    storeBookmark(newBookMark, currentVideoBookmarks);

    console.log(currentVideoBookmarks);
  } catch (error) {
    console.error(`error adding new bookmark: ${error}`);
  }
}

/**
 * Draws the video element to a canvas and then converts
 * the canvas to a dataURL
 * then store it in the bookmark
 * */
function captureThumbnail(bookmark: IBookmark): void {
  try {
    const videoEl = document.getElementById(PLAYER_ID) as
      | HTMLVideoElement
      | HTMLCanvasElement;

    if (!videoEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    canvas
      .getContext('2d')
      .drawImage(
        videoEl,
        0,
        0,
        videoEl.clientWidth,
        videoEl.clientHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

    const dataURL = canvas.toDataURL('image/png');

    bookmark.thumbnail = dataURL;
  } catch (error) {
    console.error(`error capturing thumbnail: ${error}`);
  }
}

/**
 * Just a helper function to auto add bookmark name based on
 * the number of bookmarks
 * */

function autoAddBookMarkName(
  currentVideoBookmarks: IBookmark[],
  newBookMark: IBookmark
) {
  currentVideoBookmarks.length > 0
    ? (newBookMark.bookmarkName = `bookmark ${
        currentVideoBookmarks.length + 1
      }`)
    : (newBookMark.bookmarkName = 'bookmark');
}

export function getCurrentTime(): number {
  // we are getting the current timestamp from the overlay date time values
  const playerOverlayTimeEl = findElementByClassName(PLAYER_OVERLAY_TIME);
  const playerOverlayDateEl = findElementByClassName(PLAYER_OVERLAY_DATE);

  const dateTime =
    playerOverlayTimeEl.textContent + ' ' + playerOverlayDateEl.textContent;

  return dateTime ? new Date(dateTime).getTime() : 0;
}

function bookmarkButtonExist(): boolean {
  return document.getElementsByClassName('bookmark-button')[0] ? true : false;
}

export function createBookmarkButton(videoId: string): void {
  console.log('Hello from content script');

  if (bookmarkButtonExist()) return;

  const bookmarkButton: HTMLImageElement = document.createElement('img');
  const playerControlsBar: HTMLElement = findElementByClassName(
    PLAYER_CONTROLS_CLASSNAME
  );

  setBookmarkButtonStyles(bookmarkButton);

  if (!playerControlsBar) return;

  playerControlsBar.insertBefore(bookmarkButton, playerControlsBar.children[6]);

  bookmarkButton.addEventListener('click', () =>
    addNewBookMarkHandler(videoId)
  );
}
