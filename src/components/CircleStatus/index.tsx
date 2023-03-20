import {
  EXPERIMENTS_STATUS_LABELS,
  EXPERIMENTS_TYPE_LABELS,
  TaskStatusEnum,
  TaskTypeEnum,
} from "@/types/enums";
import styles from "./index.module.scss";
import classNames from "classnames";

export const CircleStatus = (props: {
  status?: TaskStatusEnum;
  type?: TaskTypeEnum;
  defaultStatus?: string;
}) => {
  const { status, type, defaultStatus } = props;
  const st = status ? status : type ? type : "";

  return (
    <div className={styles.counterContainer}>
      <div className={classNames(styles.circle, styles[st])}>
        {status && (
          <i
            className={classNames(
              "icon sm-md white",
              defaultStatus,
              `i-${status}`
            )}
          ></i>
        )}
        {type && (
          <i
            className={classNames(
              "al-icon lg al-color white",
              `al-ico-type-${type.replace("_", "-")}`
            )}
          ></i>
        )}
      </div>
      <div className={styles.counterLabel}>
        {status
          ? EXPERIMENTS_STATUS_LABELS[status]
          : type
          ? EXPERIMENTS_TYPE_LABELS[type]
          : ""}
      </div>
    </div>
  );
};
