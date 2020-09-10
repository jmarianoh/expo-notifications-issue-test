import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { debug } from './debug';

export async function getToken(): Promise<string | undefined> {
	if (!Constants.isDevice) throw new Error('Not a device!');

	const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	debug('Permissions.NOTIFICATIONS was ' + status);
	if (status !== 'granted') await Permissions.askAsync(Permissions.NOTIFICATIONS);
	debug('Permissions.NOTIFICATIONS is now ' + (await Permissions.getAsync(Permissions.NOTIFICATIONS)).status);
	return (await Notifications.getDevicePushTokenAsync())?.data;
}
