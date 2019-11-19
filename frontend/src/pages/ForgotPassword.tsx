import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonInput, IonItem, IonLabel, IonContent, IonImg, IonPage, IonButton} from '@ionic/react';
import React, { useState } from 'react';

import '../styles/utils.css';
import '../styles/login.css';

import * as firebase from "firebase/app";
import "firebase/auth";

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const ForgotPassword: React.FC = () => {
	const [ email, setEmail ] = useState('');
	
	const formErrorsInitState = {code: '', message: ''};

	const [ formErrors, setFormErrors ] = useState(formErrorsInitState);

	const [ formSuccessToast, setFormSuccessToast ] = useState('');

	const submit = async () => {
		if (email.trim() !== "" && validateEmail(email)) {
			firebase.auth().sendPasswordResetEmail(email).then(data => {
			  //If authentication is success, pass to next page
			  console.log('data printing for reset Password', data);
			  setFormErrors(formErrorsInitState);
			  setFormSuccessToast('The link for resetting password has been sent to your email successfully');
			}).catch((error) => {
			  // Handle Errors here.
			  console.log('error code', error.code, error.message);
			  setFormErrors(error);
			});
		}  else {
			setFormErrors({
				code: '',
				message: 'Email is invalid'
			});
		}
 	}
	
	const validateEmail = (email) => {
	    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	    return regexp.test(email.toLowerCase());
	}

  return (
    <IonPage>
		<IonHeader>
	        <IonToolbar>
	          <IonButtons slot="start">
	            <IonBackButton defaultHref="/login" />
	          </IonButtons>
	          <IonTitle>Forgot Password</IonTitle>
	        </IonToolbar>
	   	</IonHeader>
      <IonContent className="ion-padding">
	  	<div className="login-screen">
			<div className="login-header">
				<div className="logo">
					<IonImg src={logo.src} alt={logo.alt} />
				</div>
				<h1>Live Chat</h1>
			</div>
			<form className="forgot-password-form form" onSubmit={(e) => { e.preventDefault(); submit();}}>
				{(formSuccessToast && formSuccessToast !== "") ? (
					<div className="form-alert form-alert--success" role="alert">
				  		{formSuccessToast}
					</div>
				): null}
				{(formErrors && formErrors.message !== "") ? (
					<div className="form-alert form-alert--errors" role="alert">
				  		{formErrors.message}
					</div>
				): null}
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Email</IonLabel>
				      <IonInput name="email" type="email" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)}></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonButton expand="block" type="submit">Reset Password</IonButton>
				</div>

				<div className="fieldset">
					<IonItem lines="none">
					<a href="" color="primary" className="btn btn-link">Back to Login</a>
					</IonItem>
					<IonItem lines="none">
					<a href="" color="primary" className="btn btn-link">No account yet? Create a new account</a>
					</IonItem>
				</div>
			</form>
		</div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
