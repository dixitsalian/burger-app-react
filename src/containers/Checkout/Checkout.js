import React ,  { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    // state = {
    //     ingredients: null,
    //     totalPrice: 0
    // }

    // componentWillMount() {
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for (let params of query.entries()) {
    //         if (params[0] === 'price') {
    //             price = params[1];
    //         } else {
    //             ingredients[params[0]] = +params[1];
    //         }
    //     }
    //     this.setState({ ingredients: ingredients, totalPrice: price });
    // }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        // return (
        //     <div>
        //         <CheckoutSummary 
        //             checkoutCancelled = {this.checkoutCancelledHandler}
        //             checkoutContinued = {this.checkoutContinuedHandler}
        //             ingredients={this.state.ingredients}/>
        //         <Route path={this.props.match.path + '/contact-data'} 
        //                render={(props) => (<ContactData 
        //                                 ingredients={this.state.ingredients}
        //                                 price={this.state.totalPrice}
        //                                 {...props} />
        //                              )} 
        //         />
        //     </div>
        // );
        return (
            <div>
                <CheckoutSummary 
                    checkoutCancelled = {this.checkoutCancelledHandler}
                    checkoutContinued = {this.checkoutContinuedHandler}
                    ingredients={this.props.ings}/>
                <Route path={this.props.match.path + '/contact-data'} 
                       component={ContactData} 
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);