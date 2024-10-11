import React,{useEffect,useState,useContext}from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import { CartContext } from '../contexts/CartContext';
const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(CartContext);
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };
  
      fetchProductDetails();
    }, [id]);
  
    if (!product) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>{product.title}</h2>
        <img src={product.image} alt={product.title} style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Category:</strong> {product.category}</p>
        {/* Add to cart Button */}
        <button onClick={() => addToCart(product)}>Add to Cart</button> 
      </div>
    );
  };

export default ProductDetailsPage
