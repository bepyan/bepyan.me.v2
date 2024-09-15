import styles from './spinner.module.css';

const bars = Array(12).fill(0);

export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className={styles.wrapper}
      style={
        {
          ['--spinner-size']: `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.spinner}>
        {bars.map((_, i) => (
          <div className={styles.bar} key={`spinner-bar-${i}`} />
        ))}
      </div>
    </div>
  );
}
