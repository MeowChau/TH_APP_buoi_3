import { useNetInfo } from '@react-native-community/netinfo';
export default function useNetworkStatus() {
  const network = useNetInfo();
  // LAN API may be reachable on Wi-Fi without public internet access.
  return { isOnline: network.isConnected === true };
}
