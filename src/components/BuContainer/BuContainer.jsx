import React from 'react';
import './BuContainer.style.scss'

const BuContainer = (props) => (
  <div className="buContainerCard"  onClick={props.onBUClick}>
     <h2 className="buContainerCardTitle">{props.buTitle}</h2>
  </div>
);

export default BuContainer;