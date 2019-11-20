import {IonHeader, IonToolbar, IonButtons, IonTitle, IonInput, IonItem, IonContent, IonPage, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol} from '@ionic/react';
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { send } from 'ionicons/icons';
// import { authFn } from '../App';

import '../styles/utils.css';
import '../styles/login.css';
import '../styles/chat.css';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const INITIAL_STATE_OBJ = {
	loggedIn: false,
	user: null
};

const MessageUI: React.FC<any> = (props) => {
	const colClassName = (props.type === 'agent') ? '' : 'chat-bubble-offset';
	const offsetVal = (props.type === 'agent') ? '' : "6";
	const bubbleClassName = (props.type === 'agent') ? 'chat-bubble--left' : 'chat-bubble--right';
	
	return (
		<IonRow>
			<IonCol size="6" className={colClassName} offset= {offsetVal} >
				<div className="chat-bubble { bubbleClassName }">
					{(props.message && props.message.trim()) !== '' ? props.message : 'Hello Dude'}
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

	const submit = async () => {
		try {
			generateMessage('customer', message);
		} catch (e) {

		}
 	}

	const generateMessage = (type, message) => {
		setMessages(oldArray => [...oldArray, {
			type,
			message
		}]);
	}

	const initChatBot = () => {
		console.log('initChatBot before', stateObj);
		if (IS_BOT_ACTIVATE && stateObj.user) {
			generateMessage('agent', `Hi ${stateObj.user.userName}`);
		}
	};

	const signOut = async (e) => {
		const { history } = props;
	    await firebase.auth().signOut().then(function(data) {
		  console.log('data of signout', data);
		  setStateObj(INITIAL_STATE_OBJ);
		  history.goBack();
	  	}).catch((error) => {
		  console.log('signout error', error);
		});
	}
	
	function loadData (props) {
		const { history } = props;
		try {
			if (Object.keys(props.location.state.user.length)) {
				let userObj = JSON.parse(props.location.state.user);
				setUserId(userObj.uid);
				firebase.database().ref('users/' + userObj.uid  + "/profile").once('value', (snap) => {
					const currentUser = snap.val();
					console.log('2', currentUser);
					let stateObjToBeUpdate = {
						loggedIn: true,
						user: snap.val()
					};
					setStateObj(stateObjToBeUpdate);
					return stateObjToBeUpdate;
				});
			}
		} catch (e) {
			console.log('error in loading data', e);
		}
		return stateObj;
	}
	
	// HACK: counter is given to stop useEffect from loading everytime
	useEffect(() => {
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

  return (
    <IonPage>
		<IonHeader>
	        <IonToolbar color="primary">
				<IonTitle>Live Chat</IonTitle>
				<IonButtons slot="end">
					<IonButton className="btn-capitalize" onClick={(e) => { signOut(e); }} type="button">Signout</IonButton>
				</IonButtons>
	        </IonToolbar>
	   	</IonHeader>
      <IonContent>
	  	<div className="chat-transcript">
			<IonGrid className="chat-transcript-container">
				{
					messages.map((item, index) => {
						return <MessageUI key={index} type={item.type} message={item.message}/>
					})
				}
			</IonGrid>
			<form className="chat-form form" onSubmit={(e) => { e.preventDefault(); submit();}}>
				<div className="fieldset flexbox flexbox-v-center fieldset--message">
					<IonItem className="message-box">
				      <IonTextarea value={message}  name="message" onInput={(e) => setMessage((e.target as HTMLInputElement).value)} placeholder="Type your message here..."></IonTextarea>
				    </IonItem>
					<IonButton fill="clear" type="submit">
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
