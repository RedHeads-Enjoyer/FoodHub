import styles from './styles.module.css'

const info = {
    image:"https://png.pngtree.com/png-vector/20191107/ourmid/pngtree-abstract-square-shape-beautiful-repeat-pattern-design-png-image_1953439.jpg",
    label:"Название блюда типа да",
    rating: 4.6,
    views: 12345345,
    duration: 555,
    difficult: 5
}

const RecipeCarp = (props) => {
    return (
        <div className={styles.card__wrapper}>
            <img className={styles.image_wrapper} src={info.image}/>
            <p className={styles.label__image}>{info.label}</p>
            <p>{info.rating}</p>
            <p>{info.views}</p>
            <p>{info.duration}</p>
            <p>{info.difficult}</p>
        </div>
    )
}

export default RecipeCarp