import React from 'react';

const RecipeCard = ({ recipe, style }) => {
    const { dishName, ingredients, recipe: instructions } = recipe;

    return (
        <div className="card" style={style}>
            <h4>{dishName}</h4>
            <p><strong>所需食材:</strong> {ingredients.join(', ')}</p>
            <div>
                <strong>做法:</strong>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                    {instructions}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard; 