/**
 * Contains helper functions for DOM manipulation common
 * to YouTube and WebClient
 * */

import { IBookmark } from '../components/bookmark/Ibookmarks';
import { WEB_CLIENT_PLAYER_ID } from '../constants/componentNames';
import { WEB_CLIENT_STREAM_URL, YOUTUBE_VIDEO_URL } from '../constants/urls';
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
  try {
    const activeTab: chrome.tabs.Tab = await getCurrentTab();
    if (!activeTab) return;

    if (isYoutubeVideoId(activeTab)) {
      return getYoutubeVideoId(activeTab);
    }

    if (isWebClientVideo(activeTab)) {
      return getWebClientVideoId(activeTab);
    }
  } catch (error) {
    console.error('error getting video id: ', error);
  }
}

export function getWebClientVideoId(activeTab: chrome.tabs.Tab) {
  let videoId: string = activeTab.url.split('/').pop();

  if (videoId.includes('?')) {
    videoId = videoId.split('?').shift();
  }

  console.log('videoId: ', videoId);

  return videoId;
}

export function getYoutubeVideoId(activeTab: chrome.tabs.Tab) {
  const queryParameters = activeTab.url.split('?')[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideoId = urlParameters.get('v');
  console.log('currentVideoId: ', currentVideoId);
  return currentVideoId;
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

export function isWebClientVideo(tab: chrome.tabs.Tab): boolean {
  return tab.url.includes(WEB_CLIENT_STREAM_URL);
}

export function isYoutubeVideoId(tab: chrome.tabs.Tab): boolean {
  console.log('tab.url: ', tab);
  console.log(tab.url.includes(YOUTUBE_VIDEO_URL));
  return tab.url.includes(YOUTUBE_VIDEO_URL);
}

export function formatVideoTime(time: number): string {
  if (!time) return 'Time: 0 mins 0 seconds';
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);

  return `Time: ${minutes} mins ${seconds} seconds`;
}

/**
 * Draws the video element to a canvas and then converts
 * the canvas to a dataURL
 * then store it in the bookmark
 * */
export async function captureThumbnail(
  bookmark: IBookmark,
  playerId: string,
  isWebClient: boolean,
  isYoutube: boolean
): Promise<void> {
  try {
    let videoEl: HTMLVideoElement | HTMLCanvasElement;

    isWebClient
      ? (videoEl = document.getElementById(playerId) as
          | HTMLVideoElement
          | HTMLCanvasElement)
      : (videoEl = findElementByClassName(playerId) as
          | HTMLVideoElement
          | HTMLCanvasElement);

    if (!videoEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    canvas
      .getContext('2d')
      .drawImage(
        videoEl,
        0,
        0,
        videoEl.clientWidth,
        videoEl.clientHeight,
        120,
        120,
        canvas.width,
        canvas.height
      );

    const dataURL = canvas.toDataURL('image/png');

    bookmark.thumbnail = dataURL;
  } catch (error) {
    console.error(`error capturing thumbnail: ${error}`);
  }
}