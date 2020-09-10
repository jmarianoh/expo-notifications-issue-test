import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export async function getToken(): Promise<string | undefined> {
	if (!Constants.isDevice) throw new Error('Not a device!');

	try {
		return (await Notifications.getDevicePushTokenAsync())?.data;
	} catch {
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		if (status !== 'granted') await Permissions.askAsync(Permissions.NOTIFICATIONS);
		return (await Notifications.getDevicePushTokenAsync())?.data;
	}
}
