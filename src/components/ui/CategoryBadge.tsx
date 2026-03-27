import { getCategoryConfig } from "@/lib/utils/categories";

type CategoryBadgeProps = {
  category: string;
  showIcon?: boolean;
};

export default function CategoryBadge({
  category,
  showIcon = true,
}: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.badgeClassName}`}
    >
      {showIcon ? <Icon size={12} /> : null}
      <span>{config.label}</span>
    </span>
  );
}