import React from 'react';
import './bookmark.css';
import { IBookmark } from './Ibookmarks';
import { formatVideoTime } from '../../utils/domHelpers';


const Bookmark: React.FC<{
  bookmark: IBookmark;
  onPlay: (e) => void;
  onDelete: () => void;
  onBookmarkNameChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isYoutube: boolean;
  isWebClient: boolean;
}> = ({
  bookmark,
  onPlay,
  onDelete,
  onBookmarkNameChange,
  isYoutube,
  isWebClient,
}) => {
  return (
    <div className="bookmark">
      {/* <!-- item 1 - video thumbnail --> */}
      <div className="thumbnail">
        <img src={bookmark.thumbnail} className="thumbnail-img" />
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
          {isWebClient
            ? new Date(bookmark.timeDesc).toLocaleString()
            : isYoutube
            ? formatVideoTime(bookmark.time)
            : 'time: 00:00:00'}
        </h3>
      </div>

      <div className="bookmark-controls">
        <div
          onClick={onPlay}
          className="action-button action-button--medium action-button--play"
          id="bookmarkPlay"
          data-timestamp={bookmark.time}
        >
          <div
            style={{ display: 'none', position: 'absolute' }}
            id="boookmartimeforbutton"
          >
            {bookmark.time}
          </div>
          <img src="play.png" className="icon-img" />
        </div>
        <div
          onClick={onDelete}
          className="action-button action-button--medium"
          id="bookmartTrash"
        >
          <img src="delete.png" className="icon-img" />
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
