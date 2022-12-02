import { Dayjs } from "dayjs";
import React from "react";
import styles from "./info.module.css";

interface DateboxProps {
  date: Dayjs;
}

const Datebox = ({ date }: DateboxProps) => (
  <div className={styles.datebox}>
    <div className={styles.date}>
      {date.date()}
    </div>
    <div className={styles.day}>
      {date.toDate().toLocaleDateString('sv-SE', { weekday: 'short' }).toUpperCase()}
    </div>
  </div>
);

export default Datebox;
