import { createYTBookmarkButton } from '../utils/YTHelpers';
import { createBookmarkButton as createWCBookmarkButton } from '../utils/webClientHelpers';

/**
 * Beginning of the content script
 **/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'NewWebClientVideo':
      /**
       * timeout is a temporary solution for the race condition
       * where the content script is loaded only after the background script
       * has sent the message
       * */
      setTimeout(() => createWCBookmarkButton(message.videoId), 2000);
      break;
    case 'NewYoutubeVideo':
      createYTBookmarkButton(message.videoId);
    default:
      break;
  }

  // sendResponse('Button created');
});
