import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from "../../components/Burger/Burger";
import BurgerControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionType from '../../store/actions';

class BurgerBuilder extends Component{
    
    state = {
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-e0712.firebaseio.com/ingredients.json')
        .then(  response => { 
            this.setState({ ingredients: response.data });
        })
        .catch( error => { this.setState({error: true})});
    }

    updatePurchaseState(ingredients) {
        const sum = Object.values(ingredients)
            .map( val =>  val)
            .reduce( (sum, el) => (sum + el), 0);
            // this.setState({
            //     purchaseable: sum > 0
            // });
            return sum > 0;

    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount  = oldCount + 1;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredient[type] = updatedCount;
    //     const priceAddition = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         ingredients: updatedIngredient,
    //         totalPrice: newPrice
    //     });
    //     this.updatePurchaseState(updatedIngredient);
    // }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        // const queryParams = [];

        // for (let i in this.state.ingredients) {
        //     queryParams.push( encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push('price='+ this.props.totalPrice);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: queryString
        // });

        this.props.history.push('/checkout');
    }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredient[type] = updatedCount;
    //     const priceDeduction = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({
    //         ingredients: updatedIngredient,
    //         totalPrice: newPrice
    //     });
    //     this.updatePurchaseState(updatedIngredient);
    // }

    render() {
        const disabledInfo = { ...this.props.ings };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p> Ingredients cant be loaded  </p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BurgerControls 
                        ingredientAdded={this.props.onIngredientsAdded}
                        ingredientRemoved={this.props.onIngredientsRemoved}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        disabled={disabledInfo}
                        price={this.props.price}
                        ordered={this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary 
            price={this.props.price}
            ingredients={this.props.ings}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
             />;

            if (this.state.loading) {
                orderSummary = <Spinner />
            }
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDisptachToProps = dispatch => {
    return {
        onIngredientsAdded: (ingsType) => dispatch({type: actionType.ADD_INGREDIENTS, ingredientType: ingsType}),
        onIngredientsRemoved: (ingsType) => dispatch({type: actionType.REMOVE_INGREDIENTS, ingredientType: ingsType})
    }
}

export default connect(mapStateToProps, mapDisptachToProps)(withErrorHandler(BurgerBuilder, axios));