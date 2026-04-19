import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { Loan, LoanStatus } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLoanStatus, cancelLoan } from "@/store/slices/loanSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import * as Haptics from "expo-haptics";

interface LoanDetailModalProps {
  loan: Loan | null;
  onClose: () => void;
}

const STATUS_FLOW: Record<LoanStatus, LoanStatus | null> = {
  open: "pending",
  pending: "accepted",
  accepted: "approved",
  approved: "repaid",
  repaid: null,
  cancelled: null,
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "Mark as Accepted",
  accepted: "Mark as Approved",
  approved: "Mark as Repaid",
};

const STATUS_COLORS: Record<string, string> = {
  open: "#3b82f6",
  pending: "#f0ab30",
  accepted: "#8b5cf6",
  approved: "#0e7f6e",
  repaid: "#22c55e",
  cancelled: "#ef4444",
};

export function LoanDetailModal({ loan, onClose }: LoanDetailModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  if (!loan) return null;

  const statusColor = STATUS_COLORS[loan.status] || colors.mutedForeground;
  const nextStatus = STATUS_FLOW[loan.status];
  const nextLabel = NEXT_STATUS_LABEL[loan.status];
  const isLender = loan.lenderId === user?.id;

  const handleAdvance = () => {
    if (!nextStatus) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(updateLoanStatus({ loanId: loan.id, status: nextStatus }));

    const notifMap: Record<string, any> = {
      accepted: {
        type: "loan_accepted",
        title: "Loan Accepted",
        message: `Loan agreement with ${loan.borrowerName} is now accepted.`,
      },
      approved: {
        type: "loan_approved",
        title: "Loan Approved",
        message: `Loan of ETB ${loan.amount.toLocaleString()} is now approved and active.`,
      },
      repaid: {
        type: "loan_repaid",
        title: "Loan Repaid",
        message: `${loan.borrowerName} has fully repaid the ETB ${loan.amount.toLocaleString()} loan.`,
      },
    };

    if (notifMap[nextStatus]) {
      dispatch(
        addNotification({ ...notifMap[nextStatus], loanId: loan.id })
      );
    }
    onClose();
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Loan",
      "Are you sure you want to cancel this loan?",
      [
        { text: "No" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            dispatch(cancelLoan(loan.id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onClose();
          },
        },
      ]
    );
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Feather
          name={icon as any}
          size={14}
          color={colors.mutedForeground}
        />
        <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={!!loan}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Loan Details
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor + "20",
                borderRadius: 999,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={styles.amountLabel}>Loan Amount</Text>
            <Text style={styles.amountValue}>
              ETB {loan.amount.toLocaleString()}
            </Text>
            <View style={styles.amountStats}>
              <View style={styles.amountStat}>
                <Text style={styles.amountStatValue}>{loan.interestRate}%</Text>
                <Text style={styles.amountStatLabel}>Annual Rate</Text>
              </View>
              <View style={styles.amountStatDivider} />
              <View style={styles.amountStat}>
                <Text style={styles.amountStatValue}>{loan.termMonths}mo</Text>
                <Text style={styles.amountStatLabel}>Term</Text>
              </View>
              {loan.monthlyPayment && (
                <>
                  <View style={styles.amountStatDivider} />
                  <View style={styles.amountStat}>
                    <Text style={styles.amountStatValue}>
                      {loan.monthlyPayment.toLocaleString()}
                    </Text>
                    <Text style={styles.amountStatLabel}>ETB/Month</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {loan.purpose}
            </Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>
              {loan.description}
            </Text>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
            ]}
          >
            <InfoRow icon="user" label="Borrower" value={loan.borrowerName} />
            {loan.lenderName && (
              <InfoRow icon="briefcase" label="Lender" value={loan.lenderName} />
            )}
            <InfoRow icon="calendar" label="Created" value={loan.createdAt} />
            {loan.dueDate && (
              <InfoRow icon="clock" label="Due Date" value={loan.dueDate} />
            )}
            {loan.collateral && (
              <InfoRow icon="shield" label="Collateral" value={loan.collateral} />
            )}
          </View>

          {isLender &&
            loan.status !== "repaid" &&
            loan.status !== "cancelled" &&
            nextLabel && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: colors.radius,
                  },
                ]}
                onPress={handleAdvance}
              >
                <Feather name="arrow-right-circle" size={18} color="#fff" />
                <Text style={styles.actionBtnText}>{nextLabel}</Text>
              </TouchableOpacity>
            )}

          {loan.status === "pending" && (
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                {
                  borderColor: colors.destructive,
                  borderRadius: colors.radius,
                },
              ]}
              onPress={handleCancel}
            >
              <Feather name="x-circle" size={16} color={colors.destructive} />
              <Text style={[styles.cancelBtnText, { color: colors.destructive }]}>
                Cancel Loan
              </Text>
            </TouchableOpacity>
          )}

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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  amountCard: {
    padding: 20,
    alignItems: "center",
  },
  amountLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 4,
  },
  amountValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 16,
  },
  amountStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountStat: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  amountStatValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  amountStatLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },
  amountStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  section: {
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 8,
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
