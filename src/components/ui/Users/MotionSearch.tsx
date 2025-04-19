import CountUp from "react-countup";

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
    <span className={`flex flex-row gap-2  text-base${badgeClass}`}>
      Se encontraron
      <span className={badgeClass} style={{ display: "inline-block" }}>
        <CountUp
          start={0}
          end={value}
          duration={3}
          useEasing={true}
          separator=","
          className="account-balance"
        />
      </span>
      elementos
    </span>
  );
};
