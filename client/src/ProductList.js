import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="ui-search-result__content">
              <h2 className="ui-search-item__title">burger</h2>
              <p>just a burger</p>
              <div className="ui-search-price">
                <span className="andes-money-amount__currency-symbol">$</span>
                <span className="andes-money-amount__fraction">100</span>
              </div>
            </div>
      {products.map((product) => (
        <li key={product.id} className="ui-search-layout__item border rounded-lg p-4 shadow-sm">
          <div className="ui-search-result__wrapper">
            <div className="ui-search-result__image mb-4">
              <img
                src={product.photos ? product.photos : require('./other/template.jpg')}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="ui-search-result__content">
              <h2 className="ui-search-item__title text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="ui-search-price text-xl font-bold mb-2">
                <span className="andes-money-amount__currency-symbol mr-1">$</span>
                <span className="andes-money-amount__fraction">{product.price}</span>
              </div>
              {product.discount && (
                <div className="text-sm text-green-600 mb-2">{product.discount}% OFF</div>
              )}
              <div className="text-sm text-green-700 font-semibold mb-2">Envío gratis</div>
              {product.rating && (
                <div className="flex items-center text-yellow-500 mb-2">
                  {[...Array(Math.round(product.rating))].map((_, index) => (
                    <svg key={index} className="w-4 h-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.56-.955L10 0l2.952 5.955 6.56.955-4.756 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">({product.reviewsCount})</span>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
