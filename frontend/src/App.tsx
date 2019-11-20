import React, { useState, createContext, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Chat from './pages/ChatPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import firebase from 'firebase';
import firebaseConfig from "./config/firebase";

firebase.initializeApp(firebaseConfig);

export const isLoggedIn = false;

const App: React.FC<any> = (props) =>  {
	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route path="/login" component={Login} exact={true} />
					<Route path="/signup" component={Signup} exact={true} />
					<Route path="/forgot-password" component={ForgotPassword} exact={true} />
					<Route path="/chat" exact={true} render={(props) => {
							return isLoggedIn ? <Chat {...props} /> : <Redirect to="/login" />;
						}}
					/>
					<Route exact path="/" render={() => <Redirect to="/login" />} />
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
