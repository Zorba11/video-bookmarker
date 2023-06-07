import { IBookmark } from '../components/bookmark/Ibookmarks';

export function fetchBookmarks(currentVideoId: string): Promise<any> {
  try {
    if (currentVideoId) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get([currentVideoId], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(
              result[currentVideoId] ? JSON.parse(result[currentVideoId]) : []
            );
          }
        });
      });
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error(`Error fetching bookmarks: ${error}`);
  }
}

export async function storeBookmark(
  newBookmark: IBookmark,
  currentVideoBookmarks: IBookmark[]
): Promise<void> {
  try {
    chrome.storage.local.set({
      // save and sort the bookmarks
      [newBookmark.videoId]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  } catch (error) {
    console.error(`Error storing bookmark: ${error}`);
  }
}

export async function updateBookmarks(
  currentVideoId: string,
  updatedBookmarks: IBookmark[]
): Promise<void> {
  /**
   * TODO: Should make this more efficient by only updating the specific bookmark
   * */

  chrome.storage.local.set({
    [currentVideoId]: JSON.stringify(updatedBookmarks),
  });
}

/***
 * Sends a message to the background script to capture a screenshot of the tab
 */
export async function requestCaptureThumbnail(
  videoId: string,
  currentTime: number
): Promise<void> {
  chrome.runtime.sendMessage({
    type: 'CaptureThumbnail',
    videoId,
    currentTime,
  });
}

/**
 * This function is called from the background script
 * to capture a thumbnail of the current tab
 * ---- unused ----
 */

export function captureTabThumbnail(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png' },
      (dataUrl: string) => {
        resolve(dataUrl);
      }
    );
  });
}

/***
 * This function is called from the background script
 * capture and store the thumbnail screenshot
 * ---- unused ----
 */

export async function captureAndStoreTabThumbnail(
  videoId: string,
  time: number
) {
  const thumbnail = await captureTabThumbnail();
  const currentVideoBookmarks = await fetchBookmarks(videoId);
  const updatedBookmarks = currentVideoBookmarks.map((bookmark) => {
    if (bookmark.time === time) {
      bookmark.thumbnail = thumbnail;
    }
    return bookmark;
  });
  updateBookmarks(videoId, updatedBookmarks);
}

export function requestBookmarkPlay(
  activeTab: chrome.tabs.Tab,
  timestamp: string,
  isYoutube: boolean,
  isWebClient: boolean,
  videoId?: string
) {
  if (isYoutube) {
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'PlayYTBookmark',
      value: timestamp,
    });
  }

  if (isWebClient) {
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'PlayWebClientBookmark',
      value: timestamp,
      videoId: videoId,
    });
  }
}
