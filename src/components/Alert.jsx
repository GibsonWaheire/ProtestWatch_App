// this is just a placeholder for now 


function Alert({ message, onClose }) {
  return (
    <div className="relative bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow flex items-start">
      <strong className="font-bold mr-2">Alert: </strong>
      <span className="block sm:inline flex-1">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold focus:outline-none"
        aria-label="Close alert"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default Alert;
  