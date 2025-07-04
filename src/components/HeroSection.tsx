import React, { useState, useRef, useEffect } from 'react';
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
// eslint-disable-next-line import/first
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const greetings = ['Welcome to Sri Lanka', 'Wonder of Asia', 'Pearl of the Indian Ocean'];
  const [currentGreeting, setCurrentGreeting] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        window.gtag?.('event', 'video_pause', { event_category: 'HeroSection', event_label: 'Pause Video' });
      } else {
        videoRef.current.play();
        window.gtag?.('event', 'video_play', { event_category: 'HeroSection', event_label: 'Play Video' });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isPlaying) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 3000); // Change greeting every 3 seconds
    return () => clearInterval(interval);
  }, [greetings.length]);

  return (
    <section className="hero-section relative overflow-hidden h-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="hero-video absolute inset-0 w-full h-full object-cover z-0"
        poster="/assets/hero-poster.jpg"
      >
        <source src="/assets/Hero-background.mp4" type="video/mp4" />
        <source src="/assets/Hero-background.webm" type="video/webm" />
        <img src="/assets/hero-poster.jpg" alt="Scenic Sri Lankan landscape with lush greenery" className="hero-video" />
      </video>
      <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10" />
      <div className="hero-content container mx-auto px-4 relative z-20 flex flex-col items-center justify-center h-full text-center">
        <div className="text-overlay mb-8 bg-black/30 backdrop-blur-sm py-6 px-8 rounded-lg animate-[fadeSlide_3s_ease-in-out_infinite]">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-wide drop-shadow-lg">
            {greetings[currentGreeting]}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Discover ancient heritage, pristine beaches, and vibrant traditions
          </p>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-[fadeIn_1.5s_ease-in-out]">
          Experience the <span className="text-yellow-400">Soul of Sri Lanka</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto opacity-90 animate-[fadeIn_1.5s_ease-in-out]">
          Plan your adventure through misty mountains, golden beaches, and UNESCO World Heritage sites
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Link
            to="/explore"
            className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 animate-[pulse_2s_ease-in-out_infinite] shadow-lg"
            onClick={() => window.gtag?.('event', 'click', { event_category: 'CTA', event_label: 'Explore Sri Lanka' })}
          >
            Explore Sri Lanka →
          </Link>
          <Link
            to="/booking"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md"
            onClick={() => window.gtag?.('event', 'click', { event_category: 'CTA', event_label: 'Start Your Journey' })}
          >
            Plan Your Trip
          </Link>
          <button
            onClick={togglePlay}
            className="inline-flex items-center bg-white/20 text-white px-6 py-2 rounded-full text-base font-medium hover:bg-white/30 transition duration-300 backdrop-blur-sm"
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              )}
            </svg>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;