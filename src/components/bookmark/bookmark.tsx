import React from 'react';
import './bookmark.css';
const Bookmark: React.FC<{
  onplay: () => void;
  onDelete: () => void;
}> = ({ onplay, onDelete }) => {
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
        <div
          onClick={onplay}
          className="actionButton actionButton--medium"
          id="bookmarkPlay"
        >
          <img src="play.png" className="iconImg" id="playImg" />
        </div>
        <div
          onClick={onDelete}
          className="actionButton actionButton--medium"
          id="bookmartTrash"
        >
          <img src="delete.png" className="iconImg delImg" />
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
