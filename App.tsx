import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Text, View, Button, Clipboard } from 'react-native';
import { debug, getDebugValue } from './src/debug';
import { getToken } from './src/get-token';

try {
	Notifications.setNotificationHandler({
		async handleNotification(...args) {
			debug('A', args);
			return {
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: true,
			};
		},
		handleSuccess(...args) {
			debug('B', args);
		},
		handleError(...args) {
			debug('C', args);
		},
	});
} catch (error) {
	debug('Oops1', error);
}

export default function App() {
	const [pushToken, setPushToken] = useState<string | undefined>(undefined);
	const [debugValue, setDebugValue] = useState('[Nothing debugged yet]');

	useEffect(() => {
		debug('D');
		(async () => {
			try {
				await Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C',
				});
				debug('D_1');
			} catch (error) {
				debug('D_2', error);
			}
		})();
	}, []);

	useEffect(() => {
		try {
			debug('E');
			const subscription = Notifications.addNotificationReceivedListener((notification) => {
				debug('F', notification);
			});
			debug('E_1');
			return () => {
				debug('G');
				subscription.remove();
			};
		} catch (error) {
			debug('Oops2', error);
		}
	}, []);

	useEffect(() => {
		try {
			debug('H');
			const subscription = Notifications.addNotificationsDroppedListener(() => {
				debug('I');
			});
			debug('H_1');
			return () => {
				debug('J');
				subscription.remove();
			};
		} catch (error) {
			debug('Oops3', error);
		}
	}, []);

	useEffect(() => {
		try {
			debug('K');
			const subscription = Notifications.addNotificationResponseReceivedListener((arg) => {
				debug('L', arg);
			});
			debug('K_1');
			return () => {
				debug('M');
				subscription.remove();
			};
		} catch (error) {
			debug('Oops4', error);
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
							debug('N', error);
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
