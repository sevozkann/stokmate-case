import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../lib/api/client";
import { useAuth } from "../../providers/AuthProvider";
import { Button, Input } from "../../components/ui";

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("test@ornek.com"),
    [password, setPassword] = useState("Test1234!"),
    [showPassword, setShowPassword] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.brand}>
        <View style={s.mark}><Text style={s.markText}>SM</Text></View>
        <View><Text style={s.brandName}>StokMate</Text><Text style={s.brandSub}>YÖNETİM PANELİ</Text></View>
      </View>

      <Text style={s.overline}>MERKEZ OFİS İÇİN</Text>
      <Text style={s.title}>Stoğunuzun nabzını tutun.</Text>
      <Text style={s.copy}>
        Ürün kataloğunu, fiyatları ve mağaza stoklarını tek noktadan yönetin.
      </Text>

      <View style={s.card}>
        <Text style={s.welcome}>HOŞ GELDİNİZ</Text>
        <Text style={s.cardTitle}>Hesabınıza giriş yapın</Text>
        <Text style={s.cardCopy}>Devam etmek için kurumsal hesabınızı kullanın.</Text>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <Text style={s.label}>E-posta</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={s.emailInput}
        />
        <Text style={s.label}>Şifre</Text>
        <View style={s.passwordWrap}>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={s.passwordInput}
          />
          <Pressable
            style={s.eyeButton}
            onPress={() => setShowPassword((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color="#607089"
            />
          </Pressable>
        </View>
        <Button loading={loading} onPress={submit}>Giriş yap</Button>
        <Text style={s.hint}>API: {API_URL}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  page: {
    backgroundColor: "#10203a",
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  brand: { alignItems: "center", flexDirection: "row", gap: 10, marginBottom: 34 },
  mark: {
    alignItems: "center",
    backgroundColor: "#4f8ff8",
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  markText: { color: "#fff", fontWeight: "800" },
  brandName: { color: "#fff", fontSize: 18, fontWeight: "800" },
  brandSub: { color: "#9aaac2", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  overline: {
    color: "#6d8ebd",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 42,
    marginTop: 10,
  },
  copy: {
    color: "#bdcce3",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 31,
    marginTop: 15,
  },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 20 },
  welcome: { color: "#718098", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  cardTitle: { color: "#17243a", fontSize: 23, fontWeight: "800", marginTop: 5 },
  cardCopy: { color: "#718098", fontSize: 13, lineHeight: 19, marginBottom: 18, marginTop: 6 },
  label: { color: "#50617d", fontSize: 12, fontWeight: "700", marginBottom: 7 },
  emailInput: { marginBottom: 17 },
  passwordWrap: { marginBottom: 17, position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    position: "absolute",
    right: 2,
    top: 1,
    width: 44,
  },
  hint: { color: "#8491a5", fontSize: 10, marginTop: 14, textAlign: "center" },
  error: { color: "#b44040", fontSize: 13, marginBottom: 12 },
});
