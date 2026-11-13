# מחקר רקע: Claude Skills (Agent Skills) - מפגש 2

Verified on: 2026-11-13

מקורות: רק מקורות רשמיים של Anthropic (support.claude.com, claude.com/docs, claude.com/blog, anthropic.com/engineering, platform.claude.com, code.claude.com, github.com/anthropics). ציטוטים באנגלית מועתקים מהדפים כפי שהם היום.

> **אזהרה חשובה לפני שבונים שקפים: ממשק התפריטים משתנה בימים אלה.**
> לפי מאמר התמיכה "Manage plugins, skills, and connectors from one Plugins page", הפריט **Customize** בסרגל הצד מתחלף ב-**Plugins**, ועמוד Plugins אחד מחליף את הלשוניות הנפרדות Skills, Connectors ו-Plugins. ב-Free, Pro, Max, Ultra ו-Team השינוי התחיל להתגלגל ב-29 באוקטובר והפך לזמין לכולם (general availability) ב-9 בנובמבר. ב-Enterprise הוא מופעל כברירת מחדל מ-30 בנובמבר 2026. פריטים קיימים נמצאים תחת **Plugins > Your plugins > Show all**. (https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)
> עם זאת, רוב דפי התיעוד האחרים (כולל claude.com/docs) עדיין כותבים **Customize > Skills**. לכן כל נתיב תפריט בהמשך המסמך צריך להיבדק מול המסך בפועל ביום הסדנה. (https://claude.com/docs/skills/overview.md)
> המאמר הזה נקרא רק דרך כלי סיכום ולא בטקסט מלא, כך שהפרטים בו (התאריכים ושמות התפריטים) לא אומתו מילה במילה.

---

## 1. הגדרה: מה זה Skill ובמה הוא שונה מכלים אחרים

- **ההגדרה הרשמית במרכז העזרה:** "Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks." ומיד אחר כך: "Skills teach Claude how to complete specific tasks in a repeatable way". (https://support.claude.com/en/articles/12512176-what-are-skills)
- **ההגדרה בתיעוד הפלטפורמה:** "Agent Skills are modular capabilities that extend Claude's functionality. Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant." (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **אנלוגיה טובה לקהל של מעצבי למידה:** הבלוג ההנדסי משווה Skill למדריך קליטה לעובד חדש: "Building a skill for an agent is like putting together an onboarding guide for a new hire." גם התיעוד מתאר Skills כ-"organized like an onboarding guide you'd create for a new team member". (https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills ; https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **מול Projects:** "Projects provide static background knowledge that's always loaded when you start chats within them. Skills provide specialized procedures that activate dynamically when needed and work everywhere across Claude." (https://support.claude.com/en/articles/12512176-what-are-skills)
- **מול Custom instructions:** "Custom instructions apply broadly to all your conversations. Skills are task-specific and only load when relevant, making them better for specialized workflows." (https://support.claude.com/en/articles/12512176-what-are-skills)
- **מול prompt רגיל:** "Unlike prompts (conversation-level instructions for one-off tasks), Skills load on demand, so you don't have to repeat the same guidance across conversations." (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **מול MCP ו-connectors:** "MCP connects Claude to external services and data sources. Skills provide procedural knowledge—instructions for how to complete specific tasks or workflows. You can use both together: MCP connections give Claude access to tools, while skills teach Claude how to use those tools effectively." (https://support.claude.com/en/articles/12512176-what-are-skills)
- **התיעוד החדש מוסיף גם Plugins להשוואה:** Plugins הם "Packages that contain several skills together with connectors, commands, and agents, so that you add them as one unit". ניסוח נוסף: "MCP connectors give Claude access to a tool or data source, and skills teach it how to do a task the way you or your team does it." (https://claude.com/docs/skills/overview.md ; https://claude.com/docs/extend/overview.md)
- **מתי Skill הוא לא הכלי הנכון:** לפי התיעוד, משימה חד-פעמית ("describe what you want in the conversation instead"), נתונים חיים משירות אחר (זה תפקידו של connector, ו-"it can't reach the service itself"), והנחיות שצריכות לחול על כל שיחה (מקומן ב-personal preferences או ב-project instructions). (https://claude.com/docs/skills/how-to)
- **מתי כן כדאי ליצור Skill:** "A skill pays off when Claude does a task for you repeatedly and you want it done the same way every time." ההמלצה היא להתחיל ממשפט אחד שמתאר את המשימה ואיך נראית תוצאה טובה: "That sentence becomes the skill's `description`". (https://claude.com/docs/skills/how-to)
- **Progressive disclosure, בניסוח פשוט:** "Claude doesn't read every skill in full at the start of a conversation." התהליך בשלושה שלבים: (1) "Knows what's available": Claude רואה רק את השם ואת התיאור, (2) "Loads the one that fits": כשהבקשה מתאימה לתיאור הוא קורא את `SKILL.md`, (3) "Opens extra files only when needed". (https://claude.com/docs/skills/overview.md)
- **Progressive disclosure, עם מספרי טוקנים (התיעוד הטכני):** שלוש רמות טעינה. Level 1 Metadata נטען "Always (at startup)" ועולה "~100 tokens per Skill". Level 2 Instructions (גוף `SKILL.md`) נטען "When Skill is triggered" ועולה "Under 5k tokens". Level 3+ Resources נטענים "As needed" ו-"None until accessed". סקריפטים רצים דרך bash ו-"only their output enters context". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **המסקנה המעשית:** "you can install many Skills without context penalty: until a Skill is triggered, only its name and description occupy context." (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **ארבע תכונות מההכרזה המקורית (16 באוקטובר 2025):** Composable ("Skills stack together"), Portable ("Skills use the same format everywhere"), Efficient ("Only loads what's needed, when it's needed"), Powerful (יכולים לכלול קוד הרצה). (https://claude.com/blog/skills)
- **תקן פתוח:** "The Agent Skills specification is published as an open standard at agentskills.io. This means skills you create aren't locked to Claude". העדכון על התקן הפתוח נוסף להכרזה ב-18 בדצמבר 2025. (https://support.claude.com/en/articles/12512176-what-are-skills ; https://claude.com/blog/skills)

## 2. אנטומיה של Skill

- **המבנה הבסיסי:** תיקייה שנקראת על שם ה-Skill, ובה `SKILL.md` כקובץ החובה היחיד. התיקיות האופציונליות בדוגמה הרשמית (`brand-guidelines/`): `references/` למסמכים ש-Claude קורא כשצריך, `assets/` לתבניות, תמונות וקבצי נתונים ש-Claude מעתיק או ממלא, ו-`scripts/` לקוד ש-Claude מריץ. (https://claude.com/docs/skills/how-to)
- **מבנה `SKILL.md`:** הקובץ חייב להתחיל ב-YAML frontmatter בין שני סימני `---`, ואחריו הוראות ב-Markdown. ההוראות יכולות לכלול "Step-by-step procedures", "Examples of inputs and outputs", "Templates or formatting requirements" ו-"Edge cases to handle". (https://claude.com/docs/skills/how-to)
- **השדה `name` (חובה):** עד 64 תווים, "Must contain only lowercase letters, numbers, and hyphens", בלי תגיות XML, ובלי המילים השמורות `anthropic` ו-`claude`. לפי claude.com/docs השם גם "Must match the skill's directory name". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview ; https://claude.com/docs/skills/how-to)
- **השדה `description` (חובה):** לא ריק, "Maximum 1,024 characters", בלי תגיות XML, וחייב לכלול גם מה ה-Skill עושה וגם מתי להשתמש בו. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview ; https://claude.com/docs/skills/how-to)
- **סתירה בין המקורות לגבי אורך התיאור (לא מאומת):** מאמר העזרה הישן "How to create custom skills" עדיין כותב שהתיאור מוגבל ל-"200 characters maximum", ומתאר את `name` כ-"A human-friendly name" (בדוגמה: "Brand Guidelines", עם רווח ואותיות גדולות). המאמר גם כותב את שם הקובץ `skill.md` באותיות קטנות. שאר התיעוד העדכני (platform, claude.com/docs, Claude Code) כותב `SKILL.md`, אותיות קטנות ומקפים בשם, ו-1,024 תווים. ההמלצה לשקפים: ללמד `SKILL.md`, שם באותיות קטנות עם מקפים, ותיאור קצר וממוקד, ולא להתחייב למספר מדויק בלי לציין את הסתירה. (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills ; https://claude.com/docs/skills/how-to)
- **שדות נוספים בתקן הפתוח:** ב-claude.ai, ב-Skills API ובאריזה עם `package_skill.py` מותרים רק השדות `name`, `description`, `license`, `compatibility`, `metadata` ו-`allowed-tools`. שדה אחר גורם לשגיאה קשיחה: "Unexpected key(s) in SKILL.md frontmatter". (https://code.claude.com/docs/en/skills)
- **השדה `compatibility`:** "Accepts a string of up to 500 characters". (https://code.claude.com/docs/en/skills)
- **השדה `dependencies`:** מאמר העזרה הישן מזכיר אותו כשדה אופציונלי (למשל "python>=3.8, pandas>=1.5.0"), אבל הוא לא מופיע ברשימת ששת השדות המותרים שלמעלה. לכן אינו מאומת כשדה תקין היום. (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills ; https://code.claude.com/docs/en/skills)
- **שדות שקיימים רק ב-Claude Code:** `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `background`, `hooks`, `paths` ו-`shell`. ב-Claude Code כל השדות אופציונליים, ואם `name` חסר נלקח שם התיקייה. (https://code.claude.com/docs/en/skills)
- **מוסכמות שמות:** מומלץ "gerund form" (למשל `processing-pdfs`, `writing-documentation`). צורות חלופיות מקובלות הן `pdf-processing` או `process-pdfs`. כדאי להימנע משמות מעורפלים כמו `helper`, `utils`, `documents` או `data`. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **אריזה ל-ZIP:** "The ZIP must contain the skill directory itself as its top level". קובץ `SKILL.md` שיושב בשורש ה-ZIP "isn't recognized as a skill". הפקודה המומלצת: `zip -r my-skill.zip my-skill/`. (https://claude.com/docs/skills/how-to)
- **סקריפטים:** בצ'אט ב-claude.ai כל התיקייה מועתקת לסביבת ה-code execution. ב-Claude Code וב-Cowork משתמשים ב-`${CLAUDE_SKILL_DIR}`. אסור לשים מפתחות API או סיסמאות: "everyone you share the skill with receives its files". (https://claude.com/docs/skills/how-to)

## 3. איפה Skills זמינים

- **תוכניות (סתירה בין המקורות, לא מאומת):** מרכז העזרה כותב "Skills are available for users on Free, Pro, Max, Ultra, Team, and Enterprise plans." לעומת זאת, claude.com/docs כותב "Skills are available on Pro, Max, Ultra, Team, and Enterprise plans" (בלי Free), ו-platform.claude.com כותב על Custom Skills ב-claude.ai "Available on Pro, Max, Ultra, Team, and Enterprise plans". הנוסח הבטוח לשקף: Skills נתמכים בתוכניות בתשלום, ולגבי Free התיעוד סותר את עצמו. (https://support.claude.com/en/articles/12512180-using-skills-in-claude ; https://claude.com/docs/skills/overview.md ; https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **דרישת Code execution:** "This feature requires code execution to be enabled." בתוכניות אישיות עוברים ל-**Settings > Capabilities** ומפעילים את **Code execution and file creation** (במסך ההגדרות החדש נקרא **Create and edit files**). (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **הפעלה בתוכנית אישית:** לפי מרכז העזרה, אחרי הפעלת code execution נכנסים ל-**Customize > Skills** ומדליקים או מכבים כל Skill. ב-claude.com/docs: בלשונית **Your skills** לוחצים **Turn on**, ובלשונית **Discover** יש Skills להוספה. השאלה האם התפריט נקרא Customize או Plugins מוסברת בתיבת האזהרה בראש המסמך. (https://support.claude.com/en/articles/12512180-using-skills-in-claude ; https://claude.com/docs/skills/overview.md)
- **Team:** "This feature is enabled by default at the organization level." (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **Enterprise:** הבעלים (Owner) צריכים לוודא ש-Code execution and file creation ו-Skills מופעלים ב-**Organization settings > Plugins & skills**, בלשונית **Policy**. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **סתירה בנתיב של מנהלי הארגון (לא מאומת):** מאמר Plugins החדש כותב **Organization settings > Library > Policy**, ומציין ש-Skills "will be renamed to Plugins on November 30". (https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)
- **בקרות מנהל:** הבעלים יכולים לבצע "provision skills for all users", כלומר להעלות Skills לכל הארגון דרך **Add > Upload a skill / Create a skill**. Skills כאלה מופעלים כברירת מחדל, והמשתמשים יכולים לכבות אותם. ב-Enterprise אפשר לחלק Skills לקבוצה מסוימת בלבד על ידי אריזה ב-plugin. המתג "User-created skills" דולק כברירת מחדל, ומנהל יכול לכבות אותו. (https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization)
- **שיתוף בתוך הארגון (Team/Enterprise):** דרך תפריט "..." ואז "Share". אפשר לשתף אנשים ספציפיים, ובתוכנית Enterprise גם קבוצות. "Shared skills are view-only. Recipients can enable and use the skill, but they can't edit the contents." (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **פרסום לספריית הארגון:** כפתור "Publish to org". אם הארגון דורש בדיקה, בוחרים אחת משלוש אפשרויות: "Available to install", "Installed by default" או "Required". למנהל יש שלוש מדיניות פרסום: Requires review, Open ו-Off. (https://support.claude.com/en/articles/12512180-using-skills-in-claude ; https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization)
- **ממשקים:** Skills זמינים ב-claude.ai, ב-Claude Code, ובגרסת beta ב-API "using the code execution tool". (https://support.claude.com/en/articles/12512176-what-are-skills)
- **ווב, דסקטופ ומובייל:** "Connectors, skills, and plugins you add in claude.ai or the desktop app are saved to your account, so you have them in chat on the web, desktop, and mobile wherever you sign in." (https://claude.com/docs/extend/overview.md)
- **תוספי Microsoft 365:** Skills שהופעלו זמינים גם ב-Claude for Excel, PowerPoint, Word ו-Outlook. אפשר להקליד `/` בסרגל הצד כדי לבחור Skill. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **סנכרון ל-Claude Code (חדש):** Skills מהחשבון ב-claude.ai נטענים גם ב-Claude Code בטרמינל כשמתחברים עם אותו חשבון. זה דורש Claude Code v2.1.273 ומעלה. הפקודה `/skills` מציגה אותם תחת "claude.ai sync". הסנכרון חד-כיווני, ו-Skills לא מסונכרנים כשמתחברים עם API key. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **סתירה לגבי סנכרון:** דף התיעוד של הפלטפורמה עדיין כותב "Custom Skills do not sync across surfaces". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **API:** מציינים `skill_ids` בפרמטר `container` יחד עם code execution tool. ה-Skills המובנים הם `pptx`, `xlsx`, `docx` ו-`pdf`. Skills מותאמים מועלים דרך `/v1/skills`, והם "shared workspace-wide". ב-API אין גישה לרשת ואין התקנת חבילות בזמן ריצה. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **שמירת נתונים:** Agent Skills "is not covered by ZDR arrangements". גם ה-BAA של HIPAA לא מכסה connectors, plugins ו-Skills. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview ; https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)

## 4. איפה מוצאים Skills ואיך בוחרים Skills בטוחים

- **ה-Skills המובנים של Anthropic:** Excel, Word, PowerPoint ו-PDF. "You don't need to explicitly invoke them—Claude determines when each skill is needed based on your request." (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **מקורות ה-Skills ברשימה האישית:** ב-claude.com/docs הלשונית Your skills מקובצת לפי מקור: **Created by you**, **From your organization**, **Shared with you**, **From Anthropic & Partners**. (https://claude.com/docs/skills/overview.md)
- **Partner skills:** "The Skills Directory features professionally-built skills from partners like Notion, Figma, Atlassian, and others", שבנויים לעבוד עם ה-connectors של אותם שותפים. (https://support.claude.com/en/articles/12512176-what-are-skills)
- **הספרייה (Directory):** פותחים אותה דרך "+" ואז "Browse skills", ומוסיפים Skill בלחיצה על "Add". "Skills you install from the directory are view-only." כדי לשנות Skill כזה מורידים עותק, משנים ומעלים אותו כ-Skill אישי. (https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory)
- **תוויות Verified ו-Community:** לפי מאמר Plugins החדש, plugins ציבוריים מסומנים "Verified" או "Community". לא אימתתי את זה בטקסט מלא. (https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page)
- **המאגר github.com/anthropics/skills:** "This repository contains skills that demonstrate what's possible with Claude's skills system." הקטגוריות הן "Creative & Design, Development & Technical, Enterprise & Communication, and Document Skills". במאגר יש גם תיקיית `spec` (המפרט) ותיקיית `template`. (https://github.com/anthropics/skills)
- **רישיון:** "Many skills in this repo are open source (Apache 2.0)". גם Skills המסמכים (docx, pdf, pptx, xlsx) מוגדרים כ-Apache 2.0, ובכל Skill כתוב "license: Complete terms in LICENSE.txt". (https://github.com/anthropics/skills)
- **הסתייגות רשמית במאגר:** "These skills are provided for demonstration and educational purposes only." ההתנהגות ב-Claude עשויה להיות שונה מהמימוש שבמאגר. (https://github.com/anthropics/skills)
- **ה-Skills שבמאגר, לפי קובץ ה-marketplace:**
  - **document-skills:** `xlsx`, `docx`, `pptx`, `pdf`.
  - **example-skills:** `algorithmic-art`, `brand-guidelines`, `canvas-design`, `doc-coauthoring`, `frontend-design`, `internal-comms`, `mcp-builder`, `skill-creator`, `slack-gif-creator`, `theme-factory`, `web-artifacts-builder`, `webapp-testing`.
  - **plugins נפרדים:** `claude-api`, `academy-guide`, `discernment-nudge`.
  (https://github.com/anthropics/skills/blob/main/.claude-plugin/marketplace.json)
- **Skills רלוונטיים במיוחד לקהל הסדנה:**
  - `doc-coauthoring`: "Guide users through a structured workflow for co-authoring documentation".
  - `internal-comms`: סטטוסים, ניוזלטרים, שאלות נפוצות ועוד.
  - `brand-guidelines`.
  - `theme-factory`: "10 pre-set themes with colors/fonts" לשקפים ולמסמכים.
  - `academy-guide`: ממליץ על קורסים מ-Claude Academy.
  - `discernment-nudge`: מוסיף שאלות המשך שעוזרות לבדוק עובדות.
  (https://github.com/anthropics/skills/tree/main/skills)
- **Claude Code: התקנה מהמאגר דרך plugins:** `/plugin marketplace add anthropics/skills`, ואחר כך `/plugin install document-skills@anthropic-agent-skills` או `/plugin install example-skills@anthropic-agent-skills`. (https://github.com/anthropics/skills)
- **ה-marketplace הרשמי:** skill-creator זמין כ-plugin דרך `/plugin install skill-creator@claude-plugins-official`. (https://code.claude.com/docs/en/skills)
- **הנחיית אבטחה רשמית (ב-claude.ai):** "Important: Only install skills only from trusted sources." (כך במקור, כולל ה-"only" הכפול.) כשמתקינים Skill ממקור פחות מהימן, "including one shared by a colleague", צריך לקרוא את הקבצים, לשים לב במיוחד ל-code dependencies, לתמונות ולסקריפטים, ולהוראות שמנחות את Claude להתחבר למקורות חיצוניים לא מהימנים. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **הסיכונים המרכזיים:** "The most significant risks are prompt injection ... and data exfiltration". (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **הנחיית אבטחה בתיעוד הפלטפורמה:** "Use Skills only from trusted sources: those you created yourself or obtained from Anthropic." ההנחיות שם: "Audit thoroughly", "External sources are risky", ו-"Treat like installing software". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **Skills ש-Anthropic לא בדקה:** "skills someone shares with you or that you upload yourself aren't reviewed by Anthropic, so open the skill and read its `SKILL.md` and files before you turn it on." (https://claude.com/docs/skills/overview.md)
- **סריקת אבטחה (Enterprise):** אפשר להפעיל "Skill and plugin security scanning". Skill עם סיכון אפשרי מקבל באנר אזהרה, ו-Skill עם תוכן זדוני נחסם. הסריקה לא זמינה בתצורות CMEK, ZDR ו-HIPAA. (https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization)

## 5. התקנה ושימוש

- **העלאת ZIP ב-Claude.ai (הצעדים המדויקים לפי מרכז העזרה):**
  1. יוצרים Skill לפי המבנה.
  2. אורזים את התיקייה כ-ZIP.
  3. נכנסים ל-**Customize > Skills**.
  4. לוחצים על "+" ואז על "+ Create skill".
  5. בוחרים "Upload a skill".
  6. מעלים את קובץ ה-ZIP. ה-Skill מופיע ברשימה וניתן להדליק ולכבות אותו.
  (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **פרטיות של Skill שהועלה:** Skills שהועלו "aren't visible to colleagues until you share them". מנהלים רואים את השמות ואת סטטוס השיתוף, אבל לא את הקבצים. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **"הקלטת Skill" (Record a skill):** זמין ב-Pro, Max, Ultra ו-Team, ב-Cowork ב-Claude for Mac בלבד. "It isn't available in chat, on Windows, or on Free and Enterprise plans." מקליטים את המסך, הקליקים והקול (עד כ-10 דקות), ו-Claude מציע Skill לשמירה. (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- **Claude Code, Skill אישי:** `~/.claude/skills/<skill-name>/SKILL.md`, זמין בכל הפרויקטים במחשב. (https://code.claude.com/docs/en/skills)
- **Claude Code, Skill של פרויקט:** `.claude/skills/<skill-name>/SKILL.md`. "Commit it so your team gets it too". (https://code.claude.com/docs/en/skills)
- **Claude Code, מיקומים נוספים:** Plugin (מופעל כ-`/plugin-name:skill-name`), Enterprise דרך managed settings, ו-Skills מחשבון claude.ai. (https://code.claude.com/docs/en/skills)
- **פקודות שהפכו ל-Skills:** "Custom commands have been merged into skills." (https://code.claude.com/docs/en/skills)
- **API:** מעלים דרך `/v1/skills` ומפנים ל-`skill_id` בתוך `container`. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **איך Claude מחליט להשתמש ב-Skill:** "When you ask Claude to complete a task, it reviews available skills, loads relevant ones, and applies their instructions." וגם: "The `description` is what Claude matches your request against when determining whether to trigger the Skill". (https://support.claude.com/en/articles/12512176-what-are-skills ; https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **הפעלה מפורשת ב-Claude.ai:** "To pick one yourself, type `/` in the message box and select the skill." לפי מאמר Plugins החדש אפשר גם ללחוץ "+" או להקליד "/". אפשרות נוספת היא לבקש במפורש, למשל "Use my brand guidelines skill to create a presentation". (https://claude.com/docs/skills/overview.md ; https://support.claude.com/en/articles/17740565-manage-plugins-skills-and-connectors-from-one-plugins-page ; https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **הפעלה מפורשת ב-Claude Code:** `/skill-name`. אפשר לחסום הפעלה אוטומטית עם `disable-model-invocation: true`. (https://code.claude.com/docs/en/skills)
- **איך רואים באיזה Skill Claude השתמש:** ב-claude.ai התיעוד אומר רק "Review Claude's thinking to confirm it's loading the skill". **לא מצאתי תיאור רשמי של מחוון ויזואלי בממשק הצ'אט**, ולכן כדאי לבדוק את זה בפועל לפני הסדנה. ב-Claude Code אפשר לשאול "What skills are available?", להריץ `/skills`, ולהריץ `/skill-doctor` כדי לראות שימוש ועלות. ב-Team/Enterprise עמוד ה-Skill מציג נתוני **Adoption**, **Activity** ו-**You**. (https://claude.com/docs/skills/how-to ; https://code.claude.com/docs/en/skills ; https://claude.com/docs/skills/overview.md)
- **תקלות נפוצות בהעלאה:** ZIP גדול מדי, שם תיקייה שלא תואם לשם ה-Skill, קובץ skill.md חסר, ותווים לא חוקיים. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- **תקלה: Claude לא משתמש ב-Skill:** בודקים שה-Skill מופעל, שהתיאור ברור, ומנסחים בקשה מפורשת יותר. (https://support.claude.com/en/articles/12512180-using-skills-in-claude)

## 6. יצירת Skills

- **צעדי היצירה הרשמיים:**
  1. מחליטים מה ה-Skill צריך לעשות (Decide what skill to create).
  2. בונים את מבנה התיקייה.
  3. כותבים `SKILL.md`: frontmatter והוראות.
  4. מוסיפים resources ו-scripts לפי הצורך.
  5. אורזים ל-ZIP.
  6. בודקים: לפני ההעלאה, ב-Claude Code, ואחרי ההעלאה.
  7. מודדים שיפור עם skill-creator.
  8. משתפים או אורזים כ-plugin.
  (https://claude.com/docs/skills/how-to)
- **skill-creator:** הוא "a skill from Anthropic that runs your skill on test prompts you agree on, shows you the results, and helps you revise it". ב-claude.ai מפעילים אותו תחת Customize > Skills, שם הוא "listed as from Anthropic", ואז מבקשים מ-Claude להעריך את ה-Skill. אפשר גם לבקש מ-Claude לנסח Skill יחד איתך: "ask it to use the skill-creator skill, then edit what it produces". (https://claude.com/docs/skills/how-to)
- **ההבדל בין צ'אט לבין Cowork ו-Claude Code:** בצ'אט skill-creator עובר על בקשות הבדיקה אחת אחת. ב-Cowork וב-Claude Code הוא גם מריץ baseline בלי ה-Skill, מריץ הכול במקביל, ומוסיף pass rates, זמנים ומספרי טוקנים. (https://claude.com/docs/skills/how-to)
- **יצירת Skill משיחה קיימת:** בתוך ה-SKILL.md של skill-creator כתוב: "The current conversation might already contain a workflow the user wants to capture (e.g., they say "turn this into a skill"). If so, extract answers from the conversation history first". (https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- **מדריך Academy על יצירה בשיחה (לא נקרא):** קיים מדריך בשם "How to create a skill with Claude through conversation", אבל לא הצלחתי לפתוח אותו מסביבת המחקר (academy.claude.com חסום ברשת). (https://academy.claude.com/tutorials/how-to-create-a-skill-with-claude-through-conversation)
- **שיטת "Claude A / Claude B":** "Work with one instance of Claude ("Claude A") to create a Skill that is used by other instances ("Claude B")." הצעדים: עושים את המשימה בלי Skill, שמים לב מה חוזר על עצמו, מבקשים מ-Claude A ליצור Skill, מקצרים, בודקים עם Claude B על משימות אמיתיות, ומשפרים לפי מה שנצפה. (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **שתי משפחות של Skills (מבלוג skill-creator, 3 במרץ 2026):** "Capability uplift" הם Skills שעוזרים ל-Claude לעשות מה שהמודל לבדו "either can't do or can't do consistently". "Encoded preference" הם Skills שמסדרים צעדים ש-Claude כבר יודע לעשות לפי התהליך של הצוות. הבלוג גם מציין שרוב כותבי ה-Skills הם "subject matter experts, not engineers". (https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills)
- **Best practices לכתיבה:**
  - "Concise is key": "Default assumption: Claude is already very smart". "Only add context Claude doesn't already have."
  - לכתוב את התיאור בגוף שלישי: "Always write in third person" (טוב: "Processes Excel files and generates reports").
  - "Keep the `SKILL.md` body under 500 lines".
  - הפניות לקבצים נוספים רק ברמה אחת: "Keep references one level deep from `SKILL.md`".
  - להימנע ממידע שתלוי בזמן.
  - להשתמש במינוח עקבי.
  - דוגמאות קונקרטיות.
  - Workflows עם צעדים ברורים ו-feedback loops.
  (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **Best practices ב-claude.ai:**
  - "Keep it focused".
  - "Write a specific description": "The description is the only part Claude reads before deciding to load the skill".
  - "Start with instructions".
  - "Show the output you expect".
  - "Test after each change".
  (https://claude.com/docs/skills/how-to)
- **מה מאפיין Skill טוב:** "Solve a specific, repeatable task", "Have clear instructions", "Include examples when helpful", "Define when they should be used", "Are focused on one workflow". (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- **עריכה בצ'אט:** בזמן עבודה על Skill בצ'אט, אפשר לסמן טקסט בקבצים שנפתחים לצד השיחה, ללחוץ "Edit with Claude" ולבקש שינוי. (https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)

## 7. בדיקה והערכה (Testing / Evaluation)

- **לפני העלאה:** קוראים את `SKILL.md` ובודקים שהוא ברור, בודקים את התיאור, ומוודאים שכל הקבצים שהוא מפנה אליהם קיימים. אפשר לאמת את המבנה עם `skills-ref validate ./my-skill` (תוצאה תקינה: "Valid skill: ./my-skill") או עם `claude plugin validate`. (https://claude.com/docs/skills/how-to)
- **אחרי העלאה:** מפעילים את ה-Skill, מנסים כמה בקשות שאמורות להפעיל אותו, קוראים את החשיבה של Claude, ומשפרים את התיאור אם ה-Skill לא נטען. (https://claude.com/docs/skills/how-to)
- **ההבדל בין "נטען" לבין "עובד טוב":** "Seeing a skill trigger tells you Claude found it, not that it did what you intended." השיטה היא baseline: אוספים כמה בקשות ריאליסטיות, מריצים כל אחת בסשן חדש עם ה-Skill ובלעדיו, ומשווים. "A fresh session matters because leftover context from authoring the skill will mask gaps in the written instructions." (https://code.claude.com/docs/en/skills)
- **Evaluation-driven development:** "Create evaluations BEFORE writing extensive documentation." חמשת השלבים: Identify gaps, Create evaluations ("three scenarios"), Establish baseline, Write minimal instructions, Iterate. התיעוד מציין: "There is not currently a built-in way to run these evaluations" (בהקשר של ה-API). (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **רשימת בדיקה לפני שיתוף:** "At least three evaluations created", "Tested with Haiku, Sonnet, and Opus", "Tested with real usage scenarios", "Team feedback incorporated". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **מה skill-creator עושה ב-Claude Code:**
  - שומר את מקרי הבדיקה ב-`evals/evals.json`.
  - מריץ כל מקרה ב-subagent נפרד.
  - מדרג כל ריצה (`grading.json`).
  - מסכם benchmark של with-skill מול without-skill (`benchmark.json`).
  - מריץ "blind A/B" בין שתי גרסאות.
  - משפר את התיאור (Description tuning) עם בקשות should-trigger ו-should-not-trigger.
  - פותח review viewer ב-HTML.
  (https://code.claude.com/docs/en/skills)
- **ממצא מהבלוג:** כוונון התיאורים "improved triggering on 5 out of 6 public skills" במסמכי Anthropic. ה-A/B עיוור: "They judge outputs without knowing which is which." (https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills)
- **Skills של כתיבה וסגנון:** "Subjective skills (writing style, design quality) are better evaluated qualitatively — don't force assertions onto things that need human judgment." זה רלוונטי מאוד ל-Skills של מעצבי למידה. (https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- **לצפות איך Claude משתמש ב-Skill:** לשים לב ל-"Unexpected exploration paths", ל-"Missed connections", ל-"Overreliance on certain sections" ול-"Ignored content". (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## 8. דוגמאות רשמיות ומקרי בוחן רלוונטיים

- **Brand guidelines:** הדוגמה המרכזית בתיעוד היא Skill של "Acme Corp" עם צבעים, גופנים, שימוש בלוגו וקטע "When to apply". הגרסה החדשה כוללת `references/voice-and-tone.md`, `assets/slide-template.md` וסקריפט שבודק ניגודיות צבעים (סף 4.5). (https://claude.com/docs/skills/how-to ; https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- **רעיונות רשמיים ל-Skills מותאמים:**
  - "Apply brand style guidelines to documents and presentations".
  - "Generate communications following company email templates".
  - "Structure meeting notes with company-specific formats".
  - "Create tasks in company tools (JIRA, Asana, Linear) following team conventions".
  - "Automate personal workflows".
  (https://support.claude.com/en/articles/12512176-what-are-skills)
- **ארבעה Skills לחיקוי, לפי סוג:**
  - `brand-guidelines`: הוראות בלבד.
  - `internal-comms`: הוראות ותיקיית `examples/`.
  - `pdf`: הוראות, קבצי reference וסקריפטים.
  - `skill-creator`.
  ההמלצה: "Copy a skill's structure rather than its contents". (https://claude.com/docs/skills/how-to)
- **מקרי בוחן מההכרזה:**
  - **Box:** הופכת קבצים שמורים למסמכי PowerPoint, Excel ו-Word לפי הסטנדרטים של הארגון.
  - **Rakuten:** תהליכי חשבונאות ניהולית. "What once took a day, we can now accomplish in an hour."
  - **Notion:** "Less prompt wrangling on complex tasks, more predictable results."
  - **Canva:** מתכננת להשתמש ב-Skills כדי להתאים את הסוכנים שלה.
  (https://claude.com/blog/skills)
- **בלוג "How to create Skills" (19 בנובמבר 2025):** מנתח שלוש דוגמאות: DOCX, brand guidelines ו-frontend design. הוא ממליץ על ניהול ארגוני של Skills: בעלים לכל תחום, ספרייה מרכזית, גרסאות עם changelog, וסקירה רבעונית. הערה: הבלוג כותב שב-claude.ai Skills "are not shared organization-wide", וזה כבר לא נכון היום (ראו סעיף 3). (https://claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
- **חינוך:** **לא מצאתי מקרה בוחן רשמי שעוסק ב-Skills בתחום החינוך או בעיצוב הדרכה.** בדפי הלקוחות של Claude יש סיפורי חינוך (MagicSchool, ClassDojo, Amira ועוד), אבל הם עוסקים ב-API ולא ב-Skills. ה-Skill הרשמי הקרוב ביותר לתחום הוא `academy-guide`, שממליץ על קורסים מ-Claude Academy, בין השאר כשמבקשים "rolling Claude out to a team, class, or organization" ו-"training materials, onboarding content". (https://claude.com/customers/magicschool ; https://github.com/anthropics/skills/blob/main/skills/academy-guide/SKILL.md)

---

## מה לא אומת או שנוי במחלוקת

1. **שם התפריט:** Customize > Skills מול עמוד Plugins החדש, שזמין ב-Free עד Team מ-9 בנובמבר ויגיע ל-Enterprise ב-30 בנובמבר. גם נתיב המנהל לא ברור: Organization settings > Plugins & skills מול Organization settings > Library > Policy. מאמר Plugins נקרא רק בסיכום. צריך לבדוק במסך ביום הסדנה.
2. **האם Skills זמינים ב-Free:** מרכז העזרה כותב שכן, ו-claude.com/docs ו-platform כותבים Pro ומעלה.
3. **אורך `description`:** 200 תווים במאמר העזרה הישן, 1,024 בכל שאר המקורות. גם צורת `name` שונה: "human-friendly" מול lowercase עם מקפים.
4. **השדה `dependencies`:** מוזכר במאמר העזרה, אבל לא נמצא ברשימת השדות המותרים בהעלאה.
5. **סנכרון בין ממשקים:** מרכז העזרה מתאר סנכרון מ-claude.ai ל-Claude Code (v2.1.273 ומעלה), ו-platform עדיין כותב שאין סנכרון.
6. **מחוון ויזואלי ל-Skill שהופעל בצ'אט:** לא נמצא תיעוד. רק "review Claude's thinking".
7. **מדריכי Claude Academy:** "Teach Claude your way of working using skills" ו-"How to create a skill with Claude through conversation" לא נקראו, כי academy.claude.com חסום ברשת של סביבת המחקר.
8. **אתר agentskills.io:** לא נקרא ישירות (חסום). מה שכתוב עליו כאן מבוסס על ההפניות של Anthropic בלבד.
9. **"Record a skill":** תואר רק במאמר העזרה, ב-Cowork ב-Mac בלבד. לא נבדק בפועל.
