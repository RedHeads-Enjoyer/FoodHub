import React from 'react';
import classes from "./styles.module.css";

const ImageTextPair = ({image, text}) => {
      return (
          <div>
              <img src={image}/>
              <p>{text}</p>
          </div>
    );
};

export default ImageTextPair