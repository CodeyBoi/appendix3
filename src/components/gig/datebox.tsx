import { Dayjs } from 'dayjs';
import React from 'react';
import styles from './info.module.css';

interface DateboxProps {
  date: Dayjs;
}

const Datebox = ({ date }: DateboxProps) => (
  <div className={styles.datebox}>
    <div className={styles.datemonth}>
      <div className={styles.month}>
        {date
          .toDate()
          .toLocaleDateString('fi-FI', { month: 'short' })
          .slice(0, 3)
          .toUpperCase()}
      </div>
      <div className={styles.date}>{date.date()}</div>
    </div>
    <div className={styles.day}>
      {date
        .toDate()
        .toLocaleDateString('fi-FI', { weekday: 'short' })
        .slice(0, 3)
        .toUpperCase()}
    </div>
  </div>
);

export default Datebox;
