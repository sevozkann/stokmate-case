import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color="#367dea" size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1, gap: 14, justifyContent: "center" },
  text: { color: "#718098", fontSize: 14 },
});
