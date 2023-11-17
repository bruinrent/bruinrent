import React from "react";
import { Link } from "react-router-dom";
import "./AddressBlock.css";
import apart1 from "../../assets/apart_1.png";
import { useSpring, useInView, animated } from "@react-spring/web";

const AddressBlock = ({
  className,
  url,
  address,
  bedrooms,
  bathroom,
  imageUrl,
}) => {
  const [ref, inView] = useInView();
  const addressBlockSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: inView ? 1 : 0 },
    config: { mass: 5, tension: 2000, friction: 200, duration: 450 },
  });

  return (
    <animated.div className={className} style={addressBlockSpring} ref={ref}>
      <Link to={url} style={{ textDecoration: "none" }}>
        <img />
        {imageUrl ? (
          <img className="address-block-image" src={imageUrl} alt={address} />
        ) : (
          <img className="address-block-image" src={apart1} alt="Stock Image" />
        )}
        <p className="address-block-apartment">{address}</p>
        <p className="address-block-details">
          {bedrooms} Bed {bathroom} Bath{" "}
        </p>
      </Link>
    </animated.div>
  );
};

export default AddressBlock;
