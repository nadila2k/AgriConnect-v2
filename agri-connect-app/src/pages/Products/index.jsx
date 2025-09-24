import React from 'react';
import classes from './Products.module.css';
import ProductComponent from '../../components/Product/ProductComponent';

const Products = () => {
  return (
    <section className={classes.products}>
      <div className={classes['product-component']}>
        <ProductComponent />
      </div>
      
    </section>
  );
};

export default Products;
