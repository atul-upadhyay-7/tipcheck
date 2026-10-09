export const QUESTIONS = [
 {key:'first_payment', route:'/check/recipient', en:'Is this your first payment to this recipient?', hi:'क्या इस व्यक्ति को आपका पहला भुगतान है?'},
 {key:'name_match', route:'/check/name', en:'Does the name shown by your UPI app match the intended recipient?', hi:'क्या UPI ऐप में दिखने वाला नाम सही व्यक्ति से मिलता है?'},
 {key:'unusual_amount', route:'/check/amount', en:'Is the amount unusually large for you?', hi:'क्या रकम आपके लिए असामान्य रूप से बड़ी है?'},
 {key:'pressure', route:'/check/pressure', en:'Are you being pressured to pay now or keep it secret?', hi:'क्या तुरंत या गुप्त भुगतान का दबाव है?'},
 {key:'pin_to_receive', route:'/check/pin', en:'Were you told to enter a UPI PIN to receive money?', hi:'क्या पैसे पाने के लिए UPI PIN डालने को कहा गया?'},
 {key:'remote_access', route:'/check/access', en:'Were you asked to share your screen or allow remote access?', hi:'क्या स्क्रीन साझा करने या रिमोट एक्सेस को कहा गया?'}
];
export const ANSWERS = {en:{unknown:'Not sure / not provided',yes:'Yes',no:'No'},hi:{unknown:'पता नहीं / नहीं बताया',yes:'हां',no:'नहीं'}};
export function nextQuestion(route) {const i=QUESTIONS.findIndex(q=>q.route===route);return i<0?'/check/recipient':QUESTIONS[i+1]?.route || '/check/review';}
