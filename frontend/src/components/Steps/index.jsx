import classes from "./styles.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader} from "../../functions";
import InputTextArea from "../InputTextArea";

const Steps = ({steps, onChange, name}) => {

    const handleAddStepButton = (e) => {
        e.preventDefault()
        onChange({ currentTarget: {name, value: [...steps, {duration: 0, description: ""}]} })
    }

    const handleDescriptionChange = (e, index) => {
        steps[index].description = e.target.value
        onChange({ currentTarget: {name, value: steps}})
    }

    const handleDurationHoursChange = (e, index) => {
        steps[index].duration = parseInt(e.target.value) * 60 * 60
        onChange({ currentTarget: {name, value: steps}})
    }

    const handleDurationMinutesChange = (e, index) => {
        steps[index].duration = parseInt(e.target.value) * 60
        onChange({ currentTarget: {name, value: steps}})
    }

    const handleDurationSecondsChange = (e, index) => {
        steps[index].duration = parseInt(e.target.value)
        onChange({ currentTarget: {name, value: steps}})
    }




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
                                className={classes.number__input}
                                type={"number"}
                                onChange={(e) => handleDurationHoursChange(e, index)}
                            />
                            <input
                                className={classes.number__input}
                                type={"number"}
                                onChange={(e) => handleDurationMinutesChange(e, index)}
                            />
                            <input
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