export const stats = [
  { title: "Total Balance", value: "৳20,450.00", change: "8.2%", up: true, tone: "green" },
  { title: "Monthly Income", value: "৳10,000.00", change: "12.5%", up: true, tone: "green" },
  { title: "Monthly Expenses", value: "৳2,650.00", change: "6.8%", up: false, tone: "red" },
  { title: "Savings", value: "৳1,550.00", change: "10.4%", up: true, tone: "purple" },
] as const;

export const monthly = [
  { month: "Jan", income: 3200, expenses: 2600 },
  { month: "Feb", income: 3550, expenses: 2800 },
  { month: "Mar", income: 3500, expenses: 2750 },
  { month: "Apr", income: 4350, expenses: 3300 },
];

export const breakdown = [
  { name: "Food & Dining", value: 848, color: "#0e9f6e" },
  { name: "Housing", value: 636, color: "#4f7be8" },
  { name: "Transportation", value: 398, color: "#f97316" },
  { name: "Shopping", value: 318, color: "#a855f7" },
  { name: "Utilities", value: 212, color: "#fbbf24" },
  { name: "Other", value: 239, color: "#cbd5e1" },
];

export const transactions = [
  { date: "Apr 28, 2025", desc: "Daraz", category: "Shopping", amount: -129.99 },
  { date: "Apr 27, 2025", desc: "Salary Deposit", category: "Income", amount: 2800 },
  { date: "Apr 26, 2025", desc: "Khanas", category: "Food & Dining", amount: -500.76 },
  { date: "Apr 24, 2025", desc: "Rent Payment", category: "Housing", amount: -2000 },
  { date: "Apr 22, 2025", desc: "Shell Gas Station", category: "Transportation", amount: -170.32 },
];