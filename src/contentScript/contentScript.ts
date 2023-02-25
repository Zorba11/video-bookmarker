import { createBookmarkButton } from '../utils/webClientHelpers';

/**
 * Beginning of the content script
 * */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEW') {
    /**
     * timeout is a temporary solution for the race condition
     * where the content script is loaded only after the background script
     * has sent the message
     * */
    setTimeout(() => createBookmarkButton(message.videoId), 2000);
  }

  // sendResponse('Button created');
});
