import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import Bookmark from '../components/bookmark';
import { IBookmark } from '../components/bookmark/Ibookmarks';
import { fetchBookmarks } from '../utils/api';

const App: React.FC<{}> = () => {
  const onPlay = () => {
    // const playButton = document.getElementById('bookmarkPlay');
    // playButton.classList.add('playAnimation');
    // const playImg = document.getElementById('playImg') as HTMLImageElement;
    // playImg.src = 'playActive.png';
    // playImg.classList.add('playAnimation');
  };

  const onDelete = () => {
    // const playButton = document.getElementById('bookmarkPlay');
    // playButton.classList.remove('playAnimation');
  };

  function getBookmarProps(): IBookmark {
    return {
      thumbnail: 'thumbnail.png',
      bookmarkName: 'Bookmark Name',
      timeDesc: 'Feb 13, 10:39 am',
      time: 123,
    };
  }

  useEffect(() => {
    // const bookmarks = await fetchBookmarks();
  }, []);

  return (
    <div className="container">
      <div className="title">Your bookmarks for this Stream</div>
      <div className="bookmarksContainer">
        <Bookmark
          bookmark={getBookmarProps()}
          onPlay={onPlay}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
