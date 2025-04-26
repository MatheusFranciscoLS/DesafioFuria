import React, { useRef } from 'react';
import styles from './AvatarUpload.module.css';

export default function AvatarUpload({ currentAvatar, onChange }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.avatarUpload}>
      <img src={currentAvatar} alt="Seu avatar" className={styles.avatarPreview} />
      <button type="button" onClick={() => inputRef.current.click()} className={styles.avatarBtn}>
        Alterar avatar
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
        aria-label="Upload de avatar"
      />
    </div>
  );
}
