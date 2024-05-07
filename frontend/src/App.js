import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import CreteRecipePage from "./pages/CreteRecipePage";
import SearchPage from "./pages/SearchPage";
import ShowRecipePage from "./pages/ShowRecipePage";
import Header from "./components/Header";
import TextPage from "./pages/TextPage";
import {useEffect, useState} from "react";
import axios from "axios";
import {getJwtAuthHeader} from "./functions";
import {dbUrl} from "./config";

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
        }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз после монтирования компонента

        // Пока статус аутентификации неизвестен, можно отображать индикатор загрузки или ничего не отображать
        if (isAuthenticated === null) {
            return <div>Загрузка...</div>;
        }

        // Если пользователь не авторизован, перенаправляем на страницу входа
        if (!isAuthenticated) {
            return <Navigate to='/login' replace />;
        }

        // Если пользователь авторизован, отображаем дочерние компоненты
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
                      <Route path={'/user/:id'} element={<UserPage/>}/>
                      <Route path={'/createRecipe'} element={<CreteRecipePage/>}/>
                      <Route path={'/search'} element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/>
                      <Route path={'/recipe/:id'} element={<ShowRecipePage/>}/>
                      <Route path={'/test'} element={<TextPage/>}/>
                      <Route path={'*'} element={<Navigate to={'search'} replace/>}/>
                  </Routes>
              </BrowserRouter>
          </main>
      </>
  );
}

export default App;
