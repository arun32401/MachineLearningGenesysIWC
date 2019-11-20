import { IonInput, IonItem, IonLabel, IonContent, IonImg, IonPage, IonButton} from '@ionic/react';
// eslint-disable-next-line
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
// import { authFn } from '../App';

import '../styles/utils.css';
import '../styles/login.css';

import * as firebase from "firebase/app";
import "firebase/auth";

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const Login: React.FC<any> = (props) => {

	const [ email, setEmail ] = useState('rekha.m@genesys.com');
	const [ password, setPassword ] = useState('test123');
	const [ isValid, setIsValid ] = useState(false);

	const formErrorsInitState = {code: '', message: ''};

	const [ formErrors, setFormErrors ] = useState(formErrorsInitState);

	const submit = async () => {
		const { history } = props;
		if (isValid) {
			firebase.auth().signInWithEmailAndPassword(email, password).then(data => {
				if (data.user) {
					console.log('data.user in login page', data.user);

					firebase.database().ref('users/' + data.user.uid  + "/profile").once('value', (snap) => {
						let currentUser = snap.val();
						history.push({
							pathname: '/chat',
							state: {
								user:  JSON.stringify(currentUser),
								userId: data.user.uid
							}
						})
					});

				}
			  //If authentication is success, pass to next page
			  setFormErrors(formErrorsInitState);
		  	}).catch((error) => {
			  // Handle Errors here.
			  console.log('error code', error.code, error.message);
			  setFormErrors(error);
			});
		} else {
			setFormErrors({
				code: '',
				message: 'Email or Password is invalid'
			});
		}
 	}
	
	const validateEmail = (email) => {
		if (email.trim() === '') {
			return false;
		}

	    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	    return regexp.test(email.toLowerCase());
	}

	const validateForm = () => {
		if (validateEmail(email) && password.trim() !== '') {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}

  return (
    <IonPage>
      <IonContent className="ion-padding">
	  	<div className="login-screen">
			<div className="login-header">
				<div className="logo">
					<IonImg src={logo.src} alt={logo.alt} />
				</div>
				<h1>Live Chat</h1>
			</div>
			<form className="login-form form" onSubmit={(e) => { e.preventDefault(); submit();}}>
				{(formErrors && formErrors.message !== "") ? (
					<div className="form-alert form-alert--errors" role="alert">
				  		{formErrors.message}
					</div>
				): null}
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Email</IonLabel>
				      <IonInput autofocus name="email" type="email" value={email} onInput={(e) => { setEmail((e.target as HTMLInputElement).value); validateForm(); }}></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Password</IonLabel>
				      <IonInput name="password" type="password" value={password} onInput={(e) => { setPassword((e.target as HTMLInputElement).value); validateForm(); }}></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonButton disabled={isValid ? false : true} expand="block" type="submit">Log in</IonButton>
				</div>
				
				<div className="fieldset">
					<IonItem lines="none">
					<a href="/forgot-password" color="primary" className="btn btn-link">Forgot Password?</a>
					</IonItem>
					<IonItem lines="none">
					<a href="/signup" color="primary" className="btn btn-link">No account yet? Create a new account</a>
					</IonItem>
				</div>
			</form>
		</div>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Login);
