import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export function AppHeader() {
  const { logout, user } = useAuth();
  const initials =
    user?.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "SM";

  return (
    <View style={s.header}>
      <View style={s.brand}>
        <View style={s.mark}>
          <Text style={s.markText}>SM</Text>
        </View>
        <View>
          <Text style={s.name}>StokMate</Text>
          <Text style={s.sub}>YÖNETİM PANELİ</Text>
        </View>
      </View>

      <View style={s.account}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={s.userInfo}>
          <Text numberOfLines={1} style={s.userName}>
            {user?.fullName}
          </Text>
          <Text numberOfLines={1} style={s.email}>
            {user?.email}
          </Text>
        </View>
        <Pressable style={s.logout} onPress={() => void logout()}>
          <Text style={s.logoutText}>Çıkış</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#10203a",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  brand: { alignItems: "center", flexDirection: "row", gap: 8 },
  account: { alignItems: "center", flexDirection: "row", gap: 7 },
  avatar: {
    alignItems: "center",
    backgroundColor: "#203452",
    borderRadius: 12,
    height: 25,
    justifyContent: "center",
    width: 25,
  },
  avatarText: { color: "#b9d3ff", fontSize: 9, fontWeight: "800" },
  userInfo: { maxWidth: 76 },
  userName: { color: "#fff", fontSize: 10, fontWeight: "800" },
  email: { color: "#9aaac2", fontSize: 8 },
  mark: {
    alignItems: "center",
    backgroundColor: "#367dea",
    borderRadius: 9,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  markText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  name: { color: "#fff", fontSize: 15, fontWeight: "800" },
  sub: { color: "#9aaac2", fontSize: 8, fontWeight: "700", letterSpacing: 0.7 },
  logout: {
    backgroundColor: "#203452",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoutText: { color: "#dce7f7", fontSize: 12, fontWeight: "800" },
});
