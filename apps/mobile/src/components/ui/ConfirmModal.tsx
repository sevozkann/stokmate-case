import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";

export function ConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Kaydedilmemiş değişiklikler var</Text>
          <Text style={styles.copy}>
            Bu sayfadan ayrılırsanız yaptığınız stok değişikliği kaybolacak.
          </Text>
          <View style={styles.actions}>
            <Button variant="secondary" onPress={onCancel}>
              Sayfada kal
            </Button>
            <Button onPress={onConfirm}>Ayrıl</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 29, 51, .45)",
  },
  card: { borderRadius: 18, backgroundColor: "#fff", padding: 22 },
  title: { color: "#17243a", fontSize: 19, fontWeight: "800" },
  copy: { color: "#718098", fontSize: 14, lineHeight: 20, marginTop: 9 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 9,
    marginTop: 22,
  },
});
