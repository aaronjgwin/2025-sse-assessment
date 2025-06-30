import { normalize } from "./normalizer.js";

normalize()
  .then(user => {
    console.log("Normalized User:", user);
  })
  .catch(err => {
    console.error("Failed to normalize user:", err);
  });
