export const STRINGS = {
  en: {
    lesson: {
      title: "Spot the signal",
      subtitle: "A short practice round using a fictional message.",
      start: "Try the literacy coach",
      step: "Question",
      correct: "That is the key distinction.",
      rethink: "Take another look at the distinction.",
      next: "Next question",
      finish: "Finish practice",
      done: "Pause. Question. Verify.",
      takeaway:
        "Look for pressure and promises, separate promotion from fraud, and check identities independently.",
      disclaimer: "Practice is not a safety certificate. No answers are saved.",
      again: "Practise again",
      questions: {
        signal: {
          prompt: "What should you do with this matched phrase?",
          options: [
            "Treat it as proof of fraud",
            "Pause and check the claim independently",
            "Assume the promised outcome is true",
          ],
          explanation:
            "A warning phrase is a reason to investigate, not proof that the sender committed fraud.",
        },
        noSignal: {
          prompt: "No red-flag phrase was matched. What follows?",
          options: [
            "The message is verified and safe",
            "Nothing is proved; check the source independently",
            "The sender must be registered",
          ],
          explanation:
            "Rules can miss unfamiliar wording. No detected flags never means safe.",
        },
        score: {
          prompt: "What does the red-flag meter measure?",
          options: [
            "A sum of rule weights, capped at 100",
            "The probability you will lose money",
            "A verified fraud rating from SEBI",
          ],
          explanation:
            "The project chooses these weights. The number is not fraud probability or an official SEBI rating.",
        },
        identity: {
          prompt:
            "A message includes a SEBI registration number. What is the best next step?",
          options: [
            "Trust the number alone",
            "Open the sender’s unknown link",
            "Check official records and compare identity/contact details",
          ],
          explanation:
            "A copied number does not establish identity. Use official SEBI resources and independently compare the claimed entity and contacts.",
        },
      },
    },
    emptyCaution:
      "Nothing has been checked yet. This tool does not verify identities or guarantee safety.",
    eyebrow: "Financial content literacy",
    heroStart: "Read the tip.",
    heroAccent: "Not the hype.",
    heroDescription: "Turn a forwarded tip into a moment of informed pause.",
    tagLocal: "Hosted analysis",
    tagBilingual: "English + हिन्दी",
    tagExplainable: "Explainable signals",
    inputHint: "A stock tip. A sales pitch. A message worth checking.",
    placeholder: "Paste a forwarded financial message here...",
    removeDetails: "No personal details, please",
    resultEyebrow: "Your analysis",
    emptyTitle: "Clarity starts with a pause.",
    emptyDescription:
      "Paste a message or try an example. We will show what it says, what to question and where to check.",
    emptyType: "Content type, not a fraud verdict",
    emptyFlags: "Matched phrases with explanations",
    emptyVerify: "Official verification steps",
    heuristic: "Rule-based score",
    footer: "Built for informed decisions",
    footerCaution: "No investment advice. No safety guarantees.",

    tagline: "Pause before trusting a financial message.",
    disclaimer:
      "Education only. Not investment advice. Remove names, phone numbers and account details before pasting.",
    language: "Language",
    examples: "Try a fictional example",
    example: "Example",
    exampleNames: [
      "Guaranteed returns",
      "Scam warning",
      "Diversification",
      "Paid course",
      "Hindi pressure tip",
      "Market bulletin",
    ],
    paste: "Paste message",
    check: "Check message",
    checking: "Checking...",
    warming: "The server may be waking up. The first check can take about a minute on free hosting. Keep this tab open; a timed-out request is retried once.",
    verdictTitle: "What it looks like",
    verdict: {
      promotion: "Looks like a promotion",
      education: "Looks like education",
      uncertain: "Unclear - review manually",
    },
    riskTitle: "Red-flag meter",
    risk: { high: "High", some: "Some", none_detected: "None detected" },
    noFlags:
      "No red-flag phrases found. This does not mean the message is safe.",
    flagsTitle: "Red flags found",
    sebi: "Read SEBI reference",
    context:
      "Warning language detected. Some keyword matches were suppressed; quotation and mixed context may need manual review.",
    verifyTitle: "Verify independently",
    verify: [
      "Check the claimed entity on the official SEBI site, including registration status and contact details.",
      "A registration number in a message can be copied. It is not proof of identity.",
      "Do not open unknown links or share OTPs or financial details.",
    ],
    sebiResources: "Official SEBI intermediary resources",
    urls: "Detected URLs are shown as text only, not visited:",
    engine: "Engine",
    modes: { "rules-only": "Rules only", "ml+rules": "Rules + model" },
    scoreNote:
      "Heuristic red-flag score, not scam probability. Promotion does not mean fraud. No flags does not mean safe. Sources have not been verified.",
    privacy: "Remove personal details. Messages are not intentionally stored.",
    error:
      "Could not check this message. The request may have timed out. Please check your connection and try again. This is not a zero-risk result.",
  },
  hi: {
    lesson: {
      title: "चेतावनी को पहचानें",
      subtitle: "काल्पनिक संदेश के साथ छोटा अभ्यास।",
      start: "समझने का अभ्यास करें",
      step: "प्रश्न",
      correct: "यही सही अंतर है।",
      rethink: "इस अंतर को फिर से समझें।",
      next: "अगला प्रश्न",
      finish: "अभ्यास पूरा करें",
      done: "रुकें। सवाल करें। जांचें।",
      takeaway:
        "दबाव और वादों को पहचानें। प्रचार को धोखाधड़ी न मानें। पहचान की अलग से जांच करें।",
      disclaimer: "यह अभ्यास सुरक्षा का प्रमाण नहीं। जवाब संग्रहित नहीं होते।",
      again: "फिर अभ्यास करें",
      questions: {
        signal: {
          prompt: "इस मिले वाक्यांश पर क्या करना चाहिए?",
          options: [
            "इसे धोखाधड़ी का पक्का सबूत मानें",
            "रुकें और दावे की अलग से जांच करें",
            "वादे को सच मान लें",
          ],
          explanation:
            "चेतावनी वाला वाक्यांश जांच का कारण है, धोखाधड़ी का पक्का सबूत नहीं।",
        },
        noSignal: {
          prompt: "कोई चेतावनी नहीं मिली। इसका क्या मतलब है?",
          options: [
            "संदेश सत्यापित और सुरक्षित है",
            "कुछ सिद्ध नहीं हुआ; स्रोत अलग से जांचें",
            "भेजने वाला जरूर पंजीकृत है",
          ],
          explanation:
            "नियम अनजान शब्दों को छोड़ सकते हैं। चेतावनी न मिलने का मतलब सुरक्षित नहीं।",
        },
        score: {
          prompt: "चेतावनी मीटर क्या मापता है?",
          options: [
            "नियमों के अंकों का जोड़, अधिकतम 100",
            "पैसा खोने की संभावना",
            "SEBI की सत्यापित धोखाधड़ी रेटिंग",
          ],
          explanation:
            "ये अंक परियोजना ने चुने हैं। यह धोखाधड़ी की संभावना या SEBI की आधिकारिक रेटिंग नहीं।",
        },
        identity: {
          prompt: "संदेश में SEBI पंजीकरण नंबर है। अब क्या करें?",
          options: [
            "सिर्फ नंबर पर भरोसा करें",
            "भेजने वाले का अनजान लिंक खोलें",
            "आधिकारिक रिकॉर्ड में पहचान और संपर्क मिलाएं",
          ],
          explanation:
            "कॉपी किया नंबर पहचान का प्रमाण नहीं। आधिकारिक SEBI स्रोत में संस्था और संपर्क की अलग से जांच करें।",
        },
      },
    },
    emptyCaution:
      "अभी कोई जांच नहीं हुई है। यह उपकरण पहचान सत्यापित नहीं करता और सुरक्षा की गारंटी नहीं देता।",
    eyebrow: "वित्तीय संदेशों को समझें",
    heroStart: "टिप को समझें।",
    heroAccent: "दावे पर न बहकें।",
    heroDescription: "फॉरवर्ड की गई टिप को समझें, फिर सोचकर फैसला लें।",
    tagLocal: "सर्वर पर विश्लेषण",
    tagBilingual: "English + हिन्दी",
    tagExplainable: "स्पष्ट चेतावनियां",
    inputHint: "स्टॉक टिप, प्रचार या कोई वित्तीय संदेश जांचें।",
    placeholder: "वित्तीय संदेश यहां चिपकाएं...",
    removeDetails: "कृपया निजी जानकारी न डालें",
    resultEyebrow: "आपका विश्लेषण",
    emptyTitle: "रुकें, समझें, फिर भरोसा करें।",
    emptyDescription:
      "संदेश चिपकाएं या उदाहरण चुनें। हम संदेश का प्रकार, चेतावनियां और जांच के कदम दिखाएंगे।",
    emptyType: "संदेश का प्रकार, धोखाधड़ी का फैसला नहीं",
    emptyFlags: "मिले वाक्यांश और उनका अर्थ",
    emptyVerify: "आधिकारिक जांच के कदम",
    heuristic: "नियमों पर आधारित स्कोर",
    footer: "सोच-समझकर फैसलों के लिए",
    footerCaution: "निवेश सलाह नहीं। सुरक्षा की गारंटी नहीं।",

    tagline: "किसी भी वित्तीय संदेश पर भरोसा करने से पहले रुककर जांचें।",
    disclaimer:
      "केवल शिक्षा के लिए। यह निवेश सलाह नहीं है। चिपकाने से पहले नाम, फोन नंबर और खाते की जानकारी हटा दें।",
    language: "भाषा",
    examples: "एक काल्पनिक उदाहरण आज़माएं",
    example: "उदाहरण",
    exampleNames: [
      "पक्के मुनाफे का दावा",
      "धोखाधड़ी से चेतावनी",
      "विविधीकरण",
      "सशुल्क कोर्स",
      "हिन्दी दबाव वाली टिप",
      "बाजार समाचार",
    ],
    paste: "संदेश चिपकाएं",
    check: "संदेश जांचें",
    checking: "जांच हो रही है...",
    warming: "सर्वर शुरू हो रहा हो सकता है। मुफ्त होस्टिंग पर पहली जांच में लगभग एक मिनट लग सकता है। यह टैब खुला रखें; समय खत्म होने पर एक बार फिर कोशिश होगी।",
    verdictTitle: "यह कैसा लगता है",
    verdict: {
      promotion: "यह प्रचार जैसा लगता है",
      education: "यह जानकारी/शिक्षा जैसा लगता है",
      uncertain: "साफ नहीं - खुद जांचें",
    },
    riskTitle: "चेतावनी मीटर",
    risk: { high: "ज्यादा", some: "कुछ", none_detected: "कोई नहीं मिली" },
    noFlags:
      "कोई चेतावनी वाला वाक्यांश नहीं मिला। इसका मतलब यह नहीं कि संदेश सुरक्षित है।",
    flagsTitle: "मिली चेतावनियां",
    sebi: "SEBI संदर्भ पढ़ें",
    context:
      "चेतावनी वाली भाषा मिली। कुछ मिलान हटाए गए हैं; उद्धरण या मिले-जुले संदर्भ को खुद जांचना पड़ सकता है।",
    verifyTitle: "खुद सत्यापित करें",
    verify: [
      "संदेश में बताई गई संस्था को SEBI की आधिकारिक साइट पर जांचें, पंजीकरण की स्थिति और संपर्क सहित।",
      "संदेश में लिखा पंजीकरण नंबर कॉपी किया जा सकता है। यह पहचान का सबूत नहीं है।",
      "अनजान लिंक न खोलें और OTP या वित्तीय जानकारी साझा न करें।",
    ],
    sebiResources: "SEBI की आधिकारिक मध्यस्थ जानकारी",
    urls: "मिले URL केवल टेक्स्ट में दिखाए गए हैं, खोले नहीं गए:",
    engine: "इंजन",
    modes: { "rules-only": "केवल नियम", "ml+rules": "नियम + मॉडल" },
    scoreNote:
      "यह नियमों पर आधारित चेतावनी स्कोर है, धोखाधड़ी की संभावना नहीं। प्रचार का मतलब धोखाधड़ी नहीं। कोई चेतावनी न मिलने का मतलब सुरक्षित नहीं। स्रोत सत्यापित नहीं किए गए हैं।",
    privacy: "निजी जानकारी हटाएं। संदेश जानबूझकर संग्रहित नहीं किए जाते।",
    error:
      "संदेश की जांच नहीं हुई। अनुरोध का समय खत्म हो सकता है। कनेक्शन जांचकर फिर कोशिश करें। यह शून्य जोखिम का नतीजा नहीं है।",
  },
};
