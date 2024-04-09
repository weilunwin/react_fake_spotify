import "./App.scss";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { PendingPage } from "./pages/PendingPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <DataProvider>
              <Routes>
                <Route path="*" element={<LoginPage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="pending" element={<PendingPage />} />
              </Routes>
            </DataProvider>
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
