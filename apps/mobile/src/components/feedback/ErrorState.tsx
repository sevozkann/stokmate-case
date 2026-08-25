import { Pressable, StyleSheet, Text, View } from "react-native";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.error}>{message}</Text>
      <Pressable onPress={onRetry}>
        <Text style={styles.retry}>Tekrar dene</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1, gap: 14, justifyContent: "center" },
  error: { color: "#b44040", fontSize: 13 },
  retry: { color: "#367dea", fontWeight: "800" },
});
