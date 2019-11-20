import {IonHeader, IonToolbar, IonButtons, IonTitle, IonInput, IonItem, IonContent, IonPage, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol} from '@ionic/react';
// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { send } from 'ionicons/icons';
import { authFn } from '../App';

import '../styles/utils.css';
import '../styles/login.css';
import '../styles/chat.css';

import * as firebase from "firebase/app";
import "firebase/auth";

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const INITIAL_STATE = {
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

const Chat: React.FC<any> = (props) => {
	
	const MESSAGES_INITIAL_STATE = [
		{
			type: 'agent',
			message: 'Hi Customer'
		},

		{
			type: 'customer',
			message: 'Hi Agent'
		}
	]

	const [ message, setMessage ] = useState('');
	const [ stateObj, setStateObj ] = useState(INITIAL_STATE);
	const [ messages, setMessages ] = useState(MESSAGES_INITIAL_STATE);

	const submit = async () => {
		try {
		  // messageUI('customer', message);
		  setMessages(oldArray => [...oldArray, {
			  type: 'customer',
			  message: message
		  }]);
		} catch (e) {

		}
 	}

	async function loadData() {
		console.log('props------------', props);
		if (props.location.state) {
			console.log('firebase current user------------', firebase.auth().currentUser);
			setStateObj({
				loggedIn: true,
				user: {
					name: props.location.state.user.displayName,
					email: props.location.state.user.email
				}
			});
		}
	}

	useEffect(() => {
		loadData();
	}, [])

	const signOut = async (e) => {
		const { history } = props;
	    await firebase.auth().signOut().then(function(data) {
		  console.log('data of signout', data)
		  setStateObj(INITIAL_STATE);
	  	}).catch((error) => {
		  console.log('signout error', error);
		});
	    history.goBack();
	}

  return (
    <IonPage>
		<IonHeader>
	        <IonToolbar color="primary">
				<IonTitle>Live Chat { authFn().isLoggedIn ? 'logged in' : 'not logged'}</IonTitle>
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
