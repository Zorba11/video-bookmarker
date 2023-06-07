import { createYTBookmarkButton, playYTBookmark } from '../utils/YTHelpers';
import {
  createBookmarkButton as createWCBookmarkButton,
  playWebClientBookmark,
} from '../utils/webClientHelpers';

/**
 * Beginning of the content script
 **/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'NewWebClientVideo':
      /**
       * Inorder to handle the race condition when the background script
       * sends the message to create the bookmark button before the content is loaded
       * DOMContentLoaded event is not working :( so let's use a timeout
       */
      setTimeout(() => createWCBookmarkButton(message.videoId), 2000);
      break;
    case 'NewYoutubeVideo':
      setTimeout(() => createYTBookmarkButton(message.videoId), 2000);
      break;
    case 'PlayYTBookmark':
      playYTBookmark(message.value);
      break;
    case 'PlayWebClientBookmark':
      playWebClientBookmark(message.value, message?.videoId);
    default:
      break;
  }

  // sendResponse('Button created');
});
