import logo from './logo.svg';
import './App.css';
import Greet from './components/Greet';
import Welcome from './components/Welcome';
import Hello from './components/Hello';

function App() {
  return (
    <div className="App">
      <Greet name="Bob">
        This is a test.
      </Greet>
      <Welcome name="Bob"/>
      {/* <Hello/> */}
    </div>
  );
}

export default App;
