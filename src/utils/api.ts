import { IBookmark } from '../components/bookmark/Ibookmarks';

export function fetchBookmarks(currentVideoId: string): Promise<any> {
  try {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([currentVideoId], (result) => {
        resolve(
          result[currentVideoId] ? JSON.parse(result[currentVideoId]) : []
        );
      });
    });
  } catch (error) {
    console.error(`Error fetching bookmarks: ${error}`);
  }
}

export async function storeBookmark(
  newBookmark: IBookmark,
  currentVideoBookmarks: IBookmark[]
): Promise<void> {
  try {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({
      // save and sort the bookmarks
      [newBookmark.videoId]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  } catch (error) {
    console.error(`Error storing bookmark: ${error}`);
  }
}
