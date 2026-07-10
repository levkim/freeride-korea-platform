import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ReviewQueueItem } from "@/lib/types/review";

type ReviewQueueTableProps = {
  items: ReviewQueueItem[];
};

export function ReviewQueueTable({ items }: ReviewQueueTableProps) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Submitted By</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Publish Role</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-zinc-100">
              <td className="px-4 py-4 font-bold">{item.kind}</td>
              <td className="px-4 py-4">{item.title}</td>
              <td className="px-4 py-4 text-zinc-600">{item.submittedBy}</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={item.risk} />
              </td>
              <td className="px-4 py-4 font-bold">{item.requiredPublishRole}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
