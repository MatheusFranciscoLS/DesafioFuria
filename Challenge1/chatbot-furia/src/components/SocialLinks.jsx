import React from 'react';
import styles from './SocialLinks.module.css';

const LINKS = [
  { name: 'Twitter', url: 'https://twitter.com/furiagg', icon: '/icons/twitter.svg' },
  { name: 'Instagram', url: 'https://instagram.com/furiagg', icon: '/icons/instagram.svg' },
  { name: 'Twitch', url: 'https://twitch.tv/furiagg', icon: '/icons/twitch.svg' },
];

export default function SocialLinks() {
  return (
    <section className={styles.socialSection}>
      <h2 className={styles.title}>🌐 Redes Sociais Oficiais</h2>
      <div className={styles.linksWrapper}>
        {LINKS.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <img src={link.icon} alt={link.name} className={styles.icon} />
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
