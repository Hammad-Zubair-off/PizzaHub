import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import './SearchBar.css';

const SearchBar = ({ onSearch, suggestions = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const searchRef = useRef(null);

    // Filter suggestions based on search query - ONLY by name
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = suggestions.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, suggestions]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Trigger search when query changes
    useEffect(() => {
        onSearch(searchQuery);
    }, [searchQuery, onSearch]);

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        setShowSuggestions(false);
    };

    return (
        <div className="search-container" ref={searchRef}>
            <Form className="d-flex">
                <InputGroup>
                    <Form.Control
                        type="search"
                        placeholder="Search by pizza name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        autoComplete="off"
                    />
                    <button 
                        type="button" 
                        className="btn btn-primary search-button"
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </InputGroup>
            </Form>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
                <ListGroup className="suggestions-dropdown">
                    {filteredSuggestions.map((item, index) => (
                        <ListGroup.Item 
                            key={index} 
                            action 
                            onClick={() => handleSuggestionClick(item)}
                            className="suggestion-item"
                        >
                            <div className="d-flex align-items-center">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="suggestion-image me-2"
                                />
                                <div>
                                    <div className="suggestion-name">{item.name}</div>
                                    <div className="suggestion-price">
                                        From Rs. {Math.min(...item.prices.map(p => p.price))}
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default SearchBar; 