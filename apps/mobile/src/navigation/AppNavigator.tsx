import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LoadingState } from "../components/feedback";
import { useAuth } from "../providers/AuthProvider";
import { LoginScreen } from "../screens/Login";
import { ProductsScreen } from "../screens/ProductList";
import { ProductDetailScreen } from "../screens/ProductDetail";
import { AppHeader } from "../components/AppHeader";
import type { Product } from "../types";

export function AppNavigator() {
  const { user, ready } = useAuth();
  const [selected, setSelected] = useState<Product | null>(null);
  if (!ready) return <LoadingState label="StokMate hazırlanıyor…" />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {!user ? (
        <LoginScreen />
      ) : (
        <>
          <AppHeader />
          <View style={selected ? styles.hidden : styles.visible}>
            <ProductsScreen onSelect={setSelected} />
          </View>
          {selected && (
            <ProductDetailScreen
              product={selected}
              onBack={() => setSelected(null)}
              onUpdated={setSelected}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  visible: { flex: 1 },
  hidden: { display: "none" },
});
