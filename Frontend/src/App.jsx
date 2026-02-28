import './App.css'
import { ThemeContext } from './assets/theme'
import FaceExpression from './features/Expression/components/FaceExpression'

function App() {

  return (
    <ThemeContext.Provider value={"dark"}> 
      <FaceExpression />
    </ThemeContext.Provider>
  )
}

export default App
