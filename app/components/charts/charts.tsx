// charts
import styles from './charts.module.css';

export interface Icharts {
  sampleTextProp: string;
}

const charts: React.FC<Icharts> = ({sampleTextProp}) => {
  return (
    <div className={styles.charts}>
      { sampleTextProp }
    </div>
  )
}

export default charts;
