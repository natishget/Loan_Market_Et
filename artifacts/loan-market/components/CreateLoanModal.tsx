import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLoan, createMarketplaceLoan } from "@/store/slices/loanSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import {
  createDirectLoanSchema,
  createMarketplaceLoanSchema,
} from "@/validation/loanSchema";
import { MOCK_USERS } from "@/data/mockData";
import * as Haptics from "expo-haptics";

type LoanMode = "direct" | "marketplace";

interface CreateLoanModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateLoanModal({ visible, onClose }: CreateLoanModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [mode, setMode] = useState<LoanMode>("direct");
  const [lenderId, setLenderId] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [collateral, setCollateral] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setLenderId("");
    setAmount("");
    setInterestRate("");
    setTermMonths("");
    setPurpose("");
    setDescription("");
    setCollateral("");
    setErrors({});
    setMode("direct");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!user) return;

    const rawData = {
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      termMonths: parseInt(termMonths),
      purpose,
      description,
      collateral: collateral || undefined,
    };

    if (mode === "direct") {
      const result = createDirectLoanSchema.safeParse({
        ...rawData,
        lenderId,
      });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((e) => {
          fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const lenderUser = MOCK_USERS.find((u) => u.id === lenderId);
      const lenderName = lenderUser?.name || `Lender #${lenderId}`;

      dispatch(
        createLoan({
          ...rawData,
          borrowerId: user.id,
          borrowerName: user.name,
          lenderId,
          lenderName,
        })
      );

      dispatch(
        addNotification({
          type: "loan_accepted",
          title: "Direct Loan Created",
          message: `Loan of ETB ${parseFloat(amount).toLocaleString()} created with lender ID ${lenderId}.`,
          loanId: "new",
        })
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Loan Created",
        "Your direct loan has been created and is pending lender confirmation."
      );
    } else {
      const result = createMarketplaceLoanSchema.safeParse(rawData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((e) => {
          fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      dispatch(
        createMarketplaceLoan({
          ...rawData,
          borrowerId: user.id,
          borrowerName: user.name,
          borrowerInitials: initials,
          location: user.location,
          businessType: user.businessType,
        })
      );

      dispatch(
        addNotification({
          type: "new_marketplace_loan",
          title: "Marketplace Request Posted",
          message: `Your request for ETB ${parseFloat(amount).toLocaleString()} is now visible to lenders.`,
          loanId: "new",
        })
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Request Posted",
        "Your loan request is now visible in the Marketplace for lenders to find."
      );
    }
    handleClose();
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.foreground,
      borderRadius: colors.radius / 1.5,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: Platform.OS === "web" ? 67 : insets.top || 20,
          },
        ]}
      >
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose} hitSlop={12}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>
            New Loan
          </Text>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.modeToggle,
            { backgroundColor: colors.muted, borderRadius: colors.radius },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === "direct" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setMode("direct")}
          >
            <Feather
              name="users"
              size={14}
              color={
                mode === "direct" ? colors.primary : colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color:
                    mode === "direct"
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              Known Lender
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === "marketplace" && {
                backgroundColor: colors.card,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            onPress={() => setMode("marketplace")}
          >
            <Feather
              name="globe"
              size={14}
              color={
                mode === "marketplace"
                  ? colors.primary
                  : colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color:
                    mode === "marketplace"
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              Unknown Lender
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "marketplace" ? (
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.primary + "10",
                borderColor: colors.primary + "30",
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="globe" size={14} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              Your request will appear in the Marketplace. Any lender can apply.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.accent + "10",
                borderColor: colors.accent + "30",
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="shield" size={14} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.accent }]}>
              Enter the Lender's User ID to create a direct loan agreement.
            </Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {mode === "direct" && (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Lender ID
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.lenderId
                      ? colors.destructive
                      : colors.border,
                    borderRadius: colors.radius / 1.5,
                  },
                ]}
              >
                <Feather
                  name="user-check"
                  size={16}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[styles.inputInner, { color: colors.foreground }]}
                  placeholder="e.g. user-2 or user-3"
                  placeholderTextColor={colors.mutedForeground}
                  value={lenderId}
                  onChangeText={setLenderId}
                  autoCapitalize="none"
                />
              </View>
              {errors.lenderId && (
                <Text style={styles.error}>{errors.lenderId}</Text>
              )}
              <Text
                style={[styles.hint, { color: colors.mutedForeground }]}
              >
                Demo lender IDs: user-2, user-3, user-4
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Amount (ETB)
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="e.g. 50000"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              {errors.amount && (
                <Text style={styles.error}>{errors.amount}</Text>
              )}
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Rate (%/yr)
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="e.g. 8"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                value={interestRate}
                onChangeText={setInterestRate}
              />
              {errors.interestRate && (
                <Text style={styles.error}>{errors.interestRate}</Text>
              )}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Term (months)
            </Text>
            <View style={styles.termRow}>
              {[3, 6, 12, 18, 24].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.termChip,
                    {
                      backgroundColor:
                        termMonths === t.toString()
                          ? colors.primary
                          : colors.muted,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setTermMonths(t.toString())}
                >
                  <Text
                    style={[
                      styles.termChipText,
                      {
                        color:
                          termMonths === t.toString()
                            ? "#fff"
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    {t}mo
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.termMonths && (
              <Text style={styles.error}>{errors.termMonths}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Purpose
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="e.g. Business Expansion"
              placeholderTextColor={colors.mutedForeground}
              value={purpose}
              onChangeText={setPurpose}
            />
            {errors.purpose && (
              <Text style={styles.error}>{errors.purpose}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Description
            </Text>
            <TextInput
              style={[inputStyle, styles.textArea]}
              placeholder="Describe how you plan to use the funds and how you'll repay..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            {errors.description && (
              <Text style={styles.error}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Collateral (optional)
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="e.g. Land Certificate, Vehicle"
              placeholderTextColor={colors.mutedForeground}
              value={collateral}
              onChangeText={setCollateral}
            />
          </View>

          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  modeToggle: {
    flexDirection: "row",
    margin: 16,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    gap: 6,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  form: {
    padding: 16,
    gap: 6,
  },
  field: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  hint: {
    fontSize: 11,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 10,
  },
  inputInner: {
    flex: 1,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 11,
  },
  termRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  termChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  termChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  error: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 4,
  },
});
