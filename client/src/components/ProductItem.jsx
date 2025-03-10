import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3100/products")
            .then(response => {
                console.log("API Yanıtı:", response.data);
                setProducts(response.data.data.data);
            })
            .catch(error => console.error("Ürünleri çekerken hata oluştu:", error));
    }, []);

    return (
        <div>
            {Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {products.map(product => (
                        <div key={product.id} className="border p-4 rounded-lg shadow-lg cursor-pointer"
                             onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                            <p className="text-gray-600">{product.price} TL</p>
                            <p className="text-sm text-gray-500">Marka: {product.brand?.name || "Bilinmiyor"}</p>
                        </div>
                    ))}

                </div>
            ) : (
                <p className="text-center text-gray-500">Ürün bulunamadı.</p>
            )}
        </div>
    );

};

export default ProductList;