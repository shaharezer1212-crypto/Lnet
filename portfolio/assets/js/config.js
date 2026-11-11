// הגדרות האתר. שדה ריק = הקישור לא מוצג.
window.SITE = {
  linkedinUrl: "https://www.linkedin.com/in/shahar-ezer-1466a0232/",
  email: "Shaharezer1212@gmail.com",
  intro: true // false מבטל את פתיח הלומדה
};

// הפרויקטים. title: שם הלקוח ושם הפרויקט, בלי תגיות ובלי שנים.
// images: התמונה הראשונה גדולה, השאר בשורה קטנה מתחתיה. רשימה ריקה = ממלא מקום.
// award: שורת פרס (לא חובה). stats: מספרים בולטים (לא חובה).
window.PROJECTS = [
  {
    title: "ZIM - DARE TO AI",
    award: "פרויקט זוכה פרס",
    text: "שלוש לומדות שפיתחתי כחלק מתהליך הטמעת AI ארגוני בצים: כתיבת פרומפטים, שימוש אחראי ב־AI וסוכני AI. במקום עוד הדרכת כלים, בנינו עולם שלם של ים, אוניות ומכולות, שמלווה את העובדים מהסרטון הראשון ועד הלומדה האחרונה.",
    stats: [
      { num: "5,000", label: "עובדים" },
      { num: "35", label: "מדינות" },
      { num: "10,400", label: "הרשמות ללומדות" }
    ],
    images: ["assets/img/projects/zim-1.webp", "assets/img/projects/zim-2.webp", "assets/img/projects/zim-3.webp", "assets/img/projects/zim-4.webp"],
    url: ""
  },
  {
    title: "מכבי - אונבורדינג למנהלים חדשים",
    text: "כניסה לתפקיד ניהולי במכבי היא תהליך טובעני. במקום להוסיף עוד עומס, הפקנו סדרה של 12 סרטונים קצרים עם אנשי מפתח בארגון, על אסטרטגיה, כלכלת בריאות, משאבי אנוש, מדידה, חוויית המטופל ועוד. סרטונים שאפשר גם רק להאזין להם, בדרכים ובין לבין.",
    stats: [
      { num: "12", label: "סרטונים" },
      { num: "2", label: "פורמטים: פרזנטור ואנימציה" }
    ],
    images: ["assets/img/projects/maccabi-1.webp", "assets/img/projects/maccabi-2.webp", "assets/img/projects/maccabi-3.webp", "assets/img/projects/maccabi-4.webp"],
    url: ""
  },
  {
    title: "AppsFlyer - סרטון AI",
    text: "סרטון שנועד לרתום את העובדים לשינוי במודל העבודה עם AI, מהלך שהיה יכול לעורר הרבה התנגדות. בחרנו לא להכריז על שינוי אלא להמליץ על דרך עבודה, והוספנו הרבה הומור. כך הסרטון מקליל את התהליך וגם מסביר מה עומד מאחורי הבחירה.",
    images: ["assets/img/projects/appsflyer-1.webp", "assets/img/projects/appsflyer-2.webp", "assets/img/projects/appsflyer-3.webp", "assets/img/projects/appsflyer-4.webp", "assets/img/projects/appsflyer-5.webp", "assets/img/projects/appsflyer-6.webp", "assets/img/projects/appsflyer-7.webp"],
    url: ""
  },
  {
    title: "monday - משחק קלפים דיגיטלי",
    text: "כלי למנהלים שמשתלב בתהליך המשובים. לחברה היה משחק קלפים מודפס, והמרנו אותו לגרסה דיגיטלית: הוספנו קלפים, חשבנו מחדש על הממשק, ושמרנו על גרסה פשוטה ואינטואיטיבית שכל מטרתה לפתוח שיחה.",
    images: [],
    url: ""
  }
];
