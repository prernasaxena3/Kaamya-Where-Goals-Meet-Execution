import { createContext, useContext, useState, useRef, useEffect } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("rain");
  const audioRef = useRef(null);

  // Available sounds (files inside /public/sounds/)
  const soundOptions = {
    rain: "/rain.mp3",
    nature: "/nature.mp3",
    thunder: "/thunder.mp3",
    forest: "/forest.mp3",
  };

  // Initialize default sound
  useEffect(() => {
    audioRef.current = new Audio(soundOptions[currentSound]);
    audioRef.current.loop = true;
  }, []);

  const setSound = (soundKey) => {
    setCurrentSound(soundKey);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(soundOptions[soundKey]);
    audioRef.current.loop = true;

    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, togglePlay, currentSound, setSound, soundOptions }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
