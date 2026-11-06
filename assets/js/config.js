/* Site settings — the only file you need to edit before launch.
   Leave a value empty ("") and the site falls back to something sensible. */
window.SITE = {
  // Link to the payment / registration form (Grow, Cardcom, Google Form...).
  // Empty → the "register" buttons scroll to the contact form.
  registerUrl: "",

  // Where the contact form sends its data. Works with Formspree
  // (https://formspree.io → new form → paste its URL here) or any endpoint
  // that accepts a JSON POST. Empty → the form opens an email instead.
  contactEndpoint: "",
  contactEmail: "",

  linkedinUrl: "https://www.linkedin.com/",

  // Intro: plays assets/video/intro.mp4 if it exists, otherwise the drawn intro.
  // Shown once per browser session. Set to false to switch it off.
  intro: true,
  introVideo: "assets/video/intro.mp4"
};
