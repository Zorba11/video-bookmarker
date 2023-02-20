import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import Bookmark from '../components/bookmark';

const App: React.FC<{}> = () => {
  return (
    <div className="container">
      <div className="title">Your bookmarks for this Stream</div>
      <div className="bookmarksContainer">
        <Bookmark />
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);