import { AppRegistry } from 'react-native';
import App from './App';
import notifee from '@notifee/react-native';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);
// Timestamp notifications are displayed by the OS. No network task is needed.
notifee.onBackgroundEvent(async () => {});
