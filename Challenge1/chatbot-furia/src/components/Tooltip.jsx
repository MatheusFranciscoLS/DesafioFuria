import React, { useState } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className={styles.tooltipWrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      tabIndex={0}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && (
        <span className={styles.tooltip}>{text}</span>
      )}
    </span>
  );
}
