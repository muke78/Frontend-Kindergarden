import { AnimateNumber } from "motion-number";

interface PropsMotionSearch {
  value: number;
  showError: boolean;
}

export const MotionSearch = ({ value, showError }: PropsMotionSearch) => {
  const badgeClass = showError
    ? "badge badge-error"
    : value > 0
      ? "badge badge-success"
      : "badge badge-warning";

  return (
    <span className="flex flex-row gap-2 text-base">
      Se encontraron
      <AnimateNumber
        format={{ notation: "standard" }}
        locales="es-ES"
        style={{
          borderRadius: 999,
          background: badgeClass,
          padding: "0px 10px",
        }}
        className={badgeClass}
      >
        {value}
      </AnimateNumber>
      elementos
    </span>
  );
};
