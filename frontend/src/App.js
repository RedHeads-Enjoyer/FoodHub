import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import CreteRecipePage from "./pages/CreteRecipePage";
import SearchPage from "./pages/SearchPage";
import ShowRecipePage from "./pages/ShowRecipePage";
import Header from "./components/Header";

function App() {
  return (
      <>
          <main>
              <Header/>
              <BrowserRouter>
                  <Routes>
                      <Route path={'/login'} element={<LoginPage/>}/>
                      <Route path={'/registration'} element={<RegisterPage/>}/>
                      <Route path={'/'} element={<p>Успешеый вход</p>}/>
                      <Route path={'/user/:id'} element={<UserPage/>}/>
                      <Route path={'/createRecipe'} element={<CreteRecipePage/>}/>
                      <Route path={'/search'} element={<SearchPage/>}/>
                      <Route path={'/recipe/:id'} element={<ShowRecipePage/>}/>
                  </Routes>
              </BrowserRouter>
          </main>
      </>

  );
}

export default App;
