import React from 'react';
import './bookmark.css';
import { IBookmark } from './Ibookmarks';

const Bookmark: React.FC<{
  bookmark: IBookmark;
  onPlay: () => void;
  onDelete: () => void;
  onBookmarkNameChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ bookmark, onPlay, onDelete, onBookmarkNameChange }) => {
  return (
    <div className="bookmark" id={bookmark.time.toString()}>
      {/* <!-- item 1 - video thumbnail --> */}
      <div className="thumbnail">
        <img src="thumbnail.png" className="thumbnail-img" />
      </div>

      {/* <!-- video name & timestamp --> */}
      <div className="description">
        <input
          className="bookmarkName"
          placeholder={bookmark.bookmarkName}
          onKeyDown={onBookmarkNameChange}
        ></input>
        {/* <h3 className="timestamp">{bookmark.timeDesc.split(' ').join(', ')}</h3> */}
        <h3 className="timestamp">
          {new Date(bookmark.timeDesc).toLocaleString()}
        </h3>
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
