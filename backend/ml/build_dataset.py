"""Regenerate data/dataset.csv. Every row is SYNTHETIC: written by us from patterns described in SEBI
investor-awareness material, not copied from real chats. See data/README.md.
Usage (from backend/): python -m ml.build_dataset
"""
import csv
import random
from pathlib import Path

random.seed(7)
OUT = Path(__file__).parent / "data" / "dataset.csv"

# ---- Hand-written rows: (text, label, group). Includes hard cases on purpose. ----
HAND = [
 # promotion, obvious
 ("Join our VIP group today. Guaranteed 40% profit in 10 days, only 20 seats left!", "promotion", "h_p1"),
 ("Sure shot call: buy XYZ at 52, target 80 by Friday. DM me to get the full list.", "promotion", "h_p2"),
 ("Our SEBI registered expert gives 100% accurate calls. Pay Rs 999 and start earning daily profit.", "promotion", "h_p3"),
 ("Operator call tomorrow, insider information from inside the company. Join the premium channel now.", "promotion", "h_p4"),
 ("Download our APK to trade with 5x leverage. Assured returns, withdraw anytime.", "promotion", "h_p5"),
 ("Hello sir, I am from a research team. Add 50k and we will double your money in one month.", "promotion", "h_p6"),
 ("Abhi join karo, pakka profit milega. Limited seats, pehle paise bhejo aur call lo.", "promotion", "h_p7"),
 ("पक्का मुनाफा! हमारे VIP ग्रुप से जुड़ें, आज ही जुड़ें और पैसा दोगुना करें।", "promotion", "h_p8"),
 ("Our AI trading bot made 300% last month. Subscribe now, spots are filling fast.", "promotion", "h_p9"),
 ("Mutual fund guru reveals secret formula for 25% monthly returns. Buy the course today.", "promotion", "h_p10"),
 ("Last chance to enter the IPO allotment group. Send money first, allotment guaranteed.", "promotion", "h_p11"),
 ("Free tips today, premium tips tomorrow. Sell now, target 3 hit yesterday, join channel for more.", "promotion", "h_p12"),
 # promotion, subtle (few trigger words)
 ("Our members are already up big this month. The next batch of the paid group opens tonight, message me.", "promotion", "h_p13"),
 ("Screenshot of yesterday's profit attached. Want the same calls? Subscribe to the private channel.", "promotion", "h_p14"),
 ("This stock is about to explode, buy before the news is out. Join our channel to see the exit price.", "promotion", "h_p15"),
 ("Retire early with our signals. Pay the one-time fee and we will send the entry and exit levels daily.", "promotion", "h_p16"),
 ("Expert call: buy now, sell on target. Only subscribers get the stop loss. Subscribe today.", "promotion", "h_p17"),
 ("A friend of mine made lakhs from this app. Install it and I will guide you step by step.", "promotion", "h_p18"),
 # education, plain
 ("A mutual fund pools money from many investors. Returns depend on the market and are not guaranteed.", "education", "h_e1"),
 ("Diversification means spreading money across different assets so one loss hurts less. Investments can lose value.", "education", "h_e2"),
 ("An SIP lets you invest a fixed amount every month. It does not remove market risk.", "education", "h_e3"),
 ("The P/E ratio compares a share price to its earnings per share. Compare it with similar companies.", "education", "h_e4"),
 ("Before investing, check whether the adviser is registered on the SEBI website.", "education", "h_e5"),
 ("An index fund tracks a market index such as the Nifty 50. Fees are usually low, returns still move with the market.", "education", "h_e6"),
 ("Inflation reduces what your money can buy. Many people keep an emergency fund in a savings account.", "education", "h_e7"),
 ("Today the market closed higher. This report is not an investment recommendation.", "education", "h_e8"),
 ("म्यूचुअल फंड कई निवेशकों का पैसा मिलाकर निवेश करता है। रिटर्न की कोई गारंटी नहीं होती।", "education", "h_e9"),
 ("निवेश से पहले जोखिम समझें और अलग अलग जगह पैसा लगाएं। यह निवेश सलाह नहीं है।", "education", "h_e10"),
 ("A stop-loss order sells a share when it falls to a price you set. It can still fill below that price in a fast market.", "education", "h_e11"),
 ("Compound interest means you earn returns on your earlier returns. Starting early helps over long periods.", "education", "h_e12"),
 # education with scary words (warnings, awareness, disclaimers) - hard negatives
 ("Beware of guaranteed returns. Never transfer money to an unknown person.", "education", "h_e13"),
 ("SEBI warns: no one can promise assured returns in the stock market. Do not pay anyone for sure shot tips.", "education", "h_e14"),
 ("Fake trading apps often ask you to download an APK. Install apps only from official stores.", "education", "h_e15"),
 ("Scammers say act now and limited seats to rush you. Take time and check the offer independently.", "education", "h_e16"),
 ("Join our paid course about diversification. Education only, no guaranteed returns.", "education", "h_e17"),
 ("Webinar for beginners on how mutual funds work. Free to attend, not investment advice, no tips will be given.", "education", "h_e18"),
 ("सावधान रहें: पक्का मुनाफा या पैसा दोगुना करने का वादा अक्सर धोखा होता है।", "education", "h_e19"),
 ("Our newsletter explains market basics each week. We do not give buy or sell calls. Investments are subject to market risk.", "education", "h_e20"),
 ("Insider information is illegal to trade on. If someone offers secret tips, report it and do not pay.", "education", "h_e21"),
 ("A registration number in a message can be copied. Verify the adviser on the official SEBI site first.", "education", "h_e22"),
]

# ---- Generated rows: skeleton families. Group = skeleton id, so a skeleton never spans train and test. ----
ASSET = ["Nifty", "Bank Nifty", "a small-cap stock", "this penny stock", "crypto", "an upcoming IPO", "gold ETF", "options trading", "intraday trading"]
PCT = ["20%", "30%", "40%", "50%", "100%", "200%"]
DAYS = ["3", "5", "7", "10", "15", "30"]
FEE = ["499", "999", "1500", "2999", "4999"]
PROMO_SK = [
 "Guaranteed {p} returns in {d} days on {a}. Join our VIP group today, pay Rs {f} to start.",
 "{a}: sure shot call, buy now, target in {d} days. Subscribe for Rs {f} and get daily calls.",
 "Double your money with {a} in {d} days. Limited seats, pay first and we send the details.",
 "Insider tip on {a}. Our operator confirmed {p} profit. Join the premium channel, last chance.",
 "Assured {p} profit from {a}. Download our APK and deposit now, withdraw anytime.",
 "Daily profit from {a}, no risk. Pay Rs {f} today and our expert will handle your trades.",
 "Abhi join karo: {a} me {p} pakka profit {d} din me. Pehle paise bhejo, seats limited.",
 "{a} secret formula revealed. Members made {p} in {d} days. Act now, join today.",
 "Our team called {a} before the jump. Next call goes out tonight, Rs {f} gets you in the paid group.",
 "Earn {p} in {d} days with {a}. Send money to my personal account and I will trade for you.",
 "Free demo, then {p} profit guarantee on {a}. Install this app, limited offer, join today.",
]
EDU_SK = [
 "{a} carries risk and returns are not guaranteed. This is general education, not a recommendation.",
 "How does {a} work? Prices move with demand and supply, and you can lose part or all of your money. Read the offer documents first.",
 "A beginner note on {a}: start small, spread your money across assets, and never invest money you cannot afford to lose.",
 "Be careful if anyone promises {p} returns from {a} in {d} days. Genuine investments cannot promise that. Check registration on the SEBI website.",
 "Class notes: risk and return in {a}. Higher possible returns usually come with higher possible losses. Not investment advice.",
 "Awareness: fraudsters push {a} with pay first and act now messages. Do not pay anyone for sure shot calls.",
 "Learn about {a}: what it is, who regulates it, and what fees apply. We do not give buy or sell tips.",
 "Market update: {a} moved today. This summary is informational and is not an investment recommendation.",
 "Exam prep: define {a} and list two risks. Remember past performance does not predict future results.",
 "Our research desk explains {a} in plain language. No promises of {p} or any return; markets can fall for {d} days or longer.",
 "Reminder from the investor helpline: before you put money in {a}, check who is asking and why. Fees of Rs {f} paid to unknown people are a warning sign.",
]
# Light paraphrase swaps so the same skeleton is not identical text.
SWAPS = [("Join", "Enter"), ("today", "now"), ("Subscribe", "Register"), ("our", "the"), ("expert", "analyst")]


def para(s):
    for a, b in SWAPS:
        if random.random() < .3:
            s = s.replace(a, b, 1)
    return s


rows = []
for i, sk in enumerate(PROMO_SK):
    for _ in range(14):
        rows.append((para(sk.format(a=random.choice(ASSET), p=random.choice(PCT), d=random.choice(DAYS), f=random.choice(FEE))), "promotion", f"g_p{i}"))
for i, sk in enumerate(EDU_SK):
    for _ in range(14):
        rows.append((para(sk.format(a=random.choice(ASSET), p=random.choice(PCT), d=random.choice(DAYS), f=random.choice(FEE))), "education", f"g_e{i}"))
rows += HAND

# Dedupe exact text, keep first.
seen, uniq = set(), []
for t, l, g in rows:
    k = t.strip().lower()
    if k not in seen:
        seen.add(k)
        uniq.append((t, l, g))

# Group-aware split: ~25% of groups per label go to test.
groups = {}
for t, l, g in uniq:
    groups.setdefault((l, g), []).append(t)
test_groups = set()
for label in ("promotion", "education"):
    gs = sorted(g for (l, g) in groups if l == label)
    random.shuffle(gs)
    total = sum(len(groups[(label, g)]) for g in gs)
    got = 0
    for g in gs:
        if got >= total * .25:
            break
        test_groups.add(g)
        got += len(groups[(label, g)])

OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open("w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["text", "label", "group_id", "split", "source"])
    for t, l, g in uniq:
        src = "hand_written_synthetic" if g.startswith("h_") else "template_generated_synthetic"
        w.writerow([t, l, g, "test" if g in test_groups else "train", src])
print(len(uniq), "rows;", sum(1 for _, _, g in uniq if g in test_groups), "in test")
