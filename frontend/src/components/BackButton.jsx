import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); 
    };

    return (
        <button
            onClick={handleBackClick}
            className="m-10 fixed top-35 left-10 p-3 bg-orange-500 text-white rounded-full 
                shadow-lg hover:bg-orange-600 transition-all duration-300 ease-in-out z-[100]"
            title="Go back"
        >
            <FaArrowLeft className="text-2xl" />
        </button>
    );
};

export default BackButton;
