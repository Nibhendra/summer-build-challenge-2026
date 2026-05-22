# MyPocket UPI Tracker 💸

A premium, modern React Native & Expo mobile expense tracker designed for Indian students and daily users. It allows manual logging of daily expenses made through UPI apps (Paytm, PhonePe, Google Pay, BHIM, etc.), Cash, and Cards, providing elegant visualization, budget tracking, and data export.

**App #02 of the summer-build-challenge-2026 (Phase 01: Foundation)**

---

## 📱 Features

1. **Quick Add Expense**
   - Log amount, description, category, and payment mode.
   - Smart UPI App Selector (Paytm, PhonePe, GPay, BHIM) that only displays when UPI is selected.
   - Quick date chips (Today / Yesterday) or custom date input.
   - Foolproof validation for negative/invalid amounts.

2. **Dashboard Overview**
   - High-fidelity visual cards for current month's spending, today's spending, Cash vs UPI totals.
   - Interactive monthly vs daily relative spending bar.
   - Quick access to add new expenses and list of the latest 5 transactions.

3. **Advanced Expense Filtering & Search**
   - Filter transactions dynamically by **Payment Mode** (UPI, Cash, Card, Other) or **Category** (Food & Dining, Transport, Rent, Shopping, etc.).
   - Sort by Newest or Oldest instantly.
   - Inline edit and warning-based delete actions.

4. **Rich Analytics & Insights**
   - Category-wise spending breakdown with visual progress bars.
   - Beautiful, fully interactive charts:
     - **Payment Mode Distribution (Pie Chart)**: Live UPI vs Cash vs Card breakdown.
     - **Daily Spending Trend (Bar Chart)**: Last 7 days overview.
   - User-defined monthly budget warning meter. Turns red when spending exceeds the limit.

5. **Local Persistence & Settings**
   - Locally stored settings and transactions using `AsyncStorage`.
   - Set/update monthly budget.
   - Export all transaction data as a formatted `JSON` file via standard share sheet.
   - Clear all data button.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (Expo Go compatible, no prebuild needed)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Charts**: [react-native-chart-kit](https://github.com/indri/react-native-chart-kit)
- **Storage**: `@react-native-async-storage/async-storage`
- **Sharing**: `expo-sharing` & `expo-file-system` for JSON export

---

## 📐 Data Model

```typescript
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  paymentMode: PaymentMode;
  upiApp: UpiApp;
  date: string;       // YYYY-MM-DD
  createdAt: string;  // ISO Datetime
}
```

---

## 🎨 Screenshots Section

*(Add screenshots here after deploying to Expo Go)*

| Home Dashboard | Add Expense | Analytics Screen | Settings & Budget |
| :---: | :---: | :---: | :---: |
| *[Dashboard]* | *[Add New]* | *[Charts]* | *[Settings]* |

---

## 💡 What I Learned

- **Expo Router Stack & Modals**: Implemented clean native modal routes (`presentation: 'modal'`) for adding and editing expenses without cluttering the tabs layout.
- **Dynamic Chart Kit Rendering**: Optimized `react-native-chart-kit` layouts to prevent rendering glitches on narrow screens by dynamically extracting window dimensions and using safe fallback structures.
- **AsyncStorage State Syncing**: Developed custom React hooks (`useExpenses`) that safely coordinate disk updates and component re-renders when switching tabs using `useFocusEffect`.
- **Indian Financial Visuals**: Integrated custom formatting utilities supporting Lakhs and Crores numbering conventions (`en-IN` locales) for an authentic Indian app experience.

---

## 🚀 Future Upgrades

To scale MyPocket into a production-grade personal finance tool, the following features are planned:

1. **SMS Auto-Import (SMS Reader)**
   - Integrate `react-native-get-sms-android` to request read permissions and parse banking alert SMS templates (e.g., *"Debited for Rs XX"* or *"Sent Rs XX to..."*) to automatically draft expenses.

2. **Paytm/UPI Deep Linking & API Integration**
   - Connect Paytm Merchant APIs/Webhooks or use UPI deep-linking schemes (`upi://pay?pa=...`) to initiate transactions directly inside the app.

3. **Bank Statement PDF Parser**
   - Add a PDF parsing worker to parse and categorize transactions directly from monthly statements exported from HDFC, SBI, ICICI, etc.

4. **Cloud Backup**
   - Sync data securely via Firebase/Supabase and enable email-based weekly expense digests.
