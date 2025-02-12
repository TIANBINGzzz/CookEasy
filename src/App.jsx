import React, { useState } from 'react';
// import IngredientInput from './IngredientInput';
// import RecipeRecommendation from './RecipeRecommendation';
// import DeepSeekDisplay from './DeepSeekDisplay';
import RecipeRecommendation from './RecipeRecommendation';

const App = () => {
  // const [ingredients, setIngredients] = useState(null);

  // const handleIngredientSubmit = (ingredients) => {
  //   setIngredients(ingredients);
  // };

  return (
    <div className="App">
      <RecipeRecommendation />
      {/* <DeepSeekDisplay /> */}

    </div >

    // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
    //   {ingredients ? (
    //     <RecipeRecommendation ingredients={ingredients} />
    //   ) : (
    //     <IngredientInput onSubmit={handleIngredientSubmit} />
    //   )}
    // </div>
  );
};

export default App;