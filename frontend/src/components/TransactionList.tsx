import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: Props) {
  if (!transactions.length) {
    return (
      <div className="py-8 text-center text-sm text-slate-400">
        No transactions match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400">
            <th className="py-2 font-medium">Title</th>
            <th className="py-2 font-medium">Category</th>
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 font-medium text-right">Amount</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-slate-50 last:border-0">
              <td className="py-2.5">
                <div className="font-medium text-slate-700">{t.title}</div>
                {t.notes && <div className="text-xs text-slate-400">{t.notes}</div>}
              </td>
              <td className="py-2.5">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${t.category.color}20`, color: t.category.color }}
                >
                  {t.category.name}
                </span>
              </td>
              <td className="py-2.5 text-slate-500">
                {new Date(t.date).toLocaleDateString()}
              </td>
              <td
                className={`py-2.5 text-right font-semibold ${
                  t.type === "INCOME" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {t.type === "INCOME" ? "+" : "-"}₹{Number(t.amount).toFixed(2)}
              </td>
              <td className="py-2.5 text-right">
                <button
                  onClick={() => onEdit(t)}
                  className="mr-2 text-xs font-medium text-brand-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
