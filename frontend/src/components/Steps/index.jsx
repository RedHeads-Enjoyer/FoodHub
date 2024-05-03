import classes from "./styles.module.css";
import {useEffect, useState} from "react";
import InputTextArea from "../InputTextArea";

const Steps = ({steps, onChange, name}) => {
    const [durations, setDurations] = useState([])

    const handleAddStepButton = (e) => {
        e.preventDefault()
        setDurations([...durations, {"h": 0, "m": 0, "s": 0}])
        console.log(durations)
        onChange({ currentTarget: {name, value: [...steps, {duration: 0, description: ""}]} })
    }

    const handleDescriptionChange = (e, index) => {
        steps[index].description = e.target.value
        onChange({ currentTarget: {name, value: steps}})
    }

    const handleDurationHoursChange = (e, index) => {
        const newDurations = []
        for (let i = 0; i < durations.length; i++) {
            if (i !== index) newDurations.push(durations[i])
            else newDurations.push({...durations[i], h: parseInt(e.target.value)})
        }
        setDurations(newDurations)
    }

    const handleDurationMinutesChange = (e, index) => {
        const newDurations = []
        for (let i = 0; i < durations.length; i++) {
            if (i !== index) newDurations.push(durations[i])
            else newDurations.push({...durations[i], m: parseInt(e.target.value)})
        }
        setDurations(newDurations)
    }

    const handleDurationSecondsChange = (e, index) => {
        const newDurations = []
        for (let i = 0; i < durations.length; i++) {
            if (i !== index) newDurations.push(durations[i])
            else newDurations.push({...durations[i], s: parseInt(e.target.value)})
        }
        setDurations(newDurations)
    }

    useEffect(() => {
        if (durations.length !== 0) {
            const newSteps = []
            for (let i = 0; i < steps.length; i++) {
                newSteps.push({...steps[i], duration: durations[i].h * 3600 + durations[i].m * 60 + durations[i].s})
            }
            console.log(newSteps)
            onChange({ currentTarget: {name, value: newSteps} })
        }
    }, [durations])

    return (
        <div className={classes.steps__wrapper}>
            {steps.map((step, index) => (
                <div className={classes.step__wrapper} key={index}>
                    <div className={classes.div__flex}>
                        <div className={classes.index__wrapper}>
                            <p>{index + 1}</p>
                        </div>
                        <div className={classes.duration__wrapper}>
                            <input
                                value={durations[index].h}
                                className={classes.number__input}
                                type={"number"}
                                onChange={(e) => handleDurationHoursChange(e, index)}
                            />
                            <input
                                value={durations[index].m}
                                className={classes.number__input}
                                type={"number"}
                                onChange={(e) => handleDurationMinutesChange(e, index)}
                            />
                            <input
                                value={durations[index].s}
                                className={classes.number__input}
                                type={"number"}
                                onChange={(e) => handleDurationSecondsChange(e, index)}
                            />
                        </div>
                    </div>
                    <InputTextArea
                        value={step.description}
                        placeholder={"Описание"}
                        required={true}
                        onChange={(e) => handleDescriptionChange(e, index)}
                    />
                </div>
            ))}

            <button onClick={handleAddStepButton}>+</button>
        </div>

    );
};

export default Steps