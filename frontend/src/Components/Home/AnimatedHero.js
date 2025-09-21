import React, { useEffect, useRef } from 'react';
import './AnimatedHero.css';

const AnimatedHero = () => {
  const p2Ref = useRef(null);
  const heroDownRef = useRef(null);
  const btnReactRef = useRef(null);

  useEffect(() => {
    // Typed.js effect for the second paragraph
    const typeText = (element, strings, typeSpeed = 50, backSpeed = 10, backDelay = 2000) => {
      let currentStringIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;
      let timeoutId;

      const type = () => {
        const currentString = strings[currentStringIndex];
        
        if (isDeleting) {
          element.textContent = currentString.substring(0, currentCharIndex - 1);
          currentCharIndex--;
        } else {
          element.textContent = currentString.substring(0, currentCharIndex + 1);
          currentCharIndex++;
        }

        let typeSpeedValue = isDeleting ? backSpeed : typeSpeed;

        if (!isDeleting && currentCharIndex === currentString.length) {
          typeSpeedValue = backDelay;
          isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
          isDeleting = false;
          currentStringIndex = (currentStringIndex + 1) % strings.length;
        }

        timeoutId = setTimeout(type, typeSpeedValue);
      };

      type();

      return () => clearTimeout(timeoutId);
    };

    // Start typing effect
    if (p2Ref.current) {
      const cleanup = typeText(p2Ref.current, ["MARKETING", "ADVERTISING", "LED WALLS", "CINEMA", "DESIGNING", "AND MANY MORE..."], 50, 10, 2000);
      return cleanup;
    }
  }, []);

  // Debug: Check if video loads
  useEffect(() => {
    const iframe = document.querySelector('.hero-video');
    if (iframe) {
      iframe.onload = () => console.log('YouTube video loaded successfully');
      iframe.onerror = () => console.log('YouTube video failed to load');
    }
  }, []);

  const handleHeroDownClick = (e) => {
    e.preventDefault();
    
    // Animate the button
    if (btnReactRef.current) {
      btnReactRef.current.style.opacity = '0.25';
      btnReactRef.current.style.transform = 'scale(1)';
      
      setTimeout(() => {
        btnReactRef.current.style.opacity = '0';
        btnReactRef.current.style.transform = 'scale(0)';
      }, 250);
    }

    // Smooth scroll to next section
    const target = document.querySelector('#this') || document.querySelector('.section');
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="animated-hero">
      {/* YouTube Video Background */}
      <div className="hero-video-container">
        <iframe
          className="hero-video"
          src="https://www.youtube.com/embed/qy0oX5A9WyY?autoplay=1&mute=1&loop=1&playlist=qy0oX5A9WyY&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&start=0&enablejsapi=1"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          loading="eager"
        ></iframe>
        {/* Fallback background image */}
        <div className="hero-fallback"></div>
      </div>
      
      <div className="hero-overlay"></div>
      
      <div className="inner-text">
        <p className="p1">D&S</p>
        <p className="p2" ref={p2Ref}>MARKETING</p>
      </div>
      
      <a 
        className="hero-down" 
        href="#this"
        ref={heroDownRef}
        onClick={handleHeroDownClick}
      >
        <div className="btn-react" ref={btnReactRef}></div>
        <i className="fa fa-chevron-down"></i>
      </a>
    </section>
  );
};

export default AnimatedHero;
