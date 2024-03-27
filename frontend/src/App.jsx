import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavPreLogin from './components/NavPreLogin';
import NavPostLogin from './components/NavPostLogin';

import PreLogHome from './components/PreLogHome';
import PostLogHome from './components/PostLogHome';

import CreateDish from './components/CreateDish';
import CreateIngredient from './components/CreateIngredient';
import Login from './components/Login';
import Profile from './components/Profile';
import useToken from './components/useToken';
import ErrorPage from './components/ErrorPage';
import LoggedLogin from './components/LoggedLogin';
import Register from './components/Register';
import Ingredients from './components/Ingredients';
import FoodStyles from './components/FoodStyles';
import Dishes from './components/Dishes';


function App() {
  const { token, removeToken, setToken } = useToken();
  const [ userInfo, setUserInfo ] = useState({});

  useEffect(() => {
    if(token) {
      fetch('/api/profile', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        }
      }).then((response) => {
          return response.json();
        }).then((data) => {
            setUserInfo(data[0]);
            if(data[0] === undefined) {
              removeToken();
            }
        });
    }
  },[]);
    

  return (
    <>
      {!token && token!=="" &&token!== undefined ? <>
        <NavPreLogin />
      </> : 
      <>
        <NavPostLogin userInfo={userInfo} />
        </>
        }
      <BrowserRouter>
        {/* Default routes */}
        <Routes>
          <Route path='/' exact element={<PreLogHome/>} />
          <Route path='/create/dish' element={<CreateDish/>} />
          <Route path='/create/ingredient' element={<CreateIngredient/>} />
          <Route path='/foodstyles' element={<FoodStyles/>} />
          {!token && token!=="" &&token!== undefined?  
            <>
              <Route path='/login' exact element={<Login setToken={setToken} />} />
              <Route path='/register' exact element={<Register />} />
            </> :(
              <>
                  <Route path='/login' exact element={<LoggedLogin />} />
                  <Route path='/register' exact element={<LoggedLogin />} />
                  <Route path='/dishes' element={<Dishes token={token}/>} />
                  <Route path='/ingredients' element={<Ingredients token={token}/>} />
                  <Route exact path="/profile" element={<Profile token={token} setToken={setToken} removeToken={removeToken}/>}></Route>
              </>
            )}
          <Route path="/*" element={<ErrorPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
