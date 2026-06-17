import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import { useAuth } from '../../auth/hooks/useAuth'
import './home.scss'

const Home = () => {
    const { handleGetSong } = useSong()
    const { user, handleLogOut } = useAuth()

    return (
        <div className="home-container">
            {/* Animated Background Mesh */}
            <div className="home-bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            {/* Dashboard Navigation Header */}
            <header className="home-header">
                <div className="logo">Moodify AI</div>
                <div className="user-actions">
                    <p className="welcome-msg">
                        Welcome, <span>{user?.username || 'User'}</span>!
                    </p>
                    <button className="btn-logout" onClick={handleLogOut}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Layout Grid */}
            <main className="home-content">
                {/* Left Side - Camera Scanner */}
                <FaceExpression
                    onClick={(expression) => {
                        handleGetSong({ mood: expression })
                    }}
                />

                {/* Right Side - Information / Instructions */}
                <section className="instructions-card glass-card">
                    <h3>How it works</h3>
                    <ul className="step-list">
                        <li>
                            <span className="step-num">1</span>
                            <div className="step-text">
                                <strong>Grant Camera Access</strong>
                                Allow your browser to access the camera feed.
                            </div>
                        </li>
                        <li>
                            <span className="step-num">2</span>
                            <div className="step-text">
                                <strong>Strike a Pose</strong>
                                Express your mood clearly (smile for Happy, look downcast for Sad, or open your mouth/widen your eyes for Surprised).
                            </div>
                        </li>
                        <li>
                            <span className="step-num">3</span>
                            <div className="step-text">
                                <strong>Scan Face Expression</strong>
                                Click the scan button. Our AI model will detect the facial lines and map them to a mood.
                            </div>
                        </li>
                        <li>
                            <span className="step-num">4</span>
                            <div className="step-text">
                                <strong>Enjoy the Music!</strong>
                                A corresponding playlist track will immediately start playing automatically based on your expression.
                            </div>
                        </li>
                    </ul>
                </section>
            </main>

            {/* Audio Music Player */}
            <Player />
        </div>
    )
}

export default Home