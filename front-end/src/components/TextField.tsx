import { IonButton, IonTextarea, useIonToast } from '@ionic/react';

export default function TextField(message: string, setState:Function, label: string) {
    return (           
     <div className="contactContentSection">
        <h2>{label}</h2>
        <IonTextarea value={message} className="contactContent" fill="solid" placeholder="Type message here" onIonChange={(e: any) => setState(e.target.value)}></IonTextarea>
    </div>)
}