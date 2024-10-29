// ProductItem.js
import React from 'react';

function ProductItem({ name, description, price, imageUrl }) {
  return (
    <div className="andes-card ui-search-result">
      <div className="ui-search-result__image">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ui-search-result__content">
        <h2 className="ui-search-item__title">{name}</h2>
        <p>{description}</p>
        <div className="ui-search-price">
          <span className="andes-money-amount__currency-symbol">$</span>
          <span className="andes-money-amount__fraction">{price}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
