import React from "react";

export const VideoCard = ({ video, onSelect }) => {
  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return video.thumbnail || '/img/placeholder-video.jpg'; // Fallback
  };

  const handleVideoClick = () => {
    // Always redirect to YouTube when video thumbnail is clicked
    window.open(video.youtubeUrl, '_blank');
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent video click when button is clicked
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail" onClick={handleVideoClick}>
        <img src={getYouTubeThumbnail(video.youtubeUrl)} alt={video.title} />
        <div className="play-button">
          <i className="fa fa-play"></i>
        </div>
        <div className="video-overlay">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-subtitle">NEW OFFICIAL TRAILER</p>
        </div>
      </div>
      <div className="video-content">
        <div className="slot-info">
          {video.slotInfo && (
            <div className="slot-categories">
              {video.slotInfo.starting && (
                <div className="slot-category">
                  <div className="category-info">
                    <span className="category-label">Starting</span>
                    <span className="slot-count">{video.slotInfo.starting.count} slots</span>
                  </div>
                  <span className="slot-price">LKR {video.slotInfo.starting.price}</span>
                </div>
              )}
              {video.slotInfo.interval && (
                <div className="slot-category">
                  <div className="category-info">
                    <span className="category-label">Interval</span>
                    <span className="slot-count">{video.slotInfo.interval.count} slots</span>
                  </div>
                  <span className="slot-price">LKR {video.slotInfo.interval.price}</span>
                </div>
              )}
              {video.slotInfo.ending && (
                <div className="slot-category">
                  <div className="category-info">
                    <span className="category-label">Ending</span>
                    <span className="slot-count">{video.slotInfo.ending.count} slots</span>
                  </div>
                  <span className="slot-price">LKR {video.slotInfo.ending.price}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <button className="choose-video-btn" onClick={handleButtonClick} style={{
          marginBottom: '30px',
          fontWeight: '100',
          fontSize: '18px',
          color: '#e63946',
          width: '100%',
          height: '45px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#6c757d',
          transition: '0.2s ease-in-out',
          cursor: 'pointer'
        }}>
          Select This Movie
        </button>
      </div>
    </div>
  );
};
