import React, { useState, useEffect, useRef, useCallback } from 'react';
// Note: Assuming 'useAuth' and 'AuthModal' are correctly imported from your project structure.
import { useAuth } from '../store/auth'; 
import AuthModal from './AuthModal/AuthModal';


// This internal component contains all the feature-rich player logic.
const AuthenticatedPlayer = ({ videoId, courseId, externalVideoId: propExternalVideoId }) => {
  const { API, userdata } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [player, setPlayer] = useState(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  
  const progressInterval = useRef(null);
  const playerContainerId = `Youtubeer-container-${videoId}-${Math.random()}`; // Unique ID

  useEffect(() => {
    if (!videoId) {
      setError('Invalid YouTube Video ID');
      setVideoLoading(false);
      return;
    }
    
    setError(null);
    setVideoLoading(true);

    const initializePlayer = () => {
      if (player && typeof player.loadVideoById === 'function') {
        try {
          player.loadVideoById({ videoId: videoId });
          return;
        } catch (e) {
          console.error("Error loading video, will re-initialize.", e);
        }
      }
      
      const playerContainer = document.getElementById(playerContainerId);
      if (playerContainer) {
        playerContainer.innerHTML = ''; 
      } else {
        setError("Player container element not found.");
        return;
      }

      try {
        const newPlayer = new window.YT.Player(playerContainerId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: { 'playsinline': 1, 'rel': 0, 'modestbranding': 1, 'autoplay': 1 },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': (e) => {
              setError(`Error loading video (code: ${e.data})`);
              setVideoLoading(false);
            }
          }
        });
        setPlayer(newPlayer);
      } catch (err) {
          console.error("Error creating YouTube player:", err);
          setError("Failed to create video player.");
      }
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = initializePlayer;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    return () => {
      clearInterval(progressInterval.current);
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId, playerContainerId]);

  const fetchCourseProgress = useCallback(async () => {
    if (!token || !userdata?._id || !courseId) return;
    
    const currentVideoId = propExternalVideoId || videoId;
    if (!currentVideoId) return;

    try {
      const response = await fetch(`${API}/progress/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const videoSpecificProgress = data.progress?.videoProgress?.[currentVideoId];
        const savedTime = videoSpecificProgress?.currentTime || 0;
        if (savedTime > 0) {
            setMaxWatchedTime(savedTime);
            if(player && typeof player.seekTo === 'function') {
                player.seekTo(savedTime, true);
            }
        }
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  }, [API, courseId, player, token, userdata, videoId, propExternalVideoId]);

  useEffect(() => {
    if (playerLoaded) {
      fetchCourseProgress();
    }
  }, [playerLoaded, fetchCourseProgress]);

  const onPlayerReady = (event) => {
    setPlayerLoaded(true);
    setVideoLoading(false);
    setDuration(event.target.getDuration());
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    const playerState = event.data;
    setVideoLoading(playerState === 3); // Buffering

    if (playerState === 1) { // Playing
      setIsPlaying(true);
      progressInterval.current = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
          const newCurrentTime = player.getCurrentTime();
          const newDuration = player.getDuration();
          setCurrentTime(newCurrentTime);
          setDuration(newDuration);
          setMaxWatchedTime(prev => Math.max(prev, newCurrentTime));
          if (newDuration > 0) {
            setProgress(Math.round((newCurrentTime / newDuration) * 100));
          }
        }
      }, 1000);
    } else { // Paused, Ended, etc.
      setIsPlaying(false);
      clearInterval(progressInterval.current);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (error) {
    return (
      <div className="aspect-video flex items-center justify-center bg-black text-white p-4">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div id={playerContainerId} className="w-full h-full"></div>
      
      {videoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <div className="flex justify-between items-center mb-2 text-white">
          <div className="text-xs font-mono">
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            <span className="ml-2 text-gray-400">(Max: {formatTime(maxWatchedTime)})</span>
          </div>
          <span className="text-sm font-medium">{progress}% completed</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================================
//  This is the main component. Its job is to act as the authentication gate.
// ===================================================================================
const YouTubePlayer = ({ videoId, thumbnailUrl, courseId, externalVideoId }) => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const handlePlayClick = () => {
    if (isLoggedIn) {
      setPlayVideo(true);
    } else {
      setShowModal(true);
    }
  };
  
  useEffect(() => {
    setPlayVideo(false);
  }, [videoId]);

  return (
    <>
      <div className="aspect-video w-full relative bg-black rounded-lg overflow-hidden">
        {isLoggedIn && playVideo ? (
          <AuthenticatedPlayer 
            videoId={videoId} 
            courseId={courseId}
            externalVideoId={externalVideoId} 
          />
        ) : (
          <div 
            className="group w-full h-full cursor-pointer relative flex justify-center items-center overflow-hidden" 
            onClick={handlePlayClick}
          >
            <img 
              src={thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
              onError={(e) => { e.target.onerror = null; e.target.src=`https://i.ytimg.com/vi/${videoId}/sddefault.jpg`}}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-center items-center transition-colors duration-300 ease-in-out group-hover:bg-black/60">
              <div className="text-6xl text-white drop-shadow-lg scale-100 transition-transform duration-200 ease-in-out group-hover:scale-110">
                ▶
              </div>
            </div>
            {!isLoggedIn && (
                 <p className="absolute bottom-5 text-white font-bold bg-black/70 py-1.5 px-4 rounded-full text-sm backdrop-blur-sm border border-white/20">
                    Log In to Watch
                 </p>
            )}
          </div>
        )}
      </div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default YouTubePlayer;
