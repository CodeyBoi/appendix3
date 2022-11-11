import { Dayjs } from "dayjs";
import React from "react";
import styles from "./info.module.css";

interface DateboxProps {
  date: Dayjs;
}

const WEEKDAY_NAMES = [
  'MÅN',
  'TIS',
  'ONS',
  'TOR',
  'FRE',
  'LÖR',
  'SÖN',
];

const Datebox = ({ date }: DateboxProps) => {

  const weekday = WEEKDAY_NAMES[date.day() - 1];
  // const month = date.format('MMM');

  return (
    <div className={styles.datebox}>
      <div className={styles.date}>
        {date.date()}
      </div>
      <div className={styles.day}>
        {weekday}
        {/* {month.toUpperCase()} */}
      </div>
    </div>
  );
}

export default Datebox;
