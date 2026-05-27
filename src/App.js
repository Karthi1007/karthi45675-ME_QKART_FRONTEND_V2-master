import Login from "./components/Login";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `https://karthi45675-me-qkart-frontend-v2-master.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
          <Register />
          <Login />
    </div>
  );
}

export default App;
