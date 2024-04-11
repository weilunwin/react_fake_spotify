import "./App.scss";
import { LoginPage } from "./pages/LoginPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { PendingPage } from "./pages/PendingPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";
import { SpotifyProvider } from "./contexts/PlayerContext.jsx";

// const basename = process.env.PUBLIC_URL;
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <DataProvider>
              <SpotifyProvider>
                <Routes>
                  <Route path="*" element={<LoginPage />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="pending" element={<PendingPage />} />
                </Routes>
              </SpotifyProvider>
            </DataProvider>
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
