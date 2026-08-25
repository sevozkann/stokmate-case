import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: 15 },
  label: { color: "#50617d", fontSize: 12, fontWeight: "700", marginBottom: 7 },
});
