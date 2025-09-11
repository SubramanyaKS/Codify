import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../store/auth';
import AuthModal from './AuthModal/AuthModal';
import './YouTubePlayer.css';

// This internal component now contains ALL of your original, feature-rich player logic.
// Nothing has been removed.
const AuthenticatedPlayer = ({ videoId, courseId, externalVideoId: propExternalVideoId }) => {
  const { API, userdata } = useAuth();
  const token = localStorage.getItem('token');
  const [player, setPlayer] = useState(null);
  
  // All of your original states are preserved
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [courseProgress, setCourseProgress] = useState(null);
  const [error, setError] = useState(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [videoProgressMap, setVideoProgressMap] = useState({});
  
  const progressInterval = useRef(null);
  const playerContainerId = `Youtubeer-container-${videoId}`; // Unique ID for the player container

  // Your original, detailed useEffect for initializing the YouTube IFrame Player is fully restored.
  useEffect(() => {
    if (!videoId) {
      setError('Invalid YouTube Video ID');
      setVideoLoading(false);
      return;
    }
    
    setError(null);
    setVideoLoading(true);

    // This function initializes a new player or loads a new video into an existing one.
    const initializePlayer = () => {
      // If a player instance already exists, just load the new video.
      if (player && typeof player.loadVideoById === 'function') {
        try {
          player.loadVideoById({ videoId: videoId });
          return;
        } catch (e) {
          console.error("Error loading video by ID, will re-initialize.", e);
        }
      }
      
      // If no player, create a new one.
      const playerContainer = document.getElementById(playerContainerId);
      if (playerContainer) {
        // Clean container for re-initialization
        playerContainer.innerHTML = ''; 
      } else {
        setError("Player container element not found in the DOM.");
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
      if (progressInterval.current) clearInterval(progressInterval.current);
      // We destroy the player on cleanup to avoid memory leaks when the component unmounts.
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId]); // This hook correctly re-runs when the videoId changes.

  // Your original function to fetch course progress is preserved
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
        setCourseProgress(data.progress);
        if (data.progress?.videoProgress) {
          setVideoProgressMap(data.progress.videoProgress);
        }
        const videoSpecificProgress = data.progress?.videoProgress?.[currentVideoId];
        const savedTime = videoSpecificProgress?.currentTime || data.progress?.currentVideoTime || 0;
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

  // All your other original useEffects and handlers are preserved
  useEffect(() => {
    if (playerLoaded) { // Only fetch progress once the player is ready to be controlled
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
    setVideoLoading(playerState === 3); // 3 = Buffering

    if (playerState === 1) { // 1 = Playing
      setIsPlaying(true);
      if (progressInterval.current) clearInterval(progressInterval.current);
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
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
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

  // Your original JSX for the authenticated player is preserved
  return (
    <div className="w-full h-full relative">
      {/* **FIXED**: The ID is now correct and consistent */}
      <div id={playerContainerId} className="w-full h-full"></div>
      
      {videoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
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
  
  // When the videoId changes, reset the play state.
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
          <div className="video-thumbnail-wrapper" onClick={handlePlayClick}>
            <img 
              src={thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} 
              alt="Video Thumbnail" 
              className="video-thumbnail-img" 
              onError={(e) => { e.target.onerror = null; e.target.src=`https://i.ytimg.com/vi/${videoId}/sddefault.jpg`}}
            />
            <div className="play-button-overlay">
              <div className="play-button-icon">▶</div>
            </div>
            <p className="play-button-text">Log In to Watch</p>
          </div>
        )}
      </div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default YouTubePlayer;

