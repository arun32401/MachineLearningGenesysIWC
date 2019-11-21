import {IonHeader, IonToolbar, IonButtons, IonList, IonTitle, IonInput, IonItem, IonImg, IonContent, IonPage, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol} from '@ionic/react';
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { send, person } from 'ionicons/icons';
// import { authFn } from '../App';

import '../styles/utils.css';
import '../styles/login.css';
import '../styles/chat.css';
import '../styles/chat-dark.css';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const INITIAL_STATE_OBJ = {
	loggedIn: false,
	user: null
};

const AGE_GROUP_CHECK = 25;

const avatar = { src: 'assets/img/avatar-trans.png', alt: 'Person'};
const bot = { src: 'assets/img/robot.png', alt: 'Bot'};

const MessageUI: React.FC<any> = (props) => {
	const colClassName = (props.type === 'agent') ? '' : 'chat-bubble-offset';
	const offsetVal = (props.type === 'agent') ? '' : "6";
	const bubbleClassName = (props.type === 'agent') ? `chat-bubble--left chat-bubble-key-${props.keyId}` : `chat-bubble--right chat-bubble-key-${props.keyId}`;
	const imageSrc = (props.type === 'agent') ? bot : ((props.user && props.user.profilePic) ?  { src: props.user.profilePic, alt: 'Person' } : avatar);


	return (
		<IonRow className="chat-bubble-row">
			<IonCol size="6" className={colClassName} offset={offsetVal}>
				<div className="flexbox flexbox-v-top">
					<div className={`chat-avatar chat-avatar--${props.type}`}>
						<IonImg src={imageSrc.src} alt={imageSrc.alt} className="chat-avatar-img" />
					</div>
					<div className={`chat-bubble ${bubbleClassName}`}>
						{(props.message && props.message.trim()) !== '' ? props.message : 'Hello Dude'}
					</div>
				</div>
			</IonCol>
		</IonRow>
	)
}

const IS_BOT_ACTIVATE = true;

const Chat: React.FC<any> = (props) => {

	const MESSAGES_INITIAL_STATE = [
		{
			type: 'agent',
			message: 'Hi'
		}
	]

	const [ message, setMessage ] = useState('');
	const [ stateObj, setStateObj ] = useState(INITIAL_STATE_OBJ);
	const [ messages, setMessages ] = useState([]);
	const [ userId, setUserId ] = useState('');
	const [ counterVal, setCounterVal ] = useState(0);
	const [ accessibility, setAccessibilty ] = useState(false);
	const [ showAccessibilityBtn, setShowAccessibilityBtn ] = useState(false);

	const submit = async () => {
		try {
			generateMessage('customer', message);
			evaluateMessage(message);
			clearInput();
		} catch (e) {
			console.log('submit message error', e);
		}
 	}

	const generateMessage = (type, message) => {
		setMessages(oldArray => [...oldArray, {
			type,
			message
		}]);
		setTextAreaFocus();
	}
	
	const evaluateMessage = (message) => {
		switch (message.trim()) {
			case 'Yes':
				console.log('yes said');
				setShowAccessibilityBtn(true);
				toggleAccessibility();
				generateMessage('agent', 'Accessibility Settings are turned on');
				generateMessage('agent', 'You can navigate to the button at top right corner with user icon to toggle between accessibility settings');
			default:
				break;
		}
	}

	const setTextAreaFocus = () => {
		let element = document.querySelector("textarea[name='message']") as HTMLInputElement;
		console.log('element', element);
		if (element) {
			element.focus();
		}
	}

	const setTabIndexForMessages = () => {
		let elements = document.querySelectorAll(".chat-bubble") as NodeListOf<HTMLElement>;
		elements.forEach((item) => {
			item.setAttribute('tabindex', '0');
		})
	}
	
	useEffect(() => {
		setTabIndexForMessages();
	}, [messages])

	const toggleAccessibility = () => {
		if (accessibility) {
			setAccessibilty(false);
			setDarkMode(false);
		} else {
			setAccessibilty(true);
			setDarkMode(true);
		}
	}
	
	const forceAccessibility = (isSet) => {
		if (isSet) {
			setAccessibilty(true);
			setDarkMode(true);
		} else {
			setAccessibilty(false);
			setDarkMode(false);
		}
	}

	const setDarkMode = (isEnable) => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		// Listen for changes to the prefers-color-scheme media query
		prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

		function toggleDarkTheme(shouldAdd) {
		  document.body.classList.toggle('dark', shouldAdd);
		}
		if (isEnable) {
			toggleDarkTheme(true);
		} else {
			toggleDarkTheme(false);
		}
	}

	const initChatBot = () => {
		console.log('initChatBot before', stateObj);
		if (IS_BOT_ACTIVATE && stateObj.user) {
			generateMessage('agent', `Hi ${stateObj.user.userName}`);

			if (stateObj.user.ageGroup && detectAgeGroup(stateObj.user.ageGroup)) {
				generateMessage('agent', 'We have predicted that you might need our accessibility feature based on your age group. Would you like to enable it? Please say "Yes" if you would like to');
			}
		}
	};

	const detectAgeGroup = (ageGroup) => {
		if (ageGroup.indexOf("-") !== -1) {
			let [minAge, maxAge] = ageGroup.split("-");
			return (parseInt(maxAge) > AGE_GROUP_CHECK);
		} else {
			return false
		}
	}

	const signOut = async (e) => {
		const { history } = props;
	    await firebase.auth().signOut().then(function(data) {
		  console.log('data of signout', data);
		  setStateObj(INITIAL_STATE_OBJ);
	  	}).catch((error) => {
		  console.log('signout error', error);
		});
		history.goBack();
		forceAccessibility(false);
	}
	
	function loadData (props) {
		console.log('printing props', props.location.state);
		try {
			if (props.location.state.userId !== '') {
				let userObj = JSON.parse(props.location.state.user);
				let stateObjToBeUpdate = {
					loggedIn: true,
					user: userObj
				};
				stateObjToBeUpdate.user.userId = props.location.state.userId;
				setStateObj(stateObjToBeUpdate);
				console.log('2', stateObjToBeUpdate, stateObj)
			}
		} catch (e) {
			console.log('error in loading data', e);
		}
		return stateObj;
	}

	// HACK: counter is given to stop useEffect from loading everytime
	useEffect(() => {
		const { history } = props;
		console.log('1');
		if (counterVal < 2) {
			loadData(props);
			if (stateObj.user) {
				initChatBot();
			}
			console.log('3', stateObj);
			setCounterVal(counterVal + 1);
		}
	}, [stateObj]);
	
	const clearInput = () => {
		setMessage('');
	}

  return (
    <IonPage>
		<IonHeader>
	        <IonToolbar color="primary">
				<IonTitle>Live Chat</IonTitle>
				<IonButtons slot="end">
					{showAccessibilityBtn ? (
						<IonButton fill="clear" title="Accessibility" aria-label="Click to toggle between Accessibility option" onClick={e => { toggleAccessibility(); }} type="button">
					      <IonIcon slot="icon-only" icon={person} />
					    </IonButton>
					) : null }
					<IonButton className="btn-capitalize" onClick={(e) => { signOut(e); }} type="button">Signout</IonButton>
				</IonButtons>
	        </IonToolbar>
	   	</IonHeader>
      <IonContent className="chat-page">
	  	<div className="chat-transcript">
			<IonGrid aria-live="polite" aria-atomic="false" className="chat-transcript-container">
				{
					messages.map((item, index) => {
						return <MessageUI key={index} type={item.type} message={item.message} keyId={index} user={stateObj.user}/>
					})
				}
			</IonGrid>
			<form className="chat-form form" onSubmit={(e) => { e.preventDefault(); submit();}}>
				<div className="fieldset flexbox flexbox-v-center fieldset--message">
					<IonItem className="message-box">
				      <IonTextarea autofocus value={message} name="message" onInput={(e) => setMessage((e.target as HTMLInputElement).value)} placeholder="Type your message here..."></IonTextarea>
				    </IonItem>
					<IonButton fill="clear" title="Send" aria-label="Send Message" type="submit">
				      <IonIcon slot="icon-only" icon={send} />
				    </IonButton>
				</div>
			</form>
		</div>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
