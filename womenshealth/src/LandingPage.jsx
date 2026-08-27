import "./landingPage.css";
import { useEffect } from 'react';

function LandingPage({ onTransitionToHome }) {
  
  useEffect(() => {
  
    const timer = setTimeout(() => {
      onTransitionToHome();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTransitionToHome]);

  return (
    <div className="landing-viewport">
      <div className="landing-content-frame">
        <h1 className="landing-brand-title">Women's Health</h1>
        <div className="landing-divider-line"></div>
        <h3 className="landing-welcome-sub">Welcome</h3>
      </div>
    </div>
  );
}

export default LandingPage;
