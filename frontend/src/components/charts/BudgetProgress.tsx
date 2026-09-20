import type { Budget } from "../../types";

export default function BudgetProgress({ budgets }: { budgets: Budget[] }) {
  if (!budgets.length) {
    return (
      <div className="text-sm text-slate-400">
        No budgets set for this month yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((b) => {
        const pct = Math.min(b.percentUsed, 100);
        const over = b.percentUsed > 100;
        return (
          <div key={b.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium" style={{ color: b.category.color }}>
                {b.category.name}
              </span>
              <span className={over ? "text-red-600" : "text-slate-500"}>
                ₹{b.spent.toFixed(0)} / ₹{b.amount.toFixed(0)}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${over ? "bg-red-500" : "bg-brand-500"}`}
                style={{ width: `${pct}%`, backgroundColor: over ? undefined : b.category.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
