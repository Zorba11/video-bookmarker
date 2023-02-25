import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import Bookmark from '../components/bookmark';

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

  return (
    <div className="container">
      <div className="title">Your bookmarks for this Stream</div>
      <div className="bookmarksContainer">
        <Bookmark onplay={onPlay} onDelete={onDelete} />
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);