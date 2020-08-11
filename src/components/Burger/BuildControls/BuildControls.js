import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label: 'Salad', type: 'salad'},
    {label: 'Paneer', type: 'paneer'},
    {label: 'Patty', type: 'patty'},
    {label: 'Cheese', type: 'cheese'},
];

const buildControls = (props) => (
        <div className={classes.BuildControls}>
            <p>Current Price is: <strong>{props.price.toFixed(2)}</strong></p>
            {
                controls.map( ctrl => (
                     <BuildControl
                     added={() => props.ingredientAdded(ctrl.type)}
                     removed={() => props.ingredientRemoved(ctrl.type)}
                     disabled={props.disabled[ctrl.type]}
                     key={ctrl.label} label={ctrl.label} />
                ))
            }
            <button 
                className={classes.OrderButton}
                disabled={!props.purchaseable}
                onClick={props.ordered}
                >ORDER NOW</button>
        </div>
)


export default buildControls;