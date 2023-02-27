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
        chrome.tabs.sendMessage(tabId, {
          type: 'NewWebClientVideo',
          videoId: videoId,
        });
      } else if (videoId && isYoutubeVideoId(tab)) {
        videoId = getYoutubeVideoId(tab);
        // send a message to the content script
        chrome.tabs.sendMessage(tabId, {
          type: 'NewYoutubeVideo',
          videoId: videoId,
        });
      }
    } catch (error) {
      console.error(`error finding a valid video url: ${error}`);
    }
  }
);
