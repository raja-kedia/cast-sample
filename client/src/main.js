import React, { useEffect, useState } from 'react';

import styles from './main.scss';

function Main() {

	const [startMessage, setStartMessage] = useState('');

	const fetchInitialResponse = async () => {
		const response = await fetch('/api/getdata');
		const responsejson = await response.json();
		setStartMessage(responsejson['start-message']);
	}

	useEffect(() => {
		fetchInitialResponse()
	}, [])

	return (
		<div className={styles['container']}>{startMessage} 12</div>
	);
}

export default Main;