import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function EmptyState() {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="cube-outline" size={27} color="#367dea" />
      </View>
      <Text style={styles.title}>Ürün bulunamadı</Text>
      <Text style={styles.copy}>
        Aramanızı veya seçtiğiniz filtreleri değiştirip tekrar deneyin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1, gap: 14, justifyContent: "center" },
  icon: {
    alignItems: "center",
    backgroundColor: "#eaf2ff",
    borderRadius: 20,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  title: { color: "#17243a", fontSize: 16, fontWeight: "800" },
  copy: {
    color: "#718098",
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 260,
    textAlign: "center",
  },
});
