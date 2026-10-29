# העלאה לשרת - קייס Critera

הקייס של Critera הוא עכשיו הכרטיס השלישי בדף הבית, מתחת ל-SyncOps ול-AFT. הכרטיס באנגלית, והקייס עצמו בעברית, מימין לשמאל. הדמו החי נפתח מהכרטיס ומתוך הקייס.

## מה להעלות

| מה | איפה בשרת | הערה |
|---|---|---|
| `index.html` | `/index.html` | נוסף הכרטיס השלישי, Critera, והתמונות של SyncOps ו-AFT הוחלפו בגרסאות החיות |
| `css/styles.css` | `/css/styles.css` | נוסף העיצוב של הכרטיס עם האנימציה. דף הבית טוען אותו עם `?v=20261016i` |
| התיקייה `case-critera/` כולה | `/case-critera/` | חדשה. כוללת את `critera.html`, את `critera-case.js`, את `assets/` ואת `critera-demo/`. בערך 19MB |
| `css/light.css` | `/css/light.css` | השתנה: הצל של התמונה בכרטיסים חל גם על התמונות החיות. דף הבית טוען אותו עם `?v=20261016b` |
| `case-aft/aft-timeline.html`, `case-syncops/syncops.html`, `case-syncops/syncops-he.html` | באותם נתיבים | השתנו: תמונת הפתיחה חיה, ובתחתית שני הקייסים האחרים (Next Cases) עם התמונות החיות, ופס הזכוכית החי של דף הבית ברקע |
| `resume.html`, `css/resume.css` | באותם נתיבים | השתנו: פס הזכוכית החי של דף הבית ברקע, בכהה ובבהיר |
| `js/case-live.js` | `/js/case-live.js` | חדש: האנימציה של התמונות החיות בכרטיסים של SyncOps ו-AFT |
| `case-critera/critera-en.html`, `case-critera/critera-demo-en/` | באותם נתיבים | חדשים: הקייס והדמו באנגלית. הכרטיס בדף הבית פותח את האנגלית, ובתפריט הקייס יש מעבר לעברית |
| `css/case-study.css` | `/css/case-study.css` | הקובץ השתנה (ערכת הצבעים של Critera ותיקוני המובייל). הקייס טוען אותו עם `?v=20261016i` |

שום קובץ אחר לא השתנה. הקייס משתמש גם בקבצים שכבר נמצאים בשרת: שאר קובצי `js/`, `assets/icons/*` ו-`assets/images/logoColorful.png`. אין צורך להעלות אותם שוב.

## מה לא להעלות

- `tools/` (כולל `tools/critera-demo/`): כלי הבנייה של הדמו, לא חלק מהאתר
- `docs/` (כולל הקובץ הזה ו-`caption-options.png`)
- `.claude/`
- `design-lab/`

## לא לגעת

- לא להסיר את `<meta name="robots" content="noindex, nofollow">` מ-`critera-demo/index.html`. הדמו לא צריך להופיע במנועי חיפוש
- לא לשנות את המבנה בתוך `case-critera/`. הדמו והאנימציה נטענים בנתיבים יחסיים (`critera-demo/index.html#/...`, `assets/critera-isometry.html`)

## בדיקה אחרי ההעלאה

1. לפתוח את דף הבית ולגלול ל-Portfolio: שלושה כרטיסים, והשלישי הוא Critera עם המחשב והטלפון באנימציה (לא ריק)
2. ללחוץ על הכרטיס: נפתח `https://<הדומיין>/case-critera/critera.html`
3. בקייס: הכותרת בעברית, מימין לשמאל, והקשת הצבעונית למטה משמאל במקטע "הפרויקט"
4. לגלול לאורך הקייס ולוודא שהחלונות החיים (ה-hero, הלוגו המונפש, ציר הזמן, הזירות והדרך) נטענים ואינם ריקים
5. ללחוץ על "Try the live demo" בכרטיס ועל "דמו חי" בקייס: נפתח `/case-critera/critera-demo/index.html`, ודף הבית, "אודות" ו"בלוג" עובדים
6. לבדוק גם בטלפון: הכרטיס, האנימציה בפתיחת הקייס, האורביט הקטן ומסכי המובייל שנפרשים בנגיעה

## מה להחזיר לי

שלושה קישורים מלאים מהשרת:

- **דף הבית:** `https://<הדומיין>/`
- **הקייס (אנגלית):** `https://<הדומיין>/case-critera/critera-en.html`
- **הקייס (עברית):** `https://<הדומיין>/case-critera/critera.html`
- **הדמו (עברית):** `https://<הדומיין>/case-critera/critera-demo/index.html`
- **הדמו (אנגלית):** `https://<הדומיין>/case-critera/critera-demo-en/index.html`
