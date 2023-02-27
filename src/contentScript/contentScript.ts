import { createYTBookmarkButton } from '../utils/YTHelpers';
import { createBookmarkButton as createWCBookmarkButton } from '../utils/webClientHelpers';

/**
 * Beginning of the content script
 **/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'NewWebClientVideo':
      // Listen to the DOMContentLoaded event to ensure the page is fully loaded
      document.addEventListener('DOMContentLoaded', () => {
        createWCBookmarkButton(message.videoId);
      });
      break;
    case 'NewYoutubeVideo':
      createYTBookmarkButton(message.videoId);
    default:
      break;
  }

  // sendResponse('Button created');
});
