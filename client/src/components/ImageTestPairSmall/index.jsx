import styles from './styles.module.css'

const RecipeCarp = (props) => {
    return (
        <div className={styles.pair__wrapper}>
            <img className={styles.image_wrapper} src={props.image}/>
            <p>{props.text}</p>
        </div>
    )
}

export default RecipeCarp