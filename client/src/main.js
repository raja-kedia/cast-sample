import React, { useEffect, useState } from 'react';
import { useCastReceiver } from './components/receiver';

import styles from './main.scss';

function Main() {

	const [startMessage, setStartMessage] = useState('');
	const videoSource = useCastReceiver()

	const fetchInitialResponse = async () => {
		const response = await fetch('/cast-sample/api/getdata');
		const responsejson = await response.json();
		setStartMessage(responsejson['start-message']);
	}

	useEffect(() => {
		fetchInitialResponse()
	}, [])

	console("videoSource: ", videoSource)

	return (
		<div className={styles['container']}>{startMessage} 12</div>
	);
}

export default Main;