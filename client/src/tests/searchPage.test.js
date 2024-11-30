// client/src/pages/main/SearchPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchPage from '../pages/main/searchPage';

// Mock components used in SearchPage
jest.mock('../pages/components/navbar', () => ({ handleLogout }) => (
  <div>
    Navbar
    <button onClick={handleLogout}>Logout</button>
  </div>
));
jest.mock('../pages/components/leftSidebar', () => ({ onCountryChange }) => (
  <div>
    LeftSidebar
    <button onClick={() => onCountryChange('USA')}>Change Country</button>
  </div>
));
jest.mock('../pages/components/rightSidebar', () => ({ isSidebarOpen, onFiltersChange, handleSortChange }) => (
  <div>
    RightSidebar
    <button onClick={() => onFiltersChange({ year: 2021 })}>Change Filters</button>
    <button onClick={() => handleSortChange('asc')}>Change Sort</button>
  </div>
));
jest.mock('../pages/list/listSearch', () => ({ filterCountry, searchQuery, filterMovie, SortFilm }) => (
  <div>
    ListSearch
    <div>Country: {filterCountry}</div>
    <div>Query: {searchQuery}</div>
    <div>Filters: {JSON.stringify(filterMovie)}</div>
    <div>Sort: {SortFilm}</div>
  </div>
));

describe('SearchPage Component', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders the SearchPage with query', () => {
    renderWithRouter(<SearchPage isAuthenticated={true} handleLogout={jest.fn()} />, { route: '/?query=test' });
  
    expect(screen.getByText(/Navbar/i)).toBeInTheDocument();
    expect(screen.getByText(/LeftSidebar/i)).toBeInTheDocument();
    expect(screen.getByText(/RightSidebar/i)).toBeInTheDocument();
    expect(screen.getByText(/ListSearch/i)).toBeInTheDocument();
    expect(screen.getByText(/Search \/ Tagging With/i)).toBeInTheDocument();
    expect(screen.getAllByText(/test/i).length).toBeGreaterThan(0); 
  });

  test('updates country filter', () => {
    renderWithRouter(<SearchPage isAuthenticated={true} handleLogout={jest.fn()} />, { route: '/?query=test' });
  
    const changeCountryButton = screen.getByText(/Change Country/i);
    fireEvent.click(changeCountryButton);
  
    expect(screen.getByText(/Country: USA/i)).toBeInTheDocument();
  });

  test('updates filters and sort', () => {
    renderWithRouter(<SearchPage isAuthenticated={true} handleLogout={jest.fn()} />, { route: '/?query=test' });
  
    const changeFiltersButton = screen.getByText(/Change Filters/i);
    fireEvent.click(changeFiltersButton);
  
    const changeSortButton = screen.getByText(/Change Sort/i);
    fireEvent.click(changeSortButton);
  
    expect(screen.getByText(/Filters: {"year":2021}/i)).toBeInTheDocument();
    expect(screen.getByText(/Sort: asc/i)).toBeInTheDocument();
  });

  test('calls handleLogout on logout', () => {
    const mockHandleLogout = jest.fn();
    renderWithRouter(<SearchPage isAuthenticated={true} handleLogout={mockHandleLogout} />, { route: '/?query=test' });
  
    // Simulate logout action
    const logoutButton = screen.getByText(/Logout/i); // Use the updated button
    fireEvent.click(logoutButton);
  
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});