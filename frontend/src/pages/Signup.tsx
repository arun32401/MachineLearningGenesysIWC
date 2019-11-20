import { IonInput, IonItem, IonLabel, IonContent, IonImg, IonPage, IonButton, IonThumbnail} from '@ionic/react';
// eslint-disable-next-line
import React, { useState, useContext } from 'react';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, Capacitor } from '@capacitor/core';
import { withRouter } from 'react-router-dom';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// import { authFn } from '../App';

import '../styles/utils.css';
import '../styles/login.css';

import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const IS_AGE_DETECT = true;
const FACE_DECTECTION_URL = 'http://de466b26.ngrok.io/facerecognition';

const Signup: React.FC<any> = (props) => {
	const { Camera, Filesystem } = Plugins;
	const [ userName, setUserName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ isValid, setIsValid ] = useState(false);
	const [ photo, setPhoto ] = useState();
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ ageGroup, setAgeGroup ] = useState('');
	const [ gender, setGender ] = useState('');
	const formErrorsInitState = {code: '', message: ''};
	const [ formErrors, setFormErrors ] = useState(formErrorsInitState);

	const validate = () => {
		if (!validateEmail(email)) {
			console.log('validate email failed');
			setFormErrors({
				code: '',
				message: 'Email is invalid'
			});
			setIsValid(false);
			return false;
		} else if (!validatePassword(password, confirmPassword)) {
			console.log('validate password failed');
			setFormErrors({
				code: '',
				message: 'Password is invalid'
			});
			setIsValid(false);
			return false;
		} else if (!validateUserName(userName)) {
			console.log('validate username failed');
			setFormErrors({
				code: '',
				message: 'Username is invalid'
			});
			setIsValid(false);
			return false;
		} else if (!validatePicture(photo)) {
			console.log('profile picture validation failed');
			setFormErrors({
				code: '',
				message: 'Please provide a profile picture!'
			});
			setIsValid(false);
			return false;
		} else {
			setIsValid(true);
			return true;
		}

	}

	const register = async () => {
		let auth = firebase.auth();
		const { history } = props;
		
		setFormErrors(formErrorsInitState);

		if (validate()) {
			auth.createUserWithEmailAndPassword(email, password).then((data) => {
				console.log('createUserWithEmailAndPassword', data);
				auth.currentUser.updateProfile({
					displayName: userName
				}).then(() => {
					console.log('auth.currentUser.uid', auth.currentUser.uid, auth.currentUser);
					firebase.database().ref('users/' + auth.currentUser.uid + "/profile").set({
						 userName: userName,
						 email: email,
						 profilePic: photo,
						 ageGroup: (ageGroup && ageGroup !== '') ? ageGroup : null,
						 gender: (gender && gender !== '') ? gender : null,
					});
					history.push({
						pathname: '/chat',
						state: {
							user: JSON.stringify(auth.currentUser)
						}
					});
				 }).catch((error) => {
					 setFormErrors(error);
				 });
			}).catch((error) => {
				setFormErrors(error);
			});
		} else {
			if (formErrors.message === '') {
				setFormErrors({
					code: '',
					message: 'Signup details are invalid'
				});
			}
		}
	}
	
	const validateEmail = (email) => {
	    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	    return regexp.test(email.toLowerCase());
	}
	
	const validateUserName = (userName) => {
		let regexp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regexp.test(userName);
	}

	const validatePassword = (password, confirmPassword) => {
		console.log('printing password', password, confirmPassword);
		if (password !== "" && confirmPassword !== "" && (password === confirmPassword)) {
			// Enable this when production
			// let regexp = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
			// return regexp.test(password);
			return true;
		} else {
			return false;
		}
	}
	
	const validatePicture = (photo) => {
		return (photo !== '');
	}

	const takePhoto = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64
		});
		let blob = "data:image/jpeg;base64," + image.base64String
		setPhoto(blob);

		if (IS_AGE_DETECT) {
			let faceDetectionRequest = await fetch(FACE_DECTECTION_URL, {
				method: 'POST',
				headers: {
				    Accept: 'application/json',
				    'Content-Type': 'application/json',
					'Access-Control-Allow-Origin':'*',
				},
				body: JSON.stringify({ 'imageUrl': image.base64String })
			});
			let faceDetectionResponse = await faceDetectionRequest.json();
			if (faceDetectionResponse) {
				console.log('faceDetectionResponse--->', faceDetectionResponse);
				setAgeGroup(faceDetectionResponse.Age);
				setGender(faceDetectionResponse.Gender);
			}
		}
	}

	defineCustomElements(window);

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
			<form className="signup-form form" onSubmit={(e) => { e.preventDefault(); register();}}>
				{(formErrors && formErrors.message !== "") ? (
					<div className="form-alert form-alert--errors" role="alert">
				  		{formErrors.message}
					</div>
				): null}
				<div className="fieldset fieldset--image">
					<IonItem lines="none" className="thumbnail" >
						<IonThumbnail>
						  <img src={photo} />
						</IonThumbnail>
					</IonItem>
					<div className="fieldset-btn-wrapper">
						<IonButton onClick={takePhoto}>Take Photo</IonButton>
					</div>
				</div>
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Email</IonLabel>
				      <IonInput name="email" type="email" value={email} required onInput={(e) => { setEmail((e.target as HTMLInputElement).value); }}></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Username</IonLabel>
				      <IonInput  name="userName" type="text" value={userName} required onInput={(e) => { setUserName((e.target as HTMLInputElement).value); } }></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Password</IonLabel>
				      <IonInput required name="password" type="password" value={password} onInput={(e) => { setPassword((e.target as HTMLInputElement).value); } }></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonItem>
				      <IonLabel position="floating">Confirm Password</IonLabel>
				      <IonInput required name="password" type="password" value={confirmPassword} onInput={(e) => { setConfirmPassword((e.target as HTMLInputElement).value); }}></IonInput>
				    </IonItem>
				</div>
				<div className="fieldset">
					<IonButton expand="block" type="submit">Signup</IonButton>
				</div>
				
				<div className="fieldset">
					<IonItem lines="none">
					<a href="/login" color="primary" className="btn btn-link">Back to Login</a>
					</IonItem>
				</div>
			</form>
		</div>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Signup);
