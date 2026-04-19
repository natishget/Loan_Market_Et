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
import { createLoanSchema, createMarketplaceLoanSchema } from "@/validation/loanSchema";
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
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [collateral, setCollateral] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setAmount("");
    setInterestRate("");
    setTermMonths("");
    setPurpose("");
    setDescription("");
    setCollateral("");
    setBorrowerName("");
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
      const result = createLoanSchema.safeParse({
        ...rawData,
        borrowerName,
      });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((e) => {
          fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      dispatch(
        createLoan({
          ...rawData,
          borrowerId: "external-" + Date.now(),
          borrowerName: borrowerName || "Unknown Borrower",
          lenderId: user.id,
          lenderName: user.name,
        })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Loan Created", "Your direct loan has been created and is pending.");
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
          title: "New Loan Opportunity",
          message: `${user.name} is requesting ETB ${parseFloat(amount).toLocaleString()} for ${purpose}`,
          loanId: "new",
        })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Loan Request Posted",
        "Your request is now visible in the Marketplace."
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
              { backgroundColor: colors.primary, borderRadius: colors.radius / 1.5 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.modeToggle, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
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
              color={mode === "direct" ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color:
                    mode === "direct" ? colors.primary : colors.mutedForeground,
                },
              ]}
            >
              Direct Loan
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
                mode === "marketplace" ? colors.primary : colors.mutedForeground
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
              Request (Unknown Lender)
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "marketplace" && (
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
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              Your request will be visible in the Marketplace for lenders to discover and apply.
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
                Borrower Name
              </Text>
              <TextInput
                style={inputStyle}
                placeholder="Full name of borrower"
                placeholderTextColor={colors.mutedForeground}
                value={borrowerName}
                onChangeText={setBorrowerName}
              />
              {errors.borrowerName && (
                <Text style={styles.error}>{errors.borrowerName}</Text>
              )}
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
    paddingVertical: 8,
    gap: 6,
  },
  modeBtnText: {
    fontSize: 12,
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
