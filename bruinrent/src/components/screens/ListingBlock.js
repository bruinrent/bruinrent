import React from "react";
import { Link } from "react-router-dom";
import "./ListingBlock.css";
import apart1 from "../../assets/apart_1.png";
import { FaWalking } from "react-icons/fa/index.esm.js";
import { MdOutlinePhoneIphone } from "react-icons/md/index.esm.js";
import { useSpring, useInView, animated } from "@react-spring/web";

const ListingBlock = ({
  className,
  url,
  address,
  bedrooms,
  bathroom,
  rent1,
  rent2,
  imageUrl,
  phone,
}) => {
  const [ref, inView] = useInView();
  const listingBlockSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: inView ? 1 : 0 },
    config: { mass: 5, tension: 2000, friction: 200, duration: 450 },
  });

  return (
    <animated.div className={className} style={listingBlockSpring} ref={ref}>
      <Link
        to={url}
        style={{ textDecoration: "none" }}
        className="listing-block-container"
      >
        {imageUrl ? (
          <img className="listing-block-image" src={imageUrl} alt={address} />
        ) : (
          <img className="listing-block-image" src={apart1} alt="Stock Image" />
        )}
        <div className="listing-block-info">
          <div className="listing-block-details">
            {rent1 && rent2 ? (
              <text id="listing-block-info-rent">
                ${rent1} - {rent2}/mo
              </text>
            ) : (
              <text id="listing-block-info-rent">${rent1}/mo</text>
            )}

            <text>{bedrooms} Beds</text>
            <text>
              <FaWalking />
              10 min to Bruin Plaza
            </text>
          </div>
          <hr className="listing-block-info-break" />
          <div className="listing-block-details">
            {/* <text>The Atrium</text> */}
            <text id="listing-block-details-address">{address}</text>
            <div className="listing-block-details-review">
              <text id="listing-block-details-phone">
                <MdOutlinePhoneIphone />
                {phone}
              </text>
              {/* <div>
                <div className="listing-block-details-rating">
                  <text>0.0</text>
                </div>
                <text id="listing-block-details-num-rating">0 Reviews</text>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    </animated.div>
  );
};

export default ListingBlock;
