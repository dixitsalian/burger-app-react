import * as actionType from './actions';

const initialState = {
    ingredients: {
        salad: 0,
        cheese: 0,
        paneer: 0,
        patty: 0
    },
    totalPrice: 4
}

const INGREDIENTS_PRICES = {
    salad: 0.5,
    paneer: 0.4,
    patty: 1.4,
    cheese: 0.6  
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionType.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientType]: state.ingredients[action.ingredientType] + 1  
                },
                totalPrice: INGREDIENTS_PRICES[action.ingredientType] + state.totalPrice

            }
        case actionType.REMOVE_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientType]: state.ingredients[action.ingredientType] -1
                },
                totalPrice: INGREDIENTS_PRICES[action.ingredientType] + state.totalPrice
            }
    }

    return state;

}

export default reducer;