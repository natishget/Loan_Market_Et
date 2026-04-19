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
import { registerSchema } from "@/validation/authSchema";
import { User } from "@/types";

const generateId = () =>
  "user-" + Date.now().toString() + Math.random().toString(36).substr(2, 6);

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    tinNumber: "",
    email: "",
    phone: "",
    faydaId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const setField = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleRegister = () => {
    const result = registerSchema.safeParse(form);
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
      const newUser: User = {
        id: generateId(),
        name: form.name,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        tinNumber: form.tinNumber,
        faydaId: form.faydaId,
        businessType: "General Trading",
        location: "Ethiopia",
        rating: 0,
        totalLoansGiven: 0,
        totalLoansTaken: 0,
        joinedAt: new Date().toISOString().split("T")[0],
      };
      dispatch(login(newUser));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Account Created",
        "Welcome to LoanMarket Ethiopia!",
        [{ text: "Continue", onPress: () => router.replace("/") }]
      );
    }, 800);
  };

  const Field = ({
    label,
    fieldKey,
    placeholder,
    icon,
    keyboardType = "default",
    secure = false,
    onToggleSecure,
  }: {
    label: string;
    fieldKey: keyof typeof form;
    placeholder: string;
    icon: string;
    keyboardType?: any;
    secure?: boolean;
    onToggleSecure?: () => void;
  }) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.card,
            borderColor: errors[fieldKey]
              ? colors.destructive
              : colors.border,
            borderRadius: colors.radius / 1.5,
          },
        ]}
      >
        <Feather name={icon as any} size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={form[fieldKey]}
          onChangeText={(t) => setField(fieldKey, t)}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize={fieldKey === "email" || fieldKey === "password" ? "none" : "words"}
        />
        {onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} hitSlop={8}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[fieldKey] ? (
        <Text style={styles.errorText}>{errors[fieldKey]}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.heading, { color: colors.foreground }]}>
          Create Account
        </Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          Join LoanMarket Ethiopia — all fields are required
        </Text>

        <View style={styles.form}>
          <Field
            label="Full Name"
            fieldKey="name"
            placeholder="e.g. Abebe Girma"
            icon="user"
          />
          <Field
            label="Company Name"
            fieldKey="companyName"
            placeholder="e.g. Girma Import & Export PLC"
            icon="briefcase"
          />
          <Field
            label="TIN Number"
            fieldKey="tinNumber"
            placeholder="e.g. TIN-123456"
            icon="hash"
            keyboardType="default"
          />
          <Field
            label="Email Address"
            fieldKey="email"
            placeholder="you@company.com"
            icon="mail"
            keyboardType="email-address"
          />
          <Field
            label="Phone Number"
            fieldKey="phone"
            placeholder="e.g. 0987654321"
            icon="phone"
            keyboardType="phone-pad"
          />
          <Field
            label="Fayda ID (FAN)"
            fieldKey="faydaId"
            placeholder="e.g. FAN-ABG-001234"
            icon="shield"
          />
          <Field
            label="Password"
            fieldKey="password"
            placeholder="Min 8 chars, uppercase, number & symbol"
            icon="lock"
            secure={!showPassword}
            onToggleSecure={() => setShowPassword((v) => !v)}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.registerBtn,
            {
              backgroundColor: loading
                ? colors.primary + "80"
                : colors.primary,
              borderRadius: colors.radius,
            },
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Feather name="loader" size={18} color="#fff" />
          ) : (
            <>
              <Text style={styles.registerBtnText}>Create Account</Text>
              <Feather name="check" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.mutedForeground }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
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
  topBar: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    gap: 14,
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
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
  },
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
    marginBottom: 20,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
