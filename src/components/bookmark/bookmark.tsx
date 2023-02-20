import React from 'react';
import './bookmark.css';
const Bookmark: React.FC<{}> = () => {
  return (
    <div className="bookmark">
      {/* <!-- item 1 - video thumbnail --> */}
      <div className="thumbnail">
        <img src="thumbnail.png" className="thumbnail-img" />
      </div>

      {/* <!-- video name & timestamp --> */}
      <div className="description">
        <h2 className="stream-name">Stream Name</h2>
        <h3 className="timestamp">Feb 13, 10:39 am</h3>
      </div>

      <div className="bookmark-controls">
        <div className="actionButton actionButton--medium" id="forward">
          <img src="play.png" className="iconImg" />
        </div>
        <div className="actionButton actionButton--medium" id="forward">
          <img src="delete.png" className="iconImg" />
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
