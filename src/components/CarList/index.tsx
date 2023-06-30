import React, { useEffect, useState } from 'react';
import Car from '../../types/Car';
import { IoIosArrowForward } from 'react-icons/io';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import styles from './styles.module.scss';

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBodyType, setSelectedBodyType] = useState<string>('');
  const [responsiveMode, setResponsiveMode] = useState(false);

  const cardsPerPage = responsiveMode ? 1 : 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cars.json');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setResponsiveMode(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
  }, [selectedBodyType]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedBodyType(event.target.value);
  };

  const getTotalPages = (): number => {
    const filteredCars = selectedBodyType ? cars.filter((car) => car.bodyType === selectedBodyType) : cars;
    return Math.ceil(filteredCars.length / cardsPerPage);
  };

  const getCurrentPageCards = (): Car[] => {
    const filteredCars = selectedBodyType ? cars.filter((car) => car.bodyType === selectedBodyType) : cars;
    const startIndex = (currentPage - 1) * cardsPerPage;
    return filteredCars.slice(startIndex, startIndex + cardsPerPage);
  };

  const handleNextPage = (): void => {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boxFilter}>
        <label>Filtro</label>
        <select name="Filtros" id="filter" value={selectedBodyType} onChange={handleFilterChange}>
          <option value="">Todos</option>
          <option value="suv">SUV</option>
          <option value="estate">Estate</option>
          <option value="sedan">Sedan</option>
        </select>
      </div>
      <div className={styles.content}>
        {getCurrentPageCards().map((car) => (
          <div key={car.id} className={styles.card}>
            <p id={styles.bodyType}>{car.bodyType}</p>
            <p id={styles.modelName}>{car.modelName}</p>
            <p id={styles.modelType}>{car.modelType}</p>
            <img src={car.imageUrl} alt={car.modelName} />
            <div className={styles.cardFooter}>
              <a href="#">LEARN <IoIosArrowForward size={17} /></a>
              <a href="#">SHOP <IoIosArrowForward size={17} /></a>
            </div>
          </div>
        ))}
      </div>
      {!responsiveMode && (
        <div className={styles.boxButton}>
          <button type="button" className={styles.btn} onClick={handlePreviousPage}>
            <SlArrowLeft size={20} />
          </button>
          <button type="button" className={styles.btn} onClick={handleNextPage}>
            <SlArrowRight size={20} />
          </button>
        </div>
      )}
      {responsiveMode && (
        <div className={styles.pagination}>
          {[...Array(getTotalPages())].map((_, index) => (
            <button
              key={index + 1}
              className={`${styles.dot} ${index + 1 === currentPage ? styles.activeDot : ''}`}
              onClick={() => handlePageChange(index + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
