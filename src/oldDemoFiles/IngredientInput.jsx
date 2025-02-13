import React, { useState } from 'react';
import { Input, Button, List, Tag, Space, Typography, Card } from 'antd';

// 模拟数据库中的食材列表
const allIngredients = [
    '鸡翅', '辣椒', '大蒜', '大葱', '酱油', '盐', '糖', '牛肉', '番茄酱', '胡萝卜', '土豆', '洋葱', '西红柿'
];

const IngredientInput = ({ onSubmit }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // 处理输入变化，显示匹配的食材建议
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = allIngredients.filter(ingredient =>
            ingredient.includes(value)
        );
        setSuggestions(filteredSuggestions);
    };

    // 选择食材
    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
        setInputValue('');
        setSuggestions([]);
    };

    // 移除已选择的食材
    const handleRemoveIngredient = (ingredient) => {
        setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    };

    // 提交选择的食材
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(selectedIngredients);
    };

    return (
        <Card title="输入你拥有的食材" style={{ width: 400, margin: 'auto', marginTop: 50 }}>
            <form onSubmit={handleSubmit}>
                <Input.Search
                    placeholder="例如：鸡翅"
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSubmit}
                    style={{ marginBottom: 20 }}
                />
                {suggestions.length > 0 && (
                    <List
                        dataSource={suggestions}
                        renderItem={(suggestion) => (
                            <List.Item>
                                <Button type="link" onClick={() => handleSelectIngredient(suggestion)}>
                                    {suggestion}
                                </Button>
                            </List.Item>
                        )}
                    />
                )}
                <Space wrap style={{ marginBottom: 20 }}>
                    {selectedIngredients.map((ingredient, index) => (
                        <Tag key={index} closable onClose={() => handleRemoveIngredient(ingredient)}>
                            {ingredient}
                        </Tag>
                    ))}
                </Space>
                <Button type="primary" htmlType="submit" block>
                    提交
                </Button>
            </form>
        </Card>
    );
};

export default IngredientInput;