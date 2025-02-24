import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';

const RecipeCarousel = ({ recipes }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (recipes.length === 3) {
            setActiveIndex(1);
        } else if (recipes.length > 0) {
            setActiveIndex(0);
        }
    }, [recipes]);

    const handleLeft = () => {
        if (recipes.length > 0) {
            setActiveIndex((activeIndex - 1 + recipes.length) % recipes.length);
        }
    };

    const handleRight = () => {
        if (recipes.length > 0) {
            setActiveIndex((activeIndex + 1) % recipes.length);
        }
    };

    const getCardStyle = (position) => {
        switch (position) {
            case 'active':
                return {
                    transform: 'translateX(0) scale(1) rotateY(0deg)',
                    zIndex: 3,
                    opacity: 1,
                };
            case 'left':
                return {
                    transform: 'translateX(-150px) scale(0.8) rotateY(15deg)',
                    zIndex: 2,
                    opacity: 0.8,
                };
            case 'right':
                return {
                    transform: 'translateX(150px) scale(0.8) rotateY(-15deg)',
                    zIndex: 2,
                    opacity: 0.8,
                };
            default:
                return {};
        }
    };

    const leftIndex = (activeIndex - 1 + recipes.length) % recipes.length;
    const rightIndex = (activeIndex + 1) % recipes.length;

    return (
        <div className="carousel">
            <button className="arrow left" onClick={handleLeft}>◀</button>
            <div className="cards-container">
                <RecipeCard
                    recipe={recipes[leftIndex]}
                    style={getCardStyle('left')}
                />
                <RecipeCard
                    recipe={recipes[activeIndex]}
                    style={getCardStyle('active')}
                />
                <RecipeCard
                    recipe={recipes[rightIndex]}
                    style={getCardStyle('right')}
                />
            </div>
            <button className="arrow right" onClick={handleRight}>▶</button>
        </div>
    );
};

export default RecipeCarousel; 