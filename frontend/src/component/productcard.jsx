import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded shadow">
      <img src={product.gambar} alt={product.nama_alat} className="w-full h-48 object-cover" />
      <h3 className="text-lg font-bold">{product.nama_alat}</h3>
      <p>{product.deskripsi}</p>
      <p className="text-green-600">Rp {product.harga.toLocaleString()}/hari</p>
      <button
        onClick={() => addToCart(product, 1)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Tambah ke Keranjang
      </button>
      <Link to={`/products/${product.id}`} className="block mt-2 text-blue-600">Lihat Detail</Link>
    </div>
  );
};

export default ProductCard;