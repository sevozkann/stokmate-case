import { AuthProvider } from "./src/providers/AuthProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider><AppNavigator /></AuthProvider>
    </SafeAreaProvider>
  );
}
