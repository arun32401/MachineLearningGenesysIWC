import {IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonInput, IonItem, IonLabel, IonContent, IonImg, IonPage, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol} from '@ionic/react';
// eslint-disable-next-line
import React, { useState } from 'react';
import { send } from 'ionicons/icons';

import '../styles/utils.css';
import '../styles/login.css';
import '../styles/chat.css';

const logo = { src: 'assets/img/talkup-200.png', alt: 'Logo'};

const Chat: React.FC = () => {
	
	const initChat = true;
	const [ message, setMessage ] = useState('');

	const submit = async () => {
		try {
		  console.log('API hit');
		} catch (e) {

		}
 	}

  return (
    <IonPage>
		<IonHeader>
	        <IonToolbar color="primary">
				<IonTitle>Live Chat</IonTitle>
				<IonButtons slot="end">
					<IonButton className="btn-capitalize" type="button">Signout</IonButton>
				</IonButtons>
	        </IonToolbar>
	   	</IonHeader>
      <IonContent className="ion-padding">
	  	<div className="chat-transcript">
			<div className="chat-transcript-container">
				<IonGrid>
					<IonRow>
						<IonCol size="6">
							<div className="chat-bubble chat-bubble--left">
							Hello dude!
							</div>
						</IonCol>
				    </IonRow>
					<IonRow>
						<IonCol className="chat-bubble-offset" size="6" offset="6">
							<div className="chat-bubble chat-bubble--right">
							Hello dude!
							</div>
				        </IonCol>
				    </IonRow>
				</IonGrid>
			</div>
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
