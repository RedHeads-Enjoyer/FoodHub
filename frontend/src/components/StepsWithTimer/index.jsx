import classes from "./styles.module.css";
import InputTextArea from "../InputTextArea";
import Timer from "../Timer";
import {useEffect, useState} from "react";

const PlayTimer = ({duration}) => {
    const [time, setTime] = useState(duration)

    return (
        <div className={classes.duration__wrapper}>
            <div className={classes.number__wrapper}>
                <p>{Math.floor(time / 3600)}</p>
                <label>час</label>
            </div>
            <div className={classes.number__wrapper}>
                <p>{Math.floor(time % 3600 / 60)}</p>
                <label>мин</label>
            </div>
            <div className={classes.number__wrapper}>
                <p>{time % 60}</p>
                <label>сек</label>
            </div>
        </div>
    )
}


const StepsWithTimer = ({steps}) => {
    return (
        <div className={classes.steps__wrapper}>
            {steps !== undefined ? steps.map((step, index) => (
                <div key={`step${index}`}>
                    <div className={classes.step__wrapper}>
                        <div className={classes.header__wrapper}>
                            <div className={classes.index__wrapper}>
                                <p>{index}</p>
                            </div>
                            <PlayTimer duration={step.duration}/>
                        </div>
                        <div className={classes.description__wrapper}>
                            <p className={classes.description}>{step.description}</p>
                        </div>
                    </div>

                </div>

            )) : ""}
        </div>
    );
};

export default StepsWithTimer