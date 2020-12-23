import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import './App.css';
import { AuthContext } from './shared/context/auth-context';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Players from './players/pages/Players';
import Auth from './user/pages/Auth';
import NewPlayer from './players/pages/NewPlayer';
import PlayerDetails from './players/pages/PlayerDetails';
import UpdatePlayer from './players/pages/UpdatePlayer';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { login, logout, userId, token } = useAuth();
  // const login = (uid, token) => {
  //   console.log('LOGING IN!');
  //   setToken(token);
  //   setUserId(uid);
  //   setIsLoggedIn(true);
  // };

  // const logout = () => {
  //   console.log('LOGING OUT!');
  //   setToken(null);
  //   setUserId(null);
  //   setIsLoggedIn(false);
  // };

  let routes;

  routes = (
    <Switch>
      <Route path="/" exact>
        <Players />
      </Route>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Route path="/players/new" exact>
        <NewPlayer />
      </Route>
      <Route path="/player/:pid" exact>
        <PlayerDetails />
      </Route>
      <Route path="/players/update/:pid" exact>
        <UpdatePlayer />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        login: login,
        logout: logout,
        token: token,
        userId: userId,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
