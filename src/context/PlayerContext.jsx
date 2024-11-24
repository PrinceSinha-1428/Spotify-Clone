import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {



    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();


    const [track,setTrack]  = useState(songsData[0]);
    const [playerStatus,setPlayerStatus]  = useState(false);
    const [time,setTime] = useState({

        currentTime:{
            minute:0,
            second:0
        },

        totalTime:{
            minute:0,
            second:0
        }
    })  

    const playSong = ()=>{
        if(audioRef.current){
          audioRef.current.play();
          setPlayerStatus(true);
        }
       
    }
    const pauseSong = ()=>{
      if(audioRef.current){
        audioRef.current.pause();
        setPlayerStatus(false);
      }
    }
    const playwithId = async (id)=>{
      await setTrack(songsData[id]);
      await audioRef.current.play();
      setPlayerStatus(true);

    }
    const previous = async()=>{
      if(track.id > 0){
        await setTrack(songsData[track.id-1]);
        await audioRef.current.play();
        setPlayerStatus(true);
      }
    }
    const next = async()=>{
      if(track.id < songsData.length-1){
        await setTrack(songsData[track.id+1]);
        await audioRef.current.play();
        setPlayerStatus(true);
      }
    }
    const seekSong = async (e)=>{
      audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)

    }
    useEffect(()=>{
      setTimeout(() => {
        audioRef.current.ontimeupdate = ()=>{
          seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
          setTime({

            currentTime:{
                minute:Math.floor(audioRef.current.currentTime / 60),
                second:Math.floor(audioRef.current.currentTime % 60)
            },
    
            totalTime:{
                minute:Math.floor(audioRef.current.duration / 60),
                second:Math.floor(audioRef.current.duration % 60)
            }
        })
        }
        
      }, 1000);
    },[audioRef])


  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,setTrack,
    playerStatus,setPlayerStatus,
    time,setTime,
    playSong,pauseSong,playwithId,previous,next,seekSong
  };
  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};
export default PlayerContextProvider;
