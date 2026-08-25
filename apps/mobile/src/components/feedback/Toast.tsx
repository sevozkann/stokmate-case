import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function Toast({
  message,
  variant = "success",
}: {
  message?: string;
  variant?: "success" | "error";
}) {
  if (!message) return null;
  const isError = variant === "error";

  return (
    <View style={[styles.toast, isError ? styles.error : styles.success]}>
      <Ionicons
        name={isError ? "alert-circle-outline" : "checkmark-circle-outline"}
        size={20}
        color="#fff"
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    alignItems: "center",
    borderRadius: 12,
    bottom: 24,
    flexDirection: "row",
    gap: 8,
    left: 20,
    padding: 14,
    position: "absolute",
    right: 20,
  },
  success: { backgroundColor: "#277662" },
  error: { backgroundColor: "#c74a4a" },
  text: { color: "#fff", flex: 1, fontSize: 13, fontWeight: "700" },
});
