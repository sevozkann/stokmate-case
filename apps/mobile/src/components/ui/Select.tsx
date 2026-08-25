import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FormField } from "./FormField";

type SelectItem = { id: number; name: string };

export function Select({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: number;
  items: SelectItem[];
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.id === value)?.name ?? "Seçiniz";

  return (
    <FormField label={label}>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.value}>{selected}</Text>
        <Ionicons name="chevron-down" size={18} color="#607089" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.card}>
            <Text style={styles.title}>{label} seçin</Text>
            <ScrollView bounces={false}>
              {items.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.option}
                  onPress={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.id === value && styles.active,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.id === value && (
                    <Ionicons name="checkmark" size={19} color="#367dea" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </FormField>
  );
}

const styles = StyleSheet.create({
  select: {
    alignItems: "center",
    backgroundColor: "#f6f8fc",
    borderColor: "#e0e6f0",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  value: { color: "#17243a", fontSize: 15 },
  backdrop: {
    backgroundColor: "rgba(15,29,51,.42)",
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: 20,
  },
  title: { color: "#17243a", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  option: {
    alignItems: "center",
    borderBottomColor: "#edf1f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  optionText: { color: "#40516b", fontSize: 16 },
  active: { color: "#367dea", fontWeight: "800" },
});
