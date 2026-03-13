import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) =>{

    const [song, setSong] = useState({

        "url": "https://ik.imagekit.io/mjzo2x4am/cohort-2/moodify/songs/Maiyya_Mainu_kYA1fwBiq.mp3",
        "posterUrl": "https://ik.imagekit.io/mjzo2x4am/cohort-2/moodify/posters/Maiyya_Mainu_LQHcnxo9Z.jpeg",
        "title": "Maiyya Mainu",
        "mood": "happy",        
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
            {children}
        </SongContext.Provider>
    )
}