import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Space, message } from 'antd';

const recipes = [
    {
        id: 1,
        title: '香辣鸡翅',
        description: '这是一道经典的香辣鸡翅食谱，适合家庭聚餐。',
        ingredients: ['鸡翅', '辣椒', '大蒜', '酱油', '盐', '糖'],
        instructions: '1. 将鸡翅洗净，切成小块。2. 加入辣椒、大蒜、酱油、盐和糖，腌制30分钟。3. 热锅凉油，煎至金黄色。4. 加入适量水，炖煮20分钟。'
    },
    {
        id: 2,
        title: '红烧牛肉',
        description: '这是一道美味的红烧牛肉食谱，适合朋友聚会。',
        ingredients: ['牛肉', '番茄酱', '大蒜', '酱油', '盐', '糖'],
        instructions: '1. 将牛肉洗净，切成小块。2. 加入番茄酱、大蒜、酱油、盐和糖，腌制30分钟。3. 热锅凉油，煎至金黄色。4. 加入适量水，炖煮30分钟。'
    }
];

const RecipeRecommendation = ({ ingredients }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const filteredRecipes = recipes.filter(recipe =>
        recipe.ingredients.some(ingredient => ingredients.includes(ingredient))
    );

    useEffect(() => {
        if (filteredRecipes.length === 0) {
            message.warning('没有找到相关的菜谱。');
        }
    }, [filteredRecipes]);

    useEffect(() => {
        const handleWheel = (event) => {
            if (event.deltaY > 0) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredRecipes.length);
            } else {
                setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredRecipes.length) % filteredRecipes.length);
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [filteredRecipes]);

    const currentRecipe = filteredRecipes[currentIndex];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {filteredRecipes.length > 0 ? (
                <Card title={currentRecipe.title} style={{ width: 600 }}>
                    <Typography.Paragraph>{currentRecipe.description}</Typography.Paragraph>
                    <Space direction="vertical" size="middle" style={{ marginTop: 20 }}>
                        <Typography.Text strong>食材:</Typography.Text>
                        <List
                            dataSource={currentRecipe.ingredients}
                            renderItem={(ingredient) => (
                                <List.Item>{ingredient}</List.Item>
                            )}
                        />
                    </Space>
                    <Space direction="vertical" size="middle" style={{ marginTop: 20 }}>
                        <Typography.Text strong>做法:</Typography.Text>
                        <Typography.Paragraph>{currentRecipe.instructions}</Typography.Paragraph>
                    </Space>
                </Card>
            ) : null}
        </div>
    );
};

export default RecipeRecommendation;