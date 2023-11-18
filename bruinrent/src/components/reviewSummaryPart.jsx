import "./reviewSummaryPart.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo_white.png";
import { Tooltip } from 'react-tooltip'


const ReviewSumPart = ({rating, label, tooltip}) => {
  return (
    <div className="review-num-word">
    <div className="circle">
    <div className="review-num">{rating}</div>  
    </div>
    <div className="review-word">{label}</div>
    <p className ="info-circle" data-tooltip-id={label} data-tooltip-content={tooltip}>
    i
    </p>
    <Tooltip 
    id={label}
    style={{ backgroundColor: "#D2EDF9", color: "#222", zIndex:"999", opacity: "0.8"}}
    />
</div>
  );
};
export default ReviewSumPart;
