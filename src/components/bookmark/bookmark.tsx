import React from 'react';
import './bookmark.css';
import { IBookmark } from './Ibookmarks';

const Bookmark: React.FC<{ bookmark: IBookmark; onPlay; onDelete }> = ({
  bookmark,
  onPlay,
  onDelete,
}) => {
  return (
    <div className="bookmark">
      {/* <!-- item 1 - video thumbnail --> */}
      <div className="thumbnail">
        <img src="thumbnail.png" className="thumbnail-img" />
      </div>

      {/* <!-- video name & timestamp --> */}
      <div className="description">
        <h2 className="bookmarkName">{bookmark.bookmarkName}</h2>
        <h3 className="timestamp">{bookmark.timeDesc}</h3>
      </div>

      <div className="bookmark-controls">
        <div
          onClick={onPlay}
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
