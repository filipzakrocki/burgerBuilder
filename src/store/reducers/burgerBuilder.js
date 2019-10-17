import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  ingredients: null,
  totalPrice: 4,
  totalKcal: 120,
  purchasable: false,
  error: false
};

const INGREDIENT_PRICES = {
  egg: 0.6,
  salad: 0.4,
  cheese: 0.5,
  bacon: 0.7,
  meat: 1.3
};

const INGREDIENT_KCAL = {
  egg: 90,
  salad: 5,
  cheese: 85,
  bacon: 144,
  meat: 195
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      const updatedIngredient = {
        [action.ingredientName]: state.ingredients[action.ingredientName] + 1
      };
      const updatedIngredients = updateObject(
        state.ingredients,
        updatedIngredient
      );
      const updatedState = {
        ingredients: updatedIngredients,
        totalKcal: state.totalKcal + INGREDIENT_KCAL[action.ingredientName],
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        purchasable: initialState.ingredients !== state.ingredients
      };
      return updateObject(state, updatedState);

    case actionTypes.REMOVE_INGREDIENT:
      const updatedIngredientRemove = {
        [action.ingredientName]: state.ingredients[action.ingredientName] - 1
      };
      const updatedIngredientsRemove = updateObject(
        state.ingredients,
        updatedIngredientRemove
      );
      const updatedStateRemove = {
        ingredients: updatedIngredientsRemove,
        totalKcal: state.totalKcal - INGREDIENT_KCAL[action.ingredientName],
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        purchasable: initialState.ingredients === state.ingredients
      };

      return updateObject(state, updatedStateRemove);

    case actionTypes.SET_INGREDIENTS:
      return {
        ...state,
        ingredients: {
          salad: action.ingredients.salad,
          bacon: action.ingredients.bacon,
          egg: action.ingredients.egg,
          cheese: action.ingredients.cheese,
          meat: action.ingredients.meat
        },
        error: false,
        totalPrice: initialState.totalPrice,
        totalKcal: initialState.totalKcal
      };
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
};

export default reducer;
