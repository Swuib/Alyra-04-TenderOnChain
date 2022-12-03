import './Loader.css';

const Loader = ({size}) => {
    return (
        <>
            {size === "mini" ?(
                <div clasName="spinner-mini"></div>
            ) : size === "small" ?(
                <div className="spinner-small"></div>
            ) : size === "medium" ?(
                <div className="spinner-medium"></div>
            ) : size === "large" ?(
                <div className="spinner"></div>
            ) : (
                ""
            )}
        </>
    );
};

export default Loader;
