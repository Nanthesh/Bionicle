import React from 'react';
import './styles.css';

// Simulated menu list (normally you would fetch this from a database)
const menu_list = [
  { menu_name: 'Bulb', menu_image: 'https://m.media-amazon.com/images/I/717Yp2t-R9L._SL1500_.jpg' },
  { menu_name: 'Door Bell', menu_image: 'https://img.kwcdn.com/product/open/2024-09-10/1725967404103-c49d0118d92643ee9860ad41d396113a-goods.jpeg?imageView2/2/w/264/q/70/format/webp' },
  { menu_name: 'TV', menu_image: 'https://m.media-amazon.com/images/I/91snjIt0nUL._AC_SX679_.jpg' },
  { menu_name: 'Doors', menu_image: 'https://m.media-amazon.com/images/I/71BLt4LbTIL._AC_UL320_.jpg' },
  { menu_name: 'Camera', menu_image: 'https://m.media-amazon.com/images/I/61NvMBwiPPL._AC_UL320_.jpg' },
  { menu_name: 'Solar', menu_image: 'https://tse1.mm.bing.net/th?id=OIP.Fy5RBdx0GDHM7qntFS03jgHaEK&pid=Api&P=0&h=180' },
  { menu_name: 'Smart Home', menu_image: 'https://tse1.mm.bing.net/th?id=OIP.k4pSDOmXBpdiNV4-HZERgwHaEK&pid=Api&P=0&h=180' },
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
