import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className={`search-container ${showSearch ? 'active' : ''}`}>
            <Form onSubmit={handleSearch} className="d-flex">
                <InputGroup>
                    <Form.Control
                        type="search"
                        placeholder="Search pizzas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary search-button"
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </InputGroup>
            </Form>
        </div>
    );
};

export default SearchBar; 