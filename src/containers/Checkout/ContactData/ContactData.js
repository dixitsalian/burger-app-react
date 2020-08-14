import React, { Component } from 'react';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class InputConfig {
    constructor(elementType, type, placeholder, validation){
        this.elementType = elementType;
        this.elementConfig = {
            type: type,
            placeholder: placeholder
        };
        this.value = '';
        this.validation = validation;
        this.valid = false;
    }
}

class ContactData extends Component {

    state = {
        orderForm: {
                name: new InputConfig('input', 'text', 'Your Name',{ required: true}),
                street: new InputConfig('input', 'text', 'Street',{ required: true}),
                zipcode: new InputConfig('input', 'text', 'Postal Code',{ required: true, minLength: 5, maxLength:5}),
                country: new InputConfig('input', 'text', 'Your Country',{ required: true}),
                email: new InputConfig('input', 'email', 'Your Email',{ required: true}),
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig:{
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]},
                    value: ''
                }
        },
        loading: false
    }

    
    checkValidity(value, rules) {
        let isValid = false;
        if (rules.required) {
            isValid = value.trim() !== '';
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength;
        }

        if (rules.maxLength) {
            isValid = value.length >= rules.maxLength;
        }

        return isValid;
    }

    orderHandler = (events) => {
        events.preventDefault();

        const formData = {};
        for (let formElementModifier in this.state.orderForm) {
            formData[formElementModifier] = this.state.orderForm[formElementModifier].value;
        }

        this.setState({loading: true});
                const order = {
                    ingredients: this.props.ingredients,
                    price: this.props.price,
                    orderData: formData
                }
                axios.post('/orders.json', order)
                .then( (response) => {
                    this.setState({loading: false});
                    this.props.history.push('/');
                })
                .catch( (error) => {
                    this.setState({loading: false});
                });
    }

    inputChangeHandler = (event, inputIndentifier) => {
        const updatedOrderForm = {...this.state.orderForm};
        const udatedOrderFormElement = {...updatedOrderForm[inputIndentifier]};
        udatedOrderFormElement.value = event.target.value; 
        udatedOrderFormElement.valid = this.checkValidity(udatedOrderFormElement.value,udatedOrderFormElement.validation)
        updatedOrderForm[inputIndentifier] = udatedOrderFormElement;

        this.setState({orderForm: updatedOrderForm});
    }

    render() {
        const formElementsArray =[];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (                
        <form onSubmit={this.orderHandler}>
            {
                formElementsArray.map( (formElement) => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangeHandler(event, formElement.id)}
                        />
                ))
            }
            <Button  btnType="Success">ORDER</Button>
        </form>);

        if( this.state.loading ) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4> Enter your contact details : </h4>
                {form}
            </div>
        );
    }
}

export default ContactData;