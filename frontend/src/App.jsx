import CodeEditor from './components/Editor'
import './App.css'
import { AuthProvider } from './auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CodeEditor/>
    </AuthProvider>
  );
}

export default App
