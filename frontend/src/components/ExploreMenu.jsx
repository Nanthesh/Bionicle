import React from 'react';
import './styles.css';

// Simulated menu list (normally you would fetch this from a database)
const menu_list = [
  { menu_name: 'Bulb', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
  { menu_name: 'Door Bell', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
  { menu_name: 'TV', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
  { menu_name: 'Doors', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
  { menu_name: 'Bulba', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
];

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
        Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </p>

      <div className='explore-menu-list'>
        {menu_list.map((item, index) => (
          <div
            onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
            key={index}
            className='explore-menu-list-item'
          >
            <img
              className={category === item.menu_name ? 'active' : ''}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
