import styles from './{{outputName}}.module.css';

export interface I{{outputName}} {
    sampleTextProp: string;
}

const {{outputName}}: React.FC<I{{outputName}}> = ({sampleTextProp}) => {
    return (
        <div className={styles.{{outputName}}}>
            { sampleTextProp }
        </div>
    )
}

export default {{outputName}};
