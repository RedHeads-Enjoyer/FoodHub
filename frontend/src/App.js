import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreteRecipePage from "./pages/CreteRecipePage";
import SearchPage from "./pages/SearchPage";
import ShowRecipePage from "./pages/ShowRecipePage";
import Header from "./components/Header";
import {useEffect, useState} from "react";
import axios from "axios";
import {getJwtAuthHeader} from "./functions";
import {dbUrl} from "./config";
import EditUserPage from "./pages/EditUserPage";
import UserPage from "./pages/UserPage";

function App() {

    const ProtectedRoute = ({ children }) => {
        const [isAuthenticated, setIsAuthenticated] = useState(null);

        useEffect(() => {
            axios.get(dbUrl + '/user/me', getJwtAuthHeader())
                .then((data) => {
                    setIsAuthenticated(true);
                })
                .catch((error) => {
                    setIsAuthenticated(false);
                });
        }, []);

        if (isAuthenticated === null) {
            return <div>Загрузка...</div>;
        }
        if (!isAuthenticated) {
            return <Navigate to='/login' replace />;
        }
        return children;
    };

    return (
      <>
          <main>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route path={'/login'} element={<LoginPage/>}/>
                      <Route path={'/registration'} element={<RegisterPage/>}/>
                      <Route path={'/user/edit/:id'} element={<ProtectedRoute><EditUserPage/></ProtectedRoute>}/>
                      <Route path={'/createRecipe'} element={<ProtectedRoute><CreteRecipePage/></ProtectedRoute>}/>
                      <Route path={'/search'} element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/>
                      <Route path={'/recipe/:id'} element={<ProtectedRoute><ShowRecipePage/></ProtectedRoute>}/>
                      <Route path={'/user/:id'} element={<ProtectedRoute><UserPage/></ProtectedRoute>}/>
                      <Route path={'*'} element={<ProtectedRoute><Navigate to={'search'} replace/></ProtectedRoute>}/>
                  </Routes>
              </BrowserRouter>
          </main>
      </>
  );
}

export default App;
