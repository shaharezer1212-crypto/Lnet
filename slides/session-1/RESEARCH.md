# מחקר רקע – "Claude, השותף החדש שלך" (מפגש 1)

**Verified on:** 2026-11-07 (כל העובדות נבדקו מול עמודים רשמיים של Anthropic בתאריך זה; מוצרים ומחירים משתנים לעיתים קרובות, יש לבדוק שוב לפני ההרצאה).

הערה: הכתובת docs.claude.com מפנה (302) ל-platform.claude.com, שהוא אתר התיעוד הרשמי הנוכחי של Anthropic למפתחים.

---

## 1. מה זה Claude ומי עומד מאחוריו

- Claude הוא משפחה של מודלי שפה גדולים (LLMs) מתקדמים שפותחו על ידי Anthropic. (https://platform.claude.com/docs/en/about-claude/models/overview)
- הסלוגן הרשמי של המוצר: "AI assistant for life and work". (https://platform.claude.com/docs/en/about-claude/glossary)
- דף המוצר מציג את Claude כשותף עבודה ולא כצ'טבוט: "Hand Claude a task, not just a question". (https://claude.com/product/overview)
- מרכז העזרה מתאר את Claude כ-"a helpful, honest, and harmless assistant with a conversational tone"; השימוש מגיל 18 ובמדינות נתמכות. (https://support.claude.com/en/articles/8114491-get-started-with-claude)
- HHH (helpful, honest, harmless) היא מסגרת המחקר שמנחה את אימון Claude. (https://platform.claude.com/docs/en/about-claude/glossary)
- המשימה של Anthropic: "the responsible development and maintenance of advanced AI for the long-term benefit of humanity". (https://www.anthropic.com/company)
- גישת הבטיחות: "We aim to build frontier AI systems that are reliable, interpretable, and steerable." Anthropic היא public benefit corporation. (https://www.anthropic.com/company)
- טיפ רשמי לשימוש ראשון: "speak to Claude like you would a coworker or friend"; להתחיל פשוט, להיות ספציפיים, לשפר בסבבים. (https://support.claude.com/en/articles/8114491-get-started-with-claude)

## 2. משפחת המודלים הנוכחית

- ארבעה מודלים נוכחיים: **Claude Fable 5.1**, **Claude Opus 5.5**, **Claude Sonnet 5.5**, **Claude Haiku 5.5**. (https://platform.claude.com/docs/en/about-claude/models/overview)
- **Fable 5.1** – "For demanding reasoning and long-horizon agentic work"; האיטי ביותר והיקר ביותר. (שם)
- **Opus 5.5** – "For long-running agentic coding and knowledge work"; ההמלצה הרשמית: אם לא בטוחים, להתחיל עם Opus 5.5 לרוב המשימות. (שם)
- **Sonnet 5.5** – "The best combination of speed and intelligence". (שם)
- **Haiku 5.5** – המהיר ביותר, למשימות בנפח גבוה כמו סיווג, חילוץ וניתוב. (שם)
- לכל המודלים הנוכחיים: חלון הקשר של 1M tokens, פלט מרבי 128K tokens, קלט טקסט ותמונה, רב-לשוניות, ראייה ושימוש בכלים. (שם)
- מודלים ותיקים (legacy) שעדיין זמינים: Fable 5, Opus 5, Opus 4.8/4.7/4.6/4.5, Sonnet 5, Sonnet 4.6, Haiku 4.5. (שם)
- **Thinking** ב-API: כל המודלים הנוכחיים משתמשים ב-Adaptive thinking (המודל מחליט כמה לחשוב, בהכוונת effort). "Extended thinking" הידני (budget_tokens) אינו נתמך עוד במודלים החדשים. (שם)
- ב-claude.ai: מחליפים מודל בלחיצה על שם המודל ליד כפתור השליחה; השינוי חל מהתשובה הבאה. (https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- רמות **Effort** ב-claude.ai: Low, Medium, High, Extra high, Max. "Higher effort means more thorough responses, but they take longer and use more tokens." (שם)
- **Thinking** הוא הגדרה נפרדת מ-effort (מציג חלק "Thinking" מתקפל); ב-Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5.1 ו-Opus 5 אי אפשר לכבות thinking – מווסתים דרך effort. (שם)
- המלצה רשמית: למשימות יומיומיות ברירת המחדל מספיקה; למשימות מורכבות (תכנון פרויקט, ניתוח מסמכים) להעלות effort ו/או להפעיל thinking. (שם)

## 3. Tokens, חלון הקשר ומגבלות שימוש

### Token וחלון הקשר
- הגדרה רשמית: Tokens הם "the smallest individual units of a language model" – מילים, חלקי מילים, תווים או בייטים; מספר התווים לטוקן תלוי במודל ובשפה. (https://platform.claude.com/docs/en/about-claude/glossary)
- מודלי Claude 4.7 ואילך משתמשים ב-tokenizer חדש שמפיק כ-30% יותר טוקנים לאותו טקסט. (שם)
- Context window מוגדר כ"working memory" של המודל – כמות הטקסט שהוא יכול להסתכל עליה בעת יצירת תשובה, בשונה מנתוני האימון. (שם)
- המחשה רשמית: 1M tokens הם בערך 555 אלף מילים באנגלית; 200K tokens ≈ 150 אלף מילים. (https://platform.claude.com/docs/en/about-claude/models/overview)
- המחשה ממרכז העזרה: 200K tokens מכילים "about 500 pages of text or more". (https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
- חלון ההקשר ב-chat בתוכניות בתשלום: 1M tokens ל-Fable 5.1, Opus 5.5, Opus 5, Sonnet 5.5, Sonnet 5, Haiku 5.5; ‏500K ל-Fable 5, Opus 4.8/4.7/4.6, Sonnet 4.6; ‏200K לשאר. (שם)
- ב-Claude Code רוב המודלים מקבלים 1M; ב-Cowork הערכים משתנים לפי מודל (למשל Haiku 5.5 ‏500K). (שם)
- חלק מחלון ההקשר שמור תמיד לתשובה של Claude, ולכן השיחה המרבית קצרה מעט מהחלון המלא. (https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)

### איך עובדות מגבלות השימוש
- שני מושגים נפרדים: **Usage limits** (כמה אפשר להשתמש לאורך זמן) ו-**Length limits** (כמה שיחה אחת יכולה להכיל = חלון ההקשר). (https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
- מגבלת session של 5 שעות: מתחילה בהודעה הראשונה ומתאפסת במלואה חמש שעות אחר כך; בנוסף יש מגבלות שבועיות על כל המודלים (ובחלק מהתוכניות מגבלה שבועית נפרדת ל-Fable). (שם)
- השימוש ב-claude.ai, Claude Code ו-Claude Desktop נמשך מאותה מכסה. (שם)
- גורמים שמשפיעים על הצריכה: אורך ההודעה, גודל הקבצים המצורפים, אורך השיחה הנוכחית, שימוש בכלים (Research, web search), בחירת המודל, רמת effort, יצירת Artifacts ומשימות רב-שלביות. (https://support.claude.com/en/articles/9797557-usage-limit-best-practices)
- "Tools and connectors are token-intensive." (https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
- ניהול הקשר אוטומטי (כשהרצת קוד מופעלת): כשהשיחה מתקרבת לגבול, Claude מסכם הודעות קודמות – אבל "Longer conversations that trigger automatic context management consume more of your usage limit." (שם)
- תוכן ב-Projects נשמר ב-cache ונספר פחות כשמשתמשים בו שוב; ה-cache פג אחרי חוסר פעילות. (https://support.claude.com/en/articles/9797557-usage-limit-best-practices)
- מעקב אחרי הצריכה: Settings > Usage. (שם)

### טיפים רשמיים להארכת השימוש
- לפתוח שיחה חדשה כשהשיחה ארוכה, במיוחד ליד המגבלה. (https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
- לתכנן לפני שמתחילים, להיות ספציפיים ולתת הקשר מראש, ולאחד שאלות קשורות בהודעה אחת. (https://support.claude.com/en/articles/9797557-usage-limit-best-practices)
- לבדוק את הפרומפט לפני שליחה ולשלוח את כל החומר בבת אחת (למשל את הטקסט המלא לעריכה). (שם)
- להשתמש ב-Projects למסמכים שחוזרים עליהם. (שם)
- לשמור על project instructions קצרות ולהסיר קבצי פרויקט שאינם בשימוש. (https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
- לכבות connectors ו-web search כשלא צריך, ולבחור effort נמוך יותר ("Higher effort uses more tokens"). (שם)

## 4. משטחי המוצר ב-claude.ai

### Chat ו-Claude Cowork (חוויה מאוחדת)
- **Claude Cowork** מביא את היכולות האגנטיות של Claude Code ל"knowledge work beyond coding" – בלי טרמינל; מתארים תוצאה, "step away, and come back to finished work". (https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- דוגמאות רשמיות ל-Cowork: סיכום מחקר לדוח, חילוץ action items מתמלילי פגישות, בניית גיליונות, מצגות וגרפים מנתונים, ארגון תיקיית הורדות. (שם)
- חדש: Chat ו-Cowork מאוחדים לשיחה אחת – "no mode to choose"; Claude מחליט אילו כלים להפעיל. מתגלגל בהדרגה ב-Pro, Max, Ultra; ב-Team בבטא; ב-Enterprise לפי הגדרת מנהל. (https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)
- ב-web ובמובייל משימות רצות בענן וממשיכות גם אם סוגרים את הדף; גישה לתיקיות מקומיות, דפדפן ו-computer use דורשים את Claude Desktop. (שם)
- כל הפעילות נספרת במכסת התוכנית; משימות אגנטיות ארוכות צורכות יותר משאלה מהירה. (שם)

### Projects
- Projects הם "self-contained workspaces with their own chat histories and knowledge bases". (https://support.claude.com/en/articles/9517075-what-are-projects)
- **Project knowledge**: מעלים מסמכים, טקסט, קוד וקבצים לבסיס הידע של הפרויקט, ו-Claude משתמש בהם כהקשר בכל שיחות הפרויקט. (שם)
- **Project instructions**: הנחיות לכל פרויקט (למשל טון רשמי או נקודת מבט מקצועית) שחלות על כל השיחות בו. (https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
- הקשר לא עובר בין שיחות בפרויקט, אלא אם הוא נמצא ב-project knowledge. (שם)
- זמין לכל המשתמשים כולל Free (עד 5 פרויקטים ב-Free). שיתוף פרויקטים – רק ב-Team ו-Enterprise. (שם)
- לכל פרויקט זיכרון (memory) משלו; אפשר לנתק אותו מזיכרון החשבון ("Use account memory"). (שם)
- **RAG**: כשה-project knowledge מתקרב לגבול חלון ההקשר, Claude מפעיל אוטומטית RAG mode ומגדיל את הקיבולת "by up to 10x"; רק בתוכניות בתשלום; יש סימון חזותי בממשק. (https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects)
- ב-RAG, Claude שולף רק את מה שרלוונטי לכל שאלה ("project knowledge search tool") במקום לטעון הכול. (שם)

### Artifacts
- Artifact הוא "anything Claude makes for you that you'd put in front of someone" – מסמך, מצגת, עיצוב, דשבורד או כלי אינטראקטיבי קטן, שנפתח לצד השיחה. (https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)
- סוגים: מסמכים, קוד, אתר עמוד יחיד, תמונות, דיאגרמות ותרשימי זרימה, דשבורדים וכלים אינטראקטיביים; תבניות Docs, Slides, Design (כל התוכניות), Dashboards (beta, בתשלום), Motion (beta, Team/Enterprise). (שם)
- Artifacts מתחילים פרטיים; אפשר לשתף או לייצא (Word, PDF, PowerPoint, MP4 לתבניות). הכול נשמר בלשונית Artifacts בסרגל הצד. (שם)
- יצירת Artifacts זמינה בכל התוכניות כולל Free; דורש הפעלת "Cloud code execution and file creation" ב-Capabilities. (שם)

### Research ו-web search
- Research "runs multiple searches that build on each other and decides what to look into next"; יכול להיעזר גם ב-connectors (כמו Google Workspace). (https://support.claude.com/en/articles/11088861-use-research-on-claude)
- הפעלה: כפתור "+" בפינה השמאלית התחתונה > Research; web search חייב להיות מופעל. זמין רק בתוכניות בתשלום. (שם)

### Connectors
- Connectors מחברים את Claude לאפליקציות ושירותים (למשל Google Drive, Slack, Linear), לשליפת מידע ולביצוע פעולות; "Claude inherits each person's permissions from the connected service." (https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)
- הוספה: Customize > Connectors > "+"; או מתוך שיחה דרך "+" > Connectors. Custom connectors (remote MCP) – בכל התוכניות, ב-Free עד אחד. (שם)
- אזהרה רשמית: "Only connect services you trust and need for your workflows." (שם)

### Skills
- "Skills are folders of instructions, scripts, and resources" ש-Claude טוען לפי הצורך כדי לבצע משימות מתמחות בעקביות; זמינים ב-Free, Pro, Max, Ultra, Team, Enterprise ודורשים code execution. (https://support.claude.com/en/articles/12512176-what-are-skills)
- Progressive disclosure: Claude טוען רק את המידע שהמשימה צריכה, כדי לא למלא את חלון ההקשר. (שם)
- סוגים: Anthropic skills (Excel, Word, PowerPoint, PDF), Custom skills, Skills שמופצים על ידי הארגון (Team/Enterprise), Partner skills (Notion, Figma, Atlassian). (שם)
- ההבדל מ-Projects: Projects נותנים ידע רקע שטעון תמיד; Skills נותנים "procedural knowledge" ונטענים רק כשהם רלוונטיים. (שם)
- מבנה: תיקייה עם קובץ skill.md שמתחיל ב-YAML frontmatter עם name (עד 64 תווים) ו-description (עד 200 תווים, "critical" – לפיו Claude מחליט מתי להפעיל). העלאה כ-ZIP דרך Customize > Skills. (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- ב-Claude Code, Skills אורזים workflows חוזרים שהצוות יכול לשתף. (https://code.claude.com/docs/en/overview)

### Memory וחיפוש שיחות
- Memory שומר הקשר משיחות כנושאים (Topics) לשימוש בשיחות הבאות; מופעל כברירת מחדל ב-Free, Pro, Max ו-Ultra. (https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)
- ניהול: Settings > Your Claude > "Manage" ליד "Your memory"; אפשר להשהות, לאפס או לכבות לשיחה בודדת. (שם)
- חיפוש בשיחות קודמות – רק בתוכניות בתשלום. (שם)

## 5. יצירת פרויקט – שלב אחר שלב

1. לפתוח את Projects בסרגל הצד השמאלי, או לגלוש ל-claude.ai/projects. (https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
2. ללחוץ "+ New Project" בפינה הימנית העליונה. (שם)
3. להזין שם ותיאור – Claude לא רואה את הפרטים האלה. (שם)
4. ב-Team/Enterprise: לבחור Private או שיתוף עם הארגון. (שם)
5. להוסיף ידע: בבסיס הידע בצד ימין ללחוץ "+" ולהעלות מסמכים, קבצי טקסט או קוד. (שם)
6. להגדיר הנחיות: "Set project instructions" > לתאר איך Claude צריך להתנהג > "Save instructions". (שם)
7. אפשר להעביר שיחה קיימת לפרויקט דרך התפריט ליד שם השיחה > "Add to project". (שם)

## 6. Claude Code

- "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools." (https://code.claude.com/docs/en/overview)
- רץ ב: Terminal (CLI), תוספים ל-VS Code/Cursor ו-JetBrains, Desktop app (לשונית Code), Web ב-claude.ai/code, ואפליקציית Claude ל-iOS/Android; משתלב גם ב-Slack וב-GitHub Actions. (שם)
- בדף המוצר: "Hand Claude a bug fix, test, or multi-day migration" – קהל היעד המוצהר הוא מפתחים וצוותי פיתוח. (https://claude.com/product/claude-code)
- Desktop app כולל את Claude Code, ואין צורך להתקין CLI בנפרד; דורש מנוי בתשלום. (https://code.claude.com/docs/en/overview)
- למי שלא השתמש בטרמינל קיים מדריך terminal guide רשמי. (שם)
- CLAUDE.md: קובץ שמגדיר הנחיות קבועות ש-Claude Code קורא בתחילת כל session; לפי מרכז העזרה הרצת /init היא "the single highest-value setup step". (https://support.claude.com/en/articles/14552382-your-first-day-in-claude-code)
- Claude מבקש אישור לפני שינוי קבצים או הרצת פקודות. (שם)
- זמינות: Pro, Max, Ultra, Team, Enterprise (לא ב-Free). (https://claude.com/pricing)
- שימושים לא-מפתחים ב-Claude Code עצמו: לא אושר בעמוד רשמי (לעבודת ידע ללא קוד Anthropic מפנה ל-Claude Cowork). (https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)

## 7. Claude in Chrome

- תוסף דפדפן שמאפשר ל-Claude "read, click, and navigate websites alongside you"; אפשר להתחיל משימות מה-side panel של Chrome, מ-Cowork או מ-Claude Code. (https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)
- זמין רק בתוכניות בתשלום: Pro, Max, Ultra, Team, Enterprise. לא ב-Free. (שם; https://claude.com/pricing)
- עובד רק ב-Google Chrome – לא בדפדפני Chromium אחרים ולא במובייל. (https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome)
- יכולות: קריאה, לחיצה, הקלדה, ניווט ומילוי טפסים; עבודה על כמה לשוניות; הקלטת workflow לחזרה; משימות מתוזמנות (יומי עד שנתי). (שם)
- הסיכון המרכזי: prompt injection – הוראות נסתרות בתוכן אתר שמנסות לגרום ל-Claude לפעול נגד רצון המשתמש. "The risk is not zero." (https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely)
- הגנות: שני classifiers (על תוכן נכנס ועל כל פעולה לפני ביצוע); בבדיקות פנימיות שיעור הצלחת התקפות "less than 0.08%". (שם)
- להימנע מ: ניהול חשבונות פיננסיים, מסמכים משפטיים, מידע רפואי, חשבונות עבודה עם מידע רגיש, אתרים עם מידע אישי של אחרים; מומלץ פרופיל דפדפן נפרד. (שם)
- אסור ל-Claude בכל מקרה: מסחר במניות, עקיפת captcha, הזנת מידע רגיש, איסוף תמונות פנים. אתרי תוכן למבוגרים ופיראטיות חסומים; אתרים פיננסיים דורשים אישור. (שם)
- המלצות: להתחיל באתרים מהימנים ובמשימות פשוטות (מחקר, מילוי טפסים), לכתוב פרומפטים ספציפיים, לעקוב אחרי הפעולות ולעצור בסימן חשוד. (שם)
- האחריות על פעולות שבוצעו בשם המשתמש נשארת על המשתמש. (שם)

## 8. למה Claude למפתחי למידה (רק מה שנאמר רשמית)

- דף המוצר מדגיש "reasoning, coding, and writing" ויצירת "first draft", וגם "editable, polished files, ready for your review". (https://claude.com/product/overview)
- "Keep context, instructions, and files organized by project" – מתאים לחומרי קורס. (https://claude.com/product/overview)
- חלון הקשר של עד 1M tokens בצ'ט (כ-555 אלף מילים) מאפשר לעבוד על מסמכים ארוכים. (https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans; https://platform.claude.com/docs/en/about-claude/models/overview)
- RAG בפרויקטים מגדיל את קיבולת חומרי המקור עד פי 10. (https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects)
- Artifacts: מסמכים, מצגות, דיאגרמות וכלים אינטראקטיביים, עם ייצוא ל-Word/PDF/PowerPoint. (https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)
- Skills לתהליכי עבודה חוזרים ועקביים ("perform specialized tasks more consistently"). (https://support.claude.com/en/articles/12512176-what-are-skills)
- **Claude for Education** (הוכרז 2 באפריל 2025): גרסה למוסדות להשכלה גבוהה; **Learning mode** בתוך Projects "guides students' reasoning process rather than providing answers" בשאלות סוקרטיות. (https://www.anthropic.com/news/introducing-claude-for-education)
- **Claude for Teachers** (הוכרז 14 ביולי 2026): גישה חינמית ליכולות פרימיום למורי K-12 מאומתים בארה"ב; כולל ספריית teaching skills, תכנון שיעורים, התאמת חומרים לרמות שונות (differentiation) וקורס AI Fluency. (https://www.anthropic.com/news/claude-for-teachers)
- ב-Claude Code קיים output style בשם Learning שבו Claude מאמן את המשתמש. (https://claude.com/plugins/learning-output-style – נמצא בחיפוש בלבד, לא נפתח)
- תכנים ייעודיים ל-L&D תאגידי (corporate learning / instructional design): לא אושר בעמוד רשמי.

## 9. תוכניות ומחירים (claude.com/pricing)

- **Free** – $0; "Limited usage" כל 5 שעות ובכל שבוע; צ'ט ב-web/desktop/mobile, web search, יצירת קבצים, הרצת קוד, Memory, Artifacts; עד 5 Projects; Connectors ו-Skills; בלי Claude Code ובלי Claude in Chrome. (https://claude.com/pricing)
- **Pro** – $17 לחודש בחיוב שנתי ($200 מראש) או $20 בחיוב חודשי; "More usage than Free"; כולל Claude Code, Projects, Research, Claude in Chrome ומודלים נוספים; Fable זמין עם usage credits. (שם)
- **Max** – $100 לחודש; "5x Pro usage"; Fable כלול עד מחצית מהמכסה השבועית; $100 לחודש ב-API credits; priority access. (שם)
- **Ultra** – $200 לחודש; "10x Pro usage every week"; "No 5-hour limit" לחשבונות מאומתים; $200 לחודש ב-API credits. (שם)
- **Team** – Standard seat: $20 למושב לחודש (שנתי) או $25 (חודשי); Premium seat: $100 (שנתי) או $125 (חודשי), "5x more usage than standard seats"; 2–150 משתמשים; כולל Claude Code, Claude Cowork, SSO ו-"no model training on your content by default". (שם)
- **Enterprise** – $20 למושב לחודש (שנתי, מינימום 20 מושבים) + שימוש לפי תעריפי API; SCIM, audit logs, Compliance API ועוד. (שם)

---

## לא אושר / השתנה

- **שמות מודלים**: המשפחה הנוכחית היא Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5. "Fable" הוא שכבה חדשה מעל Opus – לא להציג את Opus כ"מודל החזק ביותר". (https://platform.claude.com/docs/en/about-claude/models/overview)
- **Extended thinking**: המונח הישן הוחלף ב-Adaptive thinking + Effort; במודלים החדשים אי אפשר לכבות thinking ב-claude.ai. (שם; https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings)
- **תוכנית Ultra** ($200) חדשה – Max הוא עכשיו רק $100 ("5x Pro"). לא להשתמש ב"Max 5x / Max 20x". (https://claude.com/pricing)
- **Chat + Cowork אוחדו** לחוויה אחת (מתגלגל בהדרגה); חלק מהמשתתפים עדיין יראו את האפשרויות "Chat" ו-"Cowork" בנפרד. (https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)
- **Cowork בתוכניות אישיות**: עמוד המחירים מציין Cowork רק תחת Team; מרכז העזרה אומר שהוא זמין בכל התוכניות בתשלום. הסתירה לא נפתרה. (https://claude.com/pricing; https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- **חלון הקשר ב-Free**: לא אושר בעמוד רשמי (המאמר מכסה רק תוכניות בתשלום).
- **האם כל היסטוריית השיחה נקראת מחדש בכל הודעה**: לא אושר בעמוד רשמי. אושר רק ש"current conversation length" משפיע על הצריכה. (https://support.claude.com/en/articles/9797557-usage-limit-best-practices)
- **מספר הודעות מדויק לכל תוכנית**: לא מפורסם; Anthropic אומרת רק שזה משתנה לפי תוכנית וגורמים אחרים. (שם)
- **SKILL.md או skill.md**: מאמר היצירה הרשמי כותב `skill.md`; התיעוד של Claude Code ותוצאות החיפוש משתמשים ב-SKILL.md. לבדוק לפני שמציגים בשקף.
- **Projects בגרסה חדשה (beta)**: פרויקט כשיחה אחת עם threads מקבילים – בבטא למשתמשי Claude Code נבחרים בלבד. (https://support.claude.com/en/articles/9517075-what-are-projects)
- **Learning mode ב-claude.ai הכללי** (מחוץ ל-Claude for Education): לא אושר בעמוד רשמי.
- **Claude Code לשימוש לא-מפתחים**: לא אושר בעמוד רשמי.
- **Legacy artifacts**: עדיין אפשר לשתף ולפרסם אותם, אבל כבר אי אפשר ליצור חדשים. (https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)
- **Claude for Teachers** מיועד רק למחנכי K-12 מאומתים בארה"ב ולא רלוונטי ישירות לקהל בישראל. (https://www.anthropic.com/news/claude-for-teachers)
