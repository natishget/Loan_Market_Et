import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { loginSchema } from "@/validation/authSchema";
import { DEMO_USER, MOCK_USERS } from "@/data/mockData";

const DEMO_PHONE = "0987654321";
const DEMO_PASSWORD = "Nati@1234";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleLogin = () => {
    const result = loginSchema.safeParse({ phone, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (phone === DEMO_PHONE && password === DEMO_PASSWORD) {
        dispatch(login(DEMO_USER));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/");
      } else {
        const found = MOCK_USERS.find((u) => u.phone === phone);
        if (found) {
          dispatch(login(found));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/");
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert("Login Failed", "Invalid phone number or password.");
        }
      }
    }, 600);
  };

  const fillDemo = () => {
    setPhone(DEMO_PHONE);
    setPassword(DEMO_PASSWORD);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoRow}>
          <View
            style={[
              styles.logoBox,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="link-2" size={28} color="#fff" />
          </View>
        </View>

        <Text style={[styles.heading, { color: colors.foreground }]}>
          Welcome back
        </Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          Sign in to LoanMarket Ethiopia
        </Text>

        <TouchableOpacity
          style={[
            styles.demoBtn,
            {
              backgroundColor: colors.accent + "18",
              borderColor: colors.accent + "60",
              borderRadius: colors.radius,
            },
          ]}
          onPress={fillDemo}
        >
          <Feather name="zap" size={14} color={colors.accent} />
          <Text style={[styles.demoBtnText, { color: colors.accent }]}>
            Fill demo credentials
          </Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Phone Number
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.phone ? colors.destructive : colors.border,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
            >
              <Feather name="phone" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="e.g. 0987654321"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
                }}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.password
                    ? colors.destructive
                    : colors.border,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
            >
              <Feather name="lock" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Your password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: "" }));
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.loginBtn,
              {
                backgroundColor: loading
                  ? colors.primary + "80"
                  : colors.primary,
                borderRadius: colors.radius,
              },
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Feather name="loader" size={18} color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.mutedForeground }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: colors.muted,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.foreground }]}>
            Demo Credentials
          </Text>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Phone: 0987654321{"\n"}Password: Nati@1234
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  logoRow: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBox: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  demoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 24,
  },
  demoBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
    marginTop: 4,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoBox: {
    padding: 14,
    gap: 4,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
