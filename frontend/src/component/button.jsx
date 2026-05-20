export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
    >
      {children}
    </button>
  );
}
