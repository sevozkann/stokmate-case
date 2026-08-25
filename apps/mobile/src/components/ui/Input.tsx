import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";

export function Input({ style, ...props }: TextInputProps) {
  return <TextInput {...props} style={[styles.input, style]} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f6f8fc",
    borderColor: "#e0e6f0",
    borderRadius: 10,
    borderWidth: 1,
    color: "#17243a",
    fontSize: 15,
    padding: 12,
  },
});
