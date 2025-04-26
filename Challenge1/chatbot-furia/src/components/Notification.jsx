import React from "react";
import styles from "./Chatbot.module.css";

/**
 * Notification - componente para alertas, conquistas, avisos de XP, etc.
 * Props: { type, message, onClose }
 */
export default function Notification({ type = "info", message, onClose }) {
  return (
    <div className={`${styles.notification} ${styles[type]}`} role="alert" tabIndex={0}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeNotification} aria-label="Fechar aviso">×</button>
    </div>
  );
}
