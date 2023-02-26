/**
 * Contains helper functions for DOM manipulation common
 * to YouTube and WebClient
 * */

import { IBookmark } from '../components/bookmark/Ibookmarks';
import { fetchBookmarks } from './api';

/**
 * Checks if the bookmark button is already in the DOM
 */
export function bookmarkButtonExist(): boolean {
  return document.getElementsByClassName('bookmark-button')[0] ? true : false;
}

/**
 * finds the first element with the given class name in the DOM
 *  */
export function findElementByClassName(className: string): HTMLElement | null {
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

/**
 * get current active tab
 * */
export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * Gets the Video ID based on the current active tab
 * */
export async function getVideoId(): Promise<string> {
  const activeTab: chrome.tabs.Tab = await getCurrentTab();

  if (!activeTab) return;

  let videoId: string = activeTab.url.split('/').pop();

  if (videoId.includes('?')) {
    videoId = videoId.split('?').shift();
  }

  return videoId;
}

export async function checkIfValidPage(pages: string[]): Promise<boolean> {
  const activeTab = await getCurrentTab();

  if (!activeTab) return false;

  for (const page of pages) {
    if (activeTab.url.includes(page)) return true;
  }
  return false;
}

/**
 * Just a helper function to auto add a default
 * bookmark name based on
 * the number of bookmarks
 * */
export function autoAddBookMarkName(
  currentVideoBookmarks: IBookmark[],
  newBookMark: IBookmark
) {
  currentVideoBookmarks.length > 0
    ? (newBookMark.bookmarkName = `bookmark ${
        currentVideoBookmarks.length + 1
      }`)
    : (newBookMark.bookmarkName = 'bookmark');
}
