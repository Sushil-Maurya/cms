import { BrowserRouter } from "react-router-dom";
import Pages from "./Components/Pages";
import MainLayout from "./HOC/MainLayout";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainLayout />
        <Pages />
      </BrowserRouter>
    </div>
  );
}

export default App;
