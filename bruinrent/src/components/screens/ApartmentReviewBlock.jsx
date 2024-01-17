import "./ApartmentReviewBlock.css";

const ApartmentReviewBlock = ({ datePosted, reviewDesc }) => {
  return (
    <div id="apartment-review-block">
      <h3 id="apartment-review-date">{datePosted}</h3>
      <text id="apartment-review-desc">{reviewDesc}</text>
    </div>
  );
};

export default ApartmentReviewBlock;
