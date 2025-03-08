import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContext"; // Make sure the path is correct

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useApp(); // Use useApp instead of useAppContext
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:3100/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Ürün detayları alınırken hata oluştu:", error));
    }, [id]);

    if (!product) return <div>Loading...</div>;

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert("Lütfen renk ve beden seçiniz");
            return;
        }
        addToCart({ ...product, color: selectedColor, size: selectedSize, quantity });
    };

    return (
        <div className="p-6">
            <img src={product.image} alt={product.name} className="w-1/2 h-96 object-cover" />
            <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600">{product.price} TL</p>
            <div className="mt-4">
                <label className="block font-semibold">Renk Seç:</label>
                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="border p-2 w-40">
                    <option value="">Seçiniz</option>
                    {product.colors?.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
            </div>
            <div className="mt-4">
                <label className="block font-semibold">Beden Seç:</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="border p-2 w-40">
                    <option value="">Seçiniz</option>
                    {product.sizes?.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <div className="mt-4">
                <label className="block font-semibold">Adet:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border p-2 w-20" min="1" />
            </div>
            <button onClick={handleAddToCart} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md">Sepete Ekle</button>
        </div>
    );
};

export default ProductDetail;
