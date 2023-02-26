import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import Bookmark from '../components/bookmark';
import { IBookmark } from '../components/bookmark/Ibookmarks';
import { fetchBookmarks, updateBookmarks } from '../utils/api';
import {
  getVideoId,
  checkIfValidPage,
  getCurrentTab,
} from '../utils/domHelpers';
import { WEB_CLIENT_STREAM_URL } from '../constants/urls';
import { YOUTUBE_VIDEO_URL } from '../constants/urls';

const validVideoPageUrls: string[] = [WEB_CLIENT_STREAM_URL, YOUTUBE_VIDEO_URL];

const App: React.FC<{}> = () => {
  const [isValidPage, setIsValidPage] = React.useState<boolean>(false);
  const [bookmarks, setBookmarks] = React.useState<IBookmark[]>([]);
  const [activeTab, setActiveTab] = React.useState<chrome.tabs.Tab>(undefined);
  const [videoId, setVideoId] = React.useState<string>(undefined);

  useEffect(() => {
    /**
     * Find and set the active tab
     */
    getCurrentTab()
      .then((tab) => setActiveTab(tab))
      .catch((err) => {
        console.error(`Error getting current tab: ${err}`);
      });

    /**
     * Check if the page is a valid page i.e WebClient or YouTube
     * */
    checkIfValidPage(validVideoPageUrls)
      .then((isValid) => setIsValidPage(isValid))
      .catch((err) => {
        console.error(`Error checking if page is valid: ${err}`);
      });

    /**
     * Find the Video ID of the current video and fetch the bookmarks for that video
     * */
    getVideoId()
      .then((videoId) => {
        fetchBookmarks(videoId)
          .then((bookmarks) => {
            setBookmarks(bookmarks);
            setVideoId(bookmarks[0]?.videoId);
          })
          .catch((err) => {
            console.error(`Error fetching bookmarks: ${err}`);
          });
      })
      .catch((err) => {
        console.error(`Error getting video ID: ${err}`);
      });

    return () => {
      /**
       * cleanups - is this needed ?
       * do you trust javascript garbage collection, I don't :( (I'm looking at you, chrome)
       * */
      // setIsValidPage(undefined);
      // setBookmarks(undefined);
    };
  }, []);

  const onPlay = () => {};

  const onDelete = async (index: number) => {
    bookmarks.splice(index, 1);
    const updatedBookmarks = [...bookmarks];

    updateBookmarks(videoId, updatedBookmarks)
      .then(() => {
        setBookmarks([...bookmarks]);
      })
      .catch((err) => {
        console.error(`Error deleting bookmark: ${err}`);
      });
  };

  const onBookmarkNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      /***
       * using the previous bookmark name to
       * find the specific bookmark ? should find a better way ?!
       *
       */

      const previousBookmarkName = e.currentTarget.placeholder;

      const bookmark = bookmarks.find(
        (bookmark) => bookmark.bookmarkName === previousBookmarkName
      );

      bookmark.bookmarkName = e.currentTarget.value;

      updateBookmarks(videoId, bookmarks).then(() => {
        setBookmarks([...bookmarks]);
      });

      e.currentTarget.blur();
    }
  };

  return (
    <div className="container">
      <div className="title">
        {isValidPage
          ? 'Your Bookmarks For This Stream'
          : 'Not a Valid Video Page'}
      </div>
      <div className="bookmarksContainer">
        {renderBookmarks(
          isValidPage,
          bookmarks,
          onPlay,
          onDelete,
          onBookmarkNameChange
        )}
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

function renderBookmarks(
  isValidPage: boolean,
  bookmarks: IBookmark[],
  onPlay: () => void,
  onDelete: (index) => void,
  onBookmarkNameChange: (e: React.KeyboardEvent<HTMLInputElement>) => void
): React.ReactNode {
  if (bookmarks.length === 0 || !isValidPage)
    return <div className="title">No bookmarks yet</div>;

  return bookmarks.map((bookmark, index) => (
    <Bookmark
      key={index}
      bookmark={bookmark}
      onPlay={onPlay}
      onDelete={() => onDelete(index)}
      onBookmarkNameChange={onBookmarkNameChange}
    />
  ));
}

