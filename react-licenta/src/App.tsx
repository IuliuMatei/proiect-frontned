import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security, useOktaAuth } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import Building from './layouts/Building/Building';
import { About } from './about/About';



const oktaAuth = new OktaAuth(oktaConfig);


export const App = () => {



  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/building', window.location.origin));
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='homepage' />
            </Route>
            <Route path='/about'>
              <About/>
            </Route>
            <Route path='/building'>
              <Building/>
            </Route>
            <Route path='/homepage'>
              <HomePage />
            </Route>
            <Route path='/login' render={
              () => <LoginWidget config={oktaConfig} />
            }
            />
            <Route path='/login/callback' component={LoginCallback}/>
            <SecureRoute path='/building' component={Building} />
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}


