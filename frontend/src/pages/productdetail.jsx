import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import useCart from '../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/alat/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00AA5B] border-t-transparent" />
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-6">
          <a href="/" className="hover:text-[#00AA5B]">Home</a> &rsaquo;{" "}
          <a href="/products" className="hover:text-[#00AA5B]">Produk</a> &rsaquo;{" "}
          <span className="text-gray-600">{product.nama_alat}</span>
        </p>

        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-2/5">
            <img
              src={product.gambar}
              alt={product.nama_alat}
              className="w-full rounded-xl object-cover aspect-square"
            />
          </div>

          {/* Info */}
          <div className="md:w-3/5 flex flex-col gap-4">
            <span className="inline-block bg-green-100 text-[#00AA5B] text-xs font-bold px-3 py-1 rounded-full w-fit">
              {product.kategori}
            </span>
            <h1 className="text-2xl font-bold text-gray-800">{product.nama_alat}</h1>
            <p className="text-3xl font-extrabold text-[#00AA5B]">
              Rp {product.harga.toLocaleString()}
              <span className="text-base font-normal text-gray-400">/hari</span>
            </p>

            <div className="border-t pt-4">
              <p className="text-gray-600 leading-relaxed text-sm">{product.deskripsi}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`font-semibold ${product.stok > 0 ? 'text-[#00AA5B]' : 'text-red-500'}`}>
                {product.stok > 0 ? `✅ Stok tersedia (${product.stok})` : '❌ Stok habis'}
              </span>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Jumlah:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                >−</button>
                <span className="px-4 py-1.5 text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stok, q + 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => { addToCart(product, qty); alert("Ditambahkan ke keranjang!"); }}
                disabled={product.stok === 0}
                className="flex-1 border-2 border-[#00AA5B] text-[#00AA5B] font-bold py-3 rounded-xl hover:bg-green-50 transition disabled:opacity-40"
              >
                + Keranjang
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stok === 0}
                className="flex-1 bg-[#00AA5B] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-40"
              >
                Sewa Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
