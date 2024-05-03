import classes from "./styles.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader} from "../../functions";
import InputTextArea from "../InputTextArea";

const Steps = ({steps, onChange}) => {

    return (
        <div>
            {steps.map((step) => (
                <InputTextArea
                    name={"description"}
                    value={step.description}
                    placeholder={"Описание"}
                    required={true}
                    onChange={onChange}
                />
            ))}
        </div>

    );
};

export default Steps