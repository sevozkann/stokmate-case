import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export function Button({
  children,
  disabled,
  loading,
  onPress,
  style,
  variant = "primary",
}: {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : "#367dea"} />
      ) : (
        <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  primary: { backgroundColor: "#367dea" },
  secondary: {
    backgroundColor: "#fff",
    borderColor: "#dce4f0",
    borderWidth: 1,
  },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.84 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  secondaryText: { color: "#52627a", fontSize: 14, fontWeight: "800" },
});
