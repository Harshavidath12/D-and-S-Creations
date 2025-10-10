import React from "react";

export const Videos = (props) => {
  return (
    <div id="videos" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>{props.data ? props.data.title : "Dhamma Chants Videos"}</h2>
          <p>{props.data ? props.data.subtitle : "Listen to these beautiful chants"}</p>
        </div>
        <div className="row">
          <div className="video-grid">
            {props.data && props.data.videos
              ? props.data.videos.map((video, i) => (
                  <div key={`${video.title}-${i}`} className="col-sm-6 col-md-4 col-lg-4">
                    <div className="simple-video-card">
                      <div className="video-thumbnail">
                        <img src={video.thumbnail || '/img/placeholder-video.jpg'} alt={video.title} />
                        <div className="play-button">
                          <i className="fa fa-play"></i>
                        </div>
                      </div>
                      <div className="video-info">
                        <h4>{video.title}</h4>
                        <p>{video.description || 'Video description'}</p>
                      </div>
                    </div>
                  </div>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
