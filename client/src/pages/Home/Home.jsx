import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import sampleData from '../../sampledata'; // Assuming this is used for other sections
import DownArrow from '../../assets/DownArrow.svg';
import SearchIcon from '../../assets/SearchIcon.svg';

function Home({ scrollToSection }) {
  const [allClubs, setAllClubs] = useState([]);
  const [sortingExpanded, setSortingExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const [sortedData, setSortedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClubs, setExpandedClubs] = useState({});

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/club/getallclubs');
        setAllClubs(response.data);
        const initialSortedData = [...response.data].sort((a, b) => a.clubName.localeCompare(b.clubName));
        setSortedData(initialSortedData);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleArrow = () => {
    setSortingExpanded(!sortingExpanded);
  };

  const handleSorting = (option) => {
    let sortedClubs = [...allClubs];
    if (option === 1) {
      sortedClubs.sort((a, b) => a.clubName.localeCompare(b.clubName));
    } else if (option === 2) {
      sortedClubs.sort((a, b) => b.clubName.localeCompare(a.clubName));
    }
    setSortedData(sortedClubs);
    setSelectedOption(option);
    setSortingExpanded(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReadMore = (index) => {
    setExpandedClubs((prevExpandedClubs) => {
      const updatedExpandedClubs = { ...prevExpandedClubs };
      updatedExpandedClubs[index] = !prevExpandedClubs[index];
      return updatedExpandedClubs;
    });
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 30,
          behavior: 'smooth',
        });
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const allExpanded = {};
      sampleData.forEach((_, index) => {
        allExpanded[index] = screenWidth > 600 ? true : false;
      });
      setExpandedClubs(allExpanded);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set initial sorted data
    const initialSortedData = [...allClubs].sort((a, b) => a.clubName.localeCompare(b.clubName));
    setSortedData(initialSortedData);
  }, [allClubs]);

  const searchedClubs = sortedData.filter(club =>
    club.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const followedClubs = sampleData.filter(club => club.followed)
  const recruitingClubs = sampleData.filter(club => club.recruiting)

  return (
    <>

      <section className='hero'>
        <h1 className='hero-text'>Welcome to ClubConnect!</h1>
        <div className='hero-buttons-container'>
          <button className='hero-button' onClick={() => scrollToSection('currently-recruiting')}>Recruitments</button>
          <button className='hero-button middle-button' onClick={() => scrollToSection('explore-clubs')}>Explore Clubs</button>
          <NavLink to='/upcomingevents' className='navlink'><button className='hero-button'>Upcoming Events</button></NavLink>
        </div>
      </section>

      <section id='followed-clubs'>
        <h1 className='section-title'>Clubs you follow</h1>
        <div className='clubs-list'>
          {followedClubs.length > 0 ? (
            followedClubs.map((club, index) => (
              club.followed && <div className='club-card' key={index}>
                {club.recruiting && <div className='recruitment-tag'>Recruiting now</div>}
                <img className='followed-club-logo' src={club.clubLogo} alt={`${club.clubName} logo`} />
                <h2 className='followed-club-name'>{club.clubName}</h2>
                {club.upcomingEvent && <div className='event-tag'>Upcoming Event</div>}
              </div>
            ))) : (
            <div className='club-card'>
              <p>Looks like you don't follow any clubs!</p>
              <button className='more-information-button' onClick={() => scrollToSection('explore-clubs')}>Find clubs you like</button>
            </div>
          )
          }
        </div>
      </section>

      <section id='currently-recruiting'>
        <h1 className='section-title'>Currently recruiting</h1>
        <div className='clubs-list'>
          {recruitingClubs.length > 0 ? (
            recruitingClubs.map((club, index) => (
              <div className='club-card' key={index}>
                <img className='followed-club-logo' src={club.clubLogo} alt={`${club.clubName} logo`} />
                <h2 className='followed-club-name'>{club.clubName}</h2>
                <hr className='card-divider' />
                <h3 style={{ margin: 0, fontWeight: 400 }}>DEADLINE</h3>
                <p className='application-deadline-display'>{club.applicationDeadline}</p>
                <button className='more-information-button'>Know more</button>
              </div>
            ))
          ) : (
            <div className='club-card'>
              <p>No clubs are currently recruiting.</p>
            </div>
          )}
        </div>
      </section>

      <section id='explore-clubs'>
        <h1 className='section-title'>Explore Clubs</h1>
        <div className='sort-clubs'>
          <div className='sort-by'>
            <p>Sort by</p>
            <div className='sorting-component'>
              <button className='sort-button' onClick={toggleArrow}>
                {selectedOption === 1 ? 'Name: A to Z' : 'Name: Z to A'}
                <img src={DownArrow} className={`dropdown-arrow ${sortingExpanded ? 'invert-arrow' : ''}`} alt='Sort Arrow' />
              </button>
              {sortingExpanded && (
                <div className='sorting-options'>
                  <button className={`sorting-option ${selectedOption === 1 ? 'selected-option' : ''}`} onClick={() => handleSorting(1)}>
                    Name: A to Z
                  </button>
                  <button className={`sorting-option ${selectedOption === 2 ? 'selected-option' : ''}`} onClick={() => handleSorting(2)}>
                    Name: Z to A
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='search-component'>
            <input type='text' className='searchbar' placeholder='Search club' value={searchQuery} onChange={handleSearch} />
            <img src={SearchIcon} className='search-icon' alt='Search Icon' />
          </div>
        </div>
        <div className='clubs-list'>
          {searchedClubs.length > 0 ? (
            searchedClubs.map((club, index) => {
              const isExpanded = expandedClubs[index];
              return (
                <div className='club-card' key={index}>
                  <img className='followed-club-logo' src={club.clubLogo} alt={`${club.clubName} logo`} />
                  <h2 className='followed-club-name'>{club.clubName}</h2>
                  <hr className='card-divider' />
                  {club.displayDescription && (
                    <p className='card-display-text'>
                      {isExpanded ? club.displayDescription : club.displayDescription.substring(0, 150)}
                      {(window.innerWidth <= 600 && club.displayDescription && club.displayDescription.length > 150) && (
                        <button className='read-more' onClick={() => handleReadMore(index)}>
                          {expandedClubs[index] ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </p>
                  )}
                  <button className='more-information-button'>View club page</button>
                </div>
              );
            })
          ) : (
            <div>
              <p>No matching results found.</p>
            </div>
          )}
        </div>
      </section>

    </>
  );
}

export default Home;