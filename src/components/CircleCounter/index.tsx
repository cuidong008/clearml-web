import classNames from "classnames";
import { filesize } from "filesize";
import styles from "./index.module.scss";
import { CircleTypeEnum } from "@/types/enums";

export const CircleCounter = (props: {
  counter: number | string | { value: number | string; label: string }[];
  label?: string;
  underLabel?: string;
  type?: CircleTypeEnum;
}) => {
  const { counter, underLabel, label, type } = props;

  function transformFileSize(val: number | string) {
    if (typeof val !== "number") {
      return val;
    }
    return filesize(val, {
      base: 10,
      round: 0,
      spacer: "",
      symbols: { kB: "K", k: "K", B: " ", MB: "M", GB: "G" },
    }) as string;
  }

  return (
    <div className={styles.counterContainer}>
      <div
        className={classNames(
          styles.circleCounter,
          styles[type ?? CircleTypeEnum.pending],
          Array.isArray(counter) ? styles.multi : ""
        )}
      >
        {Array.isArray(counter) ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 24,
            }}
          >
            {counter.map((c) => (
              <div key={c.label}>
                <div
                  className={classNames(
                    styles.subCounter,
                    c.value === "N/A" ? styles.noValue : ""
                  )}
                >
                  {transformFileSize(c.value)}
                </div>
                <div className={styles.subLabel}>{c.label}</div>
              </div>
            ))}
          </div>
        ) : typeof counter === "number" ? (
          <div className={styles.counter}>{transformFileSize(counter)}</div>
        ) : (
          <div className={styles.counter}>{counter}</div>
        )}
      </div>
      <div className={styles.counterLabel}>{label}</div>
      {underLabel && (
        <div className={classNames(styles.counterLabel, styles.leaveSpace)}>
          {underLabel}
        </div>
      )}
    </div>
  );
};
