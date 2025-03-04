"use client";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
  return (
    <div className="loaderbar">
      <ClipLoader loading={true} />
    </div>
  );
};

export default Loader;
