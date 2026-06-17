import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";


export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        const expression = detect({ landmarkerRef, videoRef, setExpression })
        console.log(expression)
        onClick(expression)
    }


    const getMoodDisplay = (exp) => {
        const value = exp ? exp.toLowerCase() : "";
        if (value.includes("happy")) {
            return { text: "Happy 😄", className: "mood-badge__value--happy" };
        } else if (value.includes("sad")) {
            return { text: "Sad 😢", className: "mood-badge__value--sad" };
        } else if (value.includes("surprise")) {
            return { text: "Surprised 😲", className: "mood-badge__value--surprised" };
        } else if (value.includes("neutral")) {
            return { text: "Neutral 😐", className: "mood-badge__value--neutral" };
        } else {
            return { text: exp, className: "mood-badge__value--detecting" };
        }
    }

    const displayMood = getMoodDisplay(expression);

    return (
        <div className="detector-card glass-card">
            <div className="video-container">
                <video
                    ref={videoRef}
                    className="video-preview"
                    playsInline
                />
                <div className="video-overlay">
                    <span className="pulse-dot"></span>
                    Live Camera Feed
                </div>
            </div>
            
            <div className="detector-info">
                <div className="mood-badge">
                    <span className="mood-badge__label">Current Detection</span>
                    <span className={`mood-badge__value ${displayMood.className}`}>
                        {displayMood.text}
                    </span>
                </div>
                
                <button className="btn-detect" onClick={handleClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    Scan Face Expression
                </button>
            </div>
        </div>
    );
}