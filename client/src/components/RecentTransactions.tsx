import { transactions } from "@/data/mock";

const pill: Record<string, string> = {
  Shopping: "bg-purple-100 text-purple-600",
  Income: "bg-brand-50 text-brand-600",
  "Food & Dining": "bg-orange-100 text-orange-600",
  Housing: "bg-blue-100 text-blue-600",
  Transportation: "bg-cyan-100 text-cyan-700",
};

export default function RecentTransactions() {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <a href="/transactions" className="text-sm text-muted hover:text-ink">View All →</a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.date + t.desc} className="border-t border-line">
              <td className="py-3.5 text-muted">{t.date}</td>
              <td className="py-3.5 font-medium">{t.desc}</td>
              <td className="py-3.5">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${pill[t.category]}`}>{t.category}</span>
              </td>
              <td className={`py-3.5 text-right font-medium ${t.amount < 0 ? "text-red-500" : "text-brand-600"}`}>
                {t.amount < 0 ? "-" : "+"}৳{Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}