import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { InquiryItem, InquiryStatus, InquiryType } from "@/lib/types/inquiry";

type InquiryTableProps = {
  items: InquiryItem[];
};

const inquiryTypeLabels: Record<InquiryType, string> = {
  "athlete-program": "선수 프로그램",
  education: "교육",
  "freeride-tour": "프리라이드 투어",
  membership: "회원가입 / 등급",
  "business-partner": "협력업체",
  sponsorship: "스폰서십",
  media: "미디어",
  general: "일반 문의",
};

const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "신규",
  reviewing: "검토중",
  needs_reply: "답변 필요",
  closed: "종료",
};

function getStatusTone(status: InquiryStatus) {
  if (status === "new") {
    return "amber";
  }

  if (status === "reviewing") {
    return "blue";
  }

  if (status === "needs_reply") {
    return "red";
  }

  return "green";
}

function maskName(name: string) {
  if (name.length <= 1) {
    return "*";
  }

  if (name.length <= 3) {
    return `${name.slice(0, 1)}${"*".repeat(name.length - 1)}`;
  }

  return `${name.slice(0, 2)}${"*".repeat(Math.min(name.length - 2, 4))}`;
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");

  if (!domain) {
    return "이메일 비공개";
  }

  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
}

function maskPhone(phone?: string) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length < 7) {
    return "전화번호 비공개";
  }

  const first = digits.slice(0, 3);
  const last = digits.slice(-4);
  return `${first}-****-${last}`;
}

function summarizeMessage(message: string) {
  const compact = message.replace(/\s+/g, " ").trim();

  if (compact.length <= 20) {
    return compact;
  }

  return `${compact.slice(0, 20)}...`;
}

export function InquiryTable({ items }: InquiryTableProps) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">문의 유형</th>
            <th className="px-4 py-3">제목 / 내용 요약</th>
            <th className="px-4 py-3">문의자</th>
            <th className="px-4 py-3">연락처</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">담당</th>
            <th className="px-4 py-3">접수일</th>
            <th className="px-4 py-3">관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const maskedPhone = maskPhone(item.phone);

            return (
              <tr key={item.id} className="border-t border-zinc-100 align-top">
                <td className="px-4 py-4 font-bold">
                  {inquiryTypeLabels[item.type]}
                </td>
                <td className="px-4 py-4">
                  <p className="font-black">{item.title}</p>
                  <p className="mt-1 max-w-md text-zinc-600">
                    {summarizeMessage(item.message)}
                  </p>
                </td>
                <td className="px-4 py-4 font-bold">{maskName(item.name)}</td>
                <td className="px-4 py-4 text-zinc-600">
                  <p>{maskEmail(item.email)}</p>
                  {maskedPhone ? <p className="mt-1">{maskedPhone}</p> : null}
                </td>
                <td className="px-4 py-4">
                  <Badge tone={getStatusTone(item.status)}>
                    {inquiryStatusLabels[item.status]}
                  </Badge>
                </td>
                <td className="px-4 py-4 font-bold">
                  {item.assignedTo ?? "미지정"}
                </td>
                <td className="px-4 py-4 font-bold">{item.createdAt}</td>
                <td className="px-4 py-4">
                <Link
                  href={`/admin/contact-join/${item.id}`}
                  className="border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-black uppercase text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  검토
                </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
