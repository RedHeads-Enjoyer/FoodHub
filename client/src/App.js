import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/style.css"
import RecipeCarp from "./components/RecipeCarp";
import {useState, useEffect} from "react";
import axios from "axios";
import {dbUrl} from "./config";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path={'/login'} element={<LoginPage/>}/>
              <Route path={'/registration'} element={<RegisterPage/>}/>
              <Route path={'/profile/:id'} element={<ProfilePage/>}/>
              <Route path={'/'} element={<p>Успешеый вход</p>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
