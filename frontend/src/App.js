import {BrowserRouter, Routes, Route, Navigate, useParams} from "react-router-dom";
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
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        axios.get(dbUrl + '/user/me', getJwtAuthHeader())
            .then((response) => {
                setCurrentUser(response.data)
                setIsAuthenticated(true);
            })
            .catch((error) => {
                setIsAuthenticated(false);
            });
    }, [])

    const ProtectedRoute = ({ children }) => {


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

    const PermissionRoute = ({children}) => {
        const { id } = useParams();
        if (currentUser._id !== id && !currentUser.roles.includes('admin')) {
            return <Navigate to='/search?searchRequest=' replace />;
        }
        return children
    }

    return (
      <>
          <main>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route path={'/login'} element={<LoginPage/>}/>
                      <Route path={'/registration'} element={<RegisterPage/>}/>
                      <Route path={'/user/edit/:id'} element={<ProtectedRoute><PermissionRoute><EditUserPage/></PermissionRoute></ProtectedRoute>}/>
                      <Route path={'/createRecipe'} element={<ProtectedRoute><CreteRecipePage/></ProtectedRoute>}/>
                      <Route path={'/search'} element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/>
                      <Route path={'/recipe/:id'} element={<ProtectedRoute><ShowRecipePage/></ProtectedRoute>}/>
                      <Route path={'/user/:id'} element={<ProtectedRoute><UserPage/></ProtectedRoute>}/>
                      <Route path={'*'} element={<ProtectedRoute><Navigate to={'/search?searchRequest='} replace/></ProtectedRoute>}/>
                  </Routes>
              </BrowserRouter>
          </main>
      </>
  );
}

export default App;
