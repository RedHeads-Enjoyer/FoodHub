import classes from "./styles.module.css";
import InputTextArea from "../InputTextArea";
import Timer from "../Timer";
import {useEffect} from "react";

const StepsWithTimer = ({steps}) => {
    const handleStepPlayButton = (e, index) => {

    }

    return (
        <div className={classes.steps__wrapper}>
            asd
            {steps !== undefined ? steps.map((step, index) => (
                <div key={`step${index}`}>
                    <p className={classes.step__description}>{step.description}</p>
                </div>

            )) : "net"}
        </div>
    );
};

export default StepsWithTimer