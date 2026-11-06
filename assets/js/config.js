/* Site settings — the only file you need to edit before launch.
   Leave a value empty ("") and the site falls back to something sensible. */
window.SITE = {
  // Link to the payment / registration form (Grow, Cardcom, Google Form...).
  // Empty → the "register" buttons scroll to the price block.
  registerUrl: "",

  // Link for "יש שאלות?" (a Google Form, WhatsApp link, Calendly...).
  // Empty → the button stays visible and scrolls to the price block until a link is set.
  questionsUrl: "",

  linkedinUrl: "https://www.linkedin.com/",

  // Intro: plays assets/video/intro.mp4 if it exists, otherwise the drawn intro.
  // Shown once per browser session. Set to false to switch it off.
  intro: true,
  introVideo: "assets/video/intro.mp4"
};
