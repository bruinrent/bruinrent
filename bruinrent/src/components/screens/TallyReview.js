import React from "react";
import { Helmet } from "react-helmet";
import Header from "../Header.jsx";

const TalleyReview = () => {
    return (
        <div>
            <Helmet>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                />
                <title>Leave a Review</title>
                <script async src="https://tally.so/widgets/embed.js"></script>
                <style type="text/css">
                    {`
            html { margin: 0; height: 100%; overflow: hidden; }
            body { margin: 0; } /* Reset body margin */
            .header {
                position: relative; /* Ensure the header is positioned relative to the body */
                z-index: 6; /* Set z-index to appear above other elements */
            }
            .review-iframe {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border: 0;
                z-index: 1; /* Set z-index lower than the header to appear below it */
            }
          `}
                </style>
            </Helmet>
            <div>
                <Header className="header" />
                <iframe
                    className="review-iframe"
                    data-tally-src="https://tally.so/r/3qR52G?transparentBackground=1"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    title="Leave a Review"
                ></iframe>
            </div>
        </div>
    );
};

export default TalleyReview;
