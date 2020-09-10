import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { debug } from './debug';

export async function getToken(): Promise<string | undefined> {
	if (!Constants.isDevice) throw new Error('Not a device!');

	const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	debug('Status for Permissions.NOTIFICATIONS: ' + status);
	if (status !== 'granted') await Permissions.askAsync(Permissions.NOTIFICATIONS);
	return (await Notifications.getDevicePushTokenAsync())?.data;
}
