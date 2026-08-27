# lnet-video — כותרת על גבי סרטון

פרויקט [Remotion](https://remotion.dev) שמקבל סרטון ומוסיף עליו כותרת מונפשת.
הכותרת נכתבת בעברית או באנגלית, והכיוון (RTL/LTR) מזוהה אוטומטית לפי הטקסט.

## התקנה

```bash
cd lnet-video
npm install
```

## איך מוסיפים כותרת לסרטון שלכם

1. שימו את קובץ הווידאו בתיקייה `public/` (למשל `public/my-video.mp4`).
2. הריצו את הסטודיו:

   ```bash
   npm run dev
   ```

3. בחלונית **Props** שמימין, שנו את `videoSrc` לשם הקובץ שלכם ואת `title` לכותרת הרצויה.
   אפשר לערוך הכל בזמן אמת ולראות את התוצאה מיד. לחיצה על **Save** מחזירה את הערכים
   ל-`src/Root.tsx`, כך שהם נשמרים גם לרנדור.
4. רנדרו לקובץ mp4:

   ```bash
   npm run render
   ```

   הפלט נשמר ב-`out/video.mp4`.

בפרויקט מגיע קליפ דוגמה (`public/sample.mp4`) כדי שהכול יעבוד מיד אחרי ההתקנה —
אפשר למחוק אותו ברגע שיש לכם סרטון משלכם.

הרזולוציה, קצב הפריימים ואורך הקומפוזיציה **נקראים אוטומטית מהסרטון עצמו**
(ראו `calculateMetadata` ב-`src/Root.tsx`), כך שאין צורך לעדכן אותם ידנית.

## הפרופס הזמינים

| פרופ                  | תיאור                                                                   |
| --------------------- | ----------------------------------------------------------------------- |
| `videoSrc`            | שם קובץ בתוך `public/`, או כתובת URL מלאה לסרטון                        |
| `title`               | הכותרת הראשית                                                           |
| `subtitle`            | כותרת משנה (מחרוזת ריקה = בלי כותרת משנה)                               |
| `position`            | מיקום הכותרת: `top` / `center` / `bottom`                               |
| `direction`           | `auto` (ברירת מחדל, מזהה עברית), `rtl` או `ltr`                         |
| `fontSize`            | גודל הכותרת ביחס לווידאו בגודל 1080p; מותאם אוטומטית לגדלים אחרים       |
| `textColor`           | צבע הטקסט                                                               |
| `accentColor`         | צבע הפס הדקורטיבי לצד הטקסט                                             |
| `backdropOpacity`     | שקיפות הפאנל הכהה מאחורי הטקסט. `0` = בלי פאנל (במקום זה נוסף צל לטקסט) |
| `appearAtInSeconds`   | השנייה שבה הכותרת נכנסת                                                 |
| `visibleForInSeconds` | כמה זמן הכותרת מוצגת. `0` = עד סוף הסרטון                               |

## רנדור עם ערכים אחרים משורת הפקודה

```bash
npx remotion render TitledVideo out/video.mp4 --props='{"videoSrc":"my-video.mp4","title":"שלום","subtitle":"","position":"bottom","direction":"auto","fontSize":84,"textColor":"#ffffff","accentColor":"#38bdf8","backdropOpacity":0.45,"appearAtInSeconds":0.3,"visibleForInSeconds":0}'
```

## מבנה הקוד

- `src/Root.tsx` — רישום הקומפוזיציה + קריאת מטא-דאטה מהסרטון
- `src/TitledVideo.tsx` — הווידאו עם שכבת הכותרת מעליו
- `src/TitleOverlay.tsx` — עיצוב והנפשה של הכותרת
- `src/schema.ts` — סכמת ה-Props (zod) שמייצרת את חלונית העריכה בסטודיו
