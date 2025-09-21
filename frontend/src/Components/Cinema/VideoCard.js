import React from "react";

export const VideoCard = ({ video, onSelect }) => {
  console.log('🎬 VideoCard rendered with video:', video);
  console.log('🎫 Video slotInfo:', video.slotInfo);
  
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
      
      {/* Movie Dates Display */}
      {(video.startDate || video.endDate) && (
        <div className="movie-dates">
          {video.startDate && (
            <div className="date-item">
              <span className="date-label">From:</span>
              <span className="date-value">
                {new Date(video.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          {video.endDate && (
            <div className="date-item">
              <span className="date-label">To:</span>
              <span className="date-value">
                {new Date(video.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Pricing Card - Similar to the image design */}
      <div className="pricing-card">
        {video.slotInfo && (
          <>
            {video.slotInfo.starting && (
              <div className="pricing-item">
                <div className="pricing-label">STARTING</div>
                <div className="pricing-details">
                  <span className="availability-badge">
                    {video.slotInfo.starting.count} of {video.slotInfo.starting.total} available
                  </span>
                  <span className="price-badge">
                    LKR {video.slotInfo.starting.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {video.slotInfo.interval && (
              <div className="pricing-item">
                <div className="pricing-label">INTERVAL</div>
                <div className="pricing-details">
                  <span className="availability-badge">
                    {video.slotInfo.interval.count} of {video.slotInfo.interval.total} available
                  </span>
                  <span className="price-badge">
                    LKR {video.slotInfo.interval.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {video.slotInfo.ending && (
              <div className="pricing-item">
                <div className="pricing-label">ENDING</div>
                <div className="pricing-details">
                  <span className="availability-badge">
                    {video.slotInfo.ending.count} of {video.slotInfo.ending.total} available
                  </span>
                  <span className="price-badge">
                    LKR {video.slotInfo.ending.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        {(!video.slotInfo || (!video.slotInfo.starting && !video.slotInfo.interval && !video.slotInfo.ending)) && (
          <div className="no-slots-available">
            <p>No slot information available</p>
          </div>
        )}
      </div>
      
      <button className="choose-video-btn" onClick={handleButtonClick}>
        Select This Movie
      </button>
    </div>
  );
};
