/* global Tally */
import React, { useEffect } from "react";
import Header from "../Header.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../AuthContext.js";
import "./TallyEmbed.css";

const TallyEmbed = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    // Load Tally embeds when the component mounts
    const loadTallyEmbeds = () => {
      if (typeof Tally !== "undefined") {
        Tally.loadEmbeds();
      } else {
        document
          .querySelectorAll("iframe[data-tally-src]:not([src])")
          .forEach((iframe) => {
            iframe.src = iframe.dataset.tallySrc;
          });
      }
    };

    // Check if Tally script is not already loaded, and load it if necessary
    const tallyScriptUrl = "https://tally.so/widgets/embed.js";
    if (!document.querySelector(`script[src="${tallyScriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = tallyScriptUrl;
      script.onload = () => {
        console.log("Tally script loaded.");
        loadTallyEmbeds();
      };
      script.onerror = () => {
        console.error("Error loading Tally script.");
        loadTallyEmbeds();
      };
      document.body.appendChild(script);
    } else {
      // Tally script is already loaded
      console.log("Tally script already loaded.");
      loadTallyEmbeds();
    }
  }, []);

  return (
    <div className="review-page-container">
      <Header />
      {user === null ? (
        <span
          className="leave-review-text"
          style={{
            alignSelf: "center",
            width: "100%",
            display: "inline-block",
          }}
        >
          Complete signing in to leave a review!
        </span>
      ) : (
        <div className="rating-details">
          <text className="leave-review-text">Leave a Review</text>
          {/* Embed the Tally.so widget here */}
          <div
            dangerouslySetInnerHTML={{
              __html: `
                  <iframe 
                      data-tally-src="https://tally.so/embed/3qR52G?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                      loading="lazy" 
                      style="width: 100%; height: 100vh; border: 0;"
                      title="Leave a Review"
                  ></iframe>
                `,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TallyEmbed;
