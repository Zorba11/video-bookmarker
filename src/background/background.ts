import { WEB_CLIENT_STREAM_URL } from '../constants/urls';
import { YOUTUBE_VIDEO_URL } from '../constants/urls';
import {
  captureAndStoreTabThumbnail,
  captureTabThumbnail as captureThumbnailUrl,
} from '../utils/api';
import {
  getWebClientVideoId,
  getYoutubeVideoId,
  isWebClientVideo,
  isYoutubeVideoId,
} from '../utils/domHelpers';

/***
 * Listens for a new valid Video page and sends a message to the content script
 */
chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    try {
      let videoId: string = tab?.url.split('/').pop();

      if (videoId && isWebClientVideo(tab) && tab.active) {
        videoId = getWebClientVideoId(tab);

        // send a message to the content script
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabId, {
              type: 'NewWebClientVideo',
              videoId: videoId,
            });
          }
        );
      } else if (videoId && isYoutubeVideoId(tab)) {
        videoId = getYoutubeVideoId(tab);
        // send a message to the content script
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabId, {
              type: 'NewYoutubeVideo',
              videoId: videoId,
            });
          }
        );
      }
    } catch (error) {
      console.error(`error finding a valid video url: ${error}`);
    }
  }
);

/**
 * Listens for a message from the content script to capture a thumbnail
 * ----unused so far------
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CaptureThumbnail':
      captureAndStoreTabThumbnail(message.videoId, message.currentTime);
      break;
    default:
      break;
  }
});
