// this is just a placeholder for now 


function Alert({ message }) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Alert: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    );
  }
  
  export default Alert;
  