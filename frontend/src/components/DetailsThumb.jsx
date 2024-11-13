import React, { Component } from 'react';

export class DetailsThumb extends Component {
  render() {
    const { images, tab, myRef } = this.props;
    if (!images || images.length === 0) {
      return <p>No images available</p>;
    }
    return (
      <div style={styles.thumb} ref={myRef}>
        {/* {images.map((img, index) => (
          <img
            src={img}
            alt="Product Thumbnail"
            key={index}
            onClick={() => tab(index)} // Update large image on click
            style={styles.thumbnail}
          />
        ))} */}
        <img
          src={images} // Display the provided image or fallback image if none
          alt="Product Thumbnail"
          onClick={() => tab(0)} // Assume index 0 for a single image
          style={styles.thumbnail}
        />
      </div>
    );
  }
}

const styles = {
  thumb: {
    display: 'flex',
    marginTop: '10px'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    marginRight: '10px',
    cursor: 'pointer'
  },
  active: {
    border: '2px solid #ff7f50'
  }
};

export default DetailsThumb;
