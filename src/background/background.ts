import { WEB_CLIENT_STREAM_URL } from '../constants/urls';
import { YOUTUBE_VIDEO_URL } from '../constants/urls';

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    try {
      if (tab.url && isWebClientVideo(tab) && tab.active) {
        let videoId: string = tab.url.split('/').pop();

        // checks if the video is in archive mode
        if (videoId.includes('?')) {
          videoId = videoId.split('?').shift();
        }

        // send a message to the content script
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabId, {
              type: 'NEW',
              videoId: videoId,
            });
          }
        );
      } else if (tab.url && isYoutubeVideo(tab)) {
        console.log('Hello youtube');
      }
    } catch (error) {
      console.error(`error finding a valid video url: ${error}`);
    }
  }
);

function isWebClientVideo(tab: chrome.tabs.Tab) {
  return tab.url.includes(WEB_CLIENT_STREAM_URL);
}

function isYoutubeVideo(tab: chrome.tabs.Tab) {
  return tab.url.includes(YOUTUBE_VIDEO_URL);
}
