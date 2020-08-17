import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        this.touched = false;
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
                    value: 'fastest',
                    valid: true,
                    validation: {}
                }
        },
        loading: false,
        formIsValid: false
    }

    
    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
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
                    ingredients: this.props.ings,
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
        udatedOrderFormElement.touched = true;
        let formIsValid = true;
        for(let inputIndentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIndentifier].valid && formIsValid;
        }
        updatedOrderForm[inputIndentifier] = udatedOrderFormElement;

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
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
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangeHandler(event, formElement.id)}
                        />
                ))
            }
            <Button  btnType="Success" disable={!this.state.formIsValid}>ORDER</Button>
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);