import React, { useState, useEffect } from 'react';
import { Notifications } from 'expo';
import { Text, View, Button, Clipboard, Vibration } from 'react-native';
import { debug, getDebugValue } from './src/debug';
import { getToken } from './src/get-token';

export default function App() {
	const [pushToken, setPushToken] = useState<string | undefined>(undefined);
	const [debugValue, setDebugValue] = useState('[Nothing debugged yet]');

	useEffect(() => {
		debug('A');
		(async () => {
			try {
				await Notifications.createChannelAndroidAsync('default', {
					name: 'default',
					sound: true,
					priority: 'max',
					vibrate: [0, 250, 250, 250]
				});
			} catch (error) {
				debug('B', error);
			}
		})();
	}, []);

	useEffect(() => {
		debug('C');
		try {
			const subscription = Notifications.addListener((notification) => {
				debug('D', notification);
				Vibration.vibrate();
			});
			return () => {
				debug('E');
				subscription.remove();
			};
		} catch (error) {
			debug('F', error);
		}
	}, []);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'space-around',
			}}
		>
			<Text>Your push token: {pushToken}</Text>
			<Text>Debug: {debugValue}</Text>
			<View>
				<Button
					title="Press to copy token to clipboard"
					onPress={async () => {
						Clipboard.setString(pushToken ? 'Token: ' + pushToken : 'Token not found');
					}}
				/>
				<Button
					title="Press to get token"
					onPress={async () => {
						try {
							setPushToken(await getToken());
						} catch (error) {
							debug('G', error);
						}
					}}
				/>
				<Button
					title="Press to debug hello"
					onPress={async () => {
						debug('hello');
						setDebugValue(getDebugValue());
					}}
				/>
				<Button
					title="Press to refresh debug"
					onPress={async () => {
						setDebugValue(getDebugValue());
					}}
				/>
			</View>
		</View>
	);
}
