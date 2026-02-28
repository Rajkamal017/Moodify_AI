import { useEffect, useRef, useState } from "react";
import {  init, detect } from "../utils/utils";
import { useContext } from "react";
import { ThemeContext } from "../../../assets/theme";


export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    let streamRef = useRef(null)

    const value = useContext(ThemeContext)

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

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Theme is {value} </h1>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button onClick={()=> {detect({ landmarkerRef, videoRef, setExpression})}} >Detect expression</button>
        </div>
    );
}