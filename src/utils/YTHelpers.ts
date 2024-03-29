import { IBookmark } from '../components/bookmark/Ibookmarks';
import {
  PLAYER_LEFT_CONTROLS_CLASSNAME,
  PLAYER_RIGHT_CONTROLS_CLASSNAME,
  YT_PLAYER_CLASSNAME,
} from '../constants/componentNames';
import { fetchBookmarks, storeBookmark } from './api';
import {
  autoAddBookMarkName,
  bookmarkButtonExist,
  findElementByClassName,
} from './domHelpers';

export function createYTBookmarkButton(videoId: string) {
  console.log('Hello from content script');
  let bookmarkButton: HTMLImageElement;
  if (bookmarkButtonExist()) {
    bookmarkButton = findElementByClassName(
      'bookmark-button'
    ) as HTMLImageElement;
  }

  bookmarkButtonExist()
    ? (bookmarkButton = findElementByClassName(
        'bookmark-button'
      ) as HTMLImageElement)
    : (bookmarkButton = document.createElement('img'));

  const playerControlsLeftBar: HTMLElement = findElementByClassName(
    PLAYER_LEFT_CONTROLS_CLASSNAME
  );

  if (!playerControlsLeftBar) return;

  setBookmarkButtonStyles(bookmarkButton);
  playerControlsLeftBar.appendChild(bookmarkButton);

  bookmarkButton.addEventListener('click', () => {
    addNewBookMarkHandler(videoId);
  });
}

function setBookmarkButtonStyles(bookmarkButton: HTMLImageElement): void {
  bookmarkButton.className = 'bookmark-button';
  bookmarkButton.src = `${chrome.runtime.getURL('bookmark.png')}`;
  bookmarkButton.title = 'Click to bookmark current timestamp';
  bookmarkButton.style.width = '36px';
  bookmarkButton.style.height = '36px';
  bookmarkButton.style.marginTop = '6px';
  bookmarkButton.style.cursor = 'pointer';
}

function ytPlayer(): HTMLVideoElement {
  return findElementByClassName(YT_PLAYER_CLASSNAME) as HTMLVideoElement;
}

async function addNewBookMarkHandler(videoId: string): Promise<void> {
  if (!ytPlayer()) return;

  const currentTime = ytPlayer().currentTime;

  // bookmark schema
  const newBookMark: IBookmark = {
    videoId,
    bookmarkName: 'bookmark 1',
    time: currentTime,
    timeDesc: new Date(currentTime).toString().slice(0, 24),
    // thumbnail: 'thumbnail.png',
  };

  // always make sure to get the latest bookmarks
  let currentVideoBookmarks: IBookmark[] = await fetchBookmarks(videoId);

  if (!currentVideoBookmarks) currentVideoBookmarks = [];

  // adding a default name to the bookmark
  autoAddBookMarkName(currentVideoBookmarks, newBookMark);

  // captureThumbnail(newBookMark, YT_PLAYER_CLASSNAME, null, true);

  storeBookmark(newBookMark, currentVideoBookmarks);
  console.log(currentVideoBookmarks);
}

export function playYTBookmark(time: number): void {
  const youtubePlayer = ytPlayer();
  if (!youtubePlayer) return;

  youtubePlayer.currentTime = time;
}
