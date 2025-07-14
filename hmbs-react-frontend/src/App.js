import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestConnection from './pages/TestConnection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestConnection />} />
      </Routes>
    </Router>
  );
}

export default App;
