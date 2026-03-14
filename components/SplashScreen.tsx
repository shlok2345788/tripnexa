"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Prevent scrolling while splash is active
    document.body.style.overflow = "hidden";

    // Reveal then fade out animation
    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
        document.body.style.overflow = "auto";
      },
    });

    tl.fromTo(
      ".splash-logo",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }
    )
    .to(".splash-logo", {
        y: -20,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
    }, "+=0.5")
    .to(".splash-container", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    }, "+=0.2");

    return () => {
        document.body.style.overflow = "auto";
    }
  }, []);

  if (!show) return null;

  return (
    <div className="splash-container fixed inset-0 z-[9999] bg-[#0d0d0d] flex flex-col items-center justify-center">
      <div className="splash-logo">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest">
            Trip<span className="text-yellow-500">Nexa</span>
        </h1>
      </div>
    </div>
  );
}
