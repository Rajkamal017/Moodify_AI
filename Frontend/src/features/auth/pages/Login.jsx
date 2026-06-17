import React, { useState } from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {

  const { loading, handleLogin, handleGoogleSignIn } = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try {
      await handleLogin({ email, password})
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during login")
    }
  }

  async function handleGoogleClick() {
    setError(null)
    try {
      await handleGoogleSignIn()
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google sign in failed")
    }
  }

  return (
    <main className='login-page'>
      <div className="form-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FormGroup 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email" 
            placeholder="Enter your email" 
          />
          <FormGroup 
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            label="Password" 
            placeholder="Enter your password"
          />
          <button className='button' type='submit' disabled={loading}>Login</button>
        </form>
        
        <div className="divider">or</div>
        
        <button type="button" className="google-btn" onClick={handleGoogleClick} disabled={loading}>
          <svg viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.85 2.99C6.18 7.22 8.87 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.93 3.42-8.6z"/>
            <path fill="#FBBC05" d="M5.25 14.75a7.16 7.16 0 0 1 0-4.5l-3.85-2.99a11.96 11.96 0 0 0 0 10.49l3.85-3z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-4.27 1.09-3.13 0-5.82-2.18-6.76-5.51L1.4 16.79C3.37 20.35 7.35 23 12 23z"/>
          </svg>
          Sign in with Google
        </button>

        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </main>
  )
}

export default Login