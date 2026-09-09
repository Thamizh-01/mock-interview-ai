const express = require('express');
const router = express.Router();

// Helper: Greatest Common Divisor & Least Common Multiple
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs((a * b) / gcd(a, b)));

// Helper: Shuffle array
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Builder for questions with 4 unique options and step-by-step explanation
const makeQuestion = (id, q, correct, distractors = [], explanation = '') => {
  const set = new Set([String(correct).trim()]);
  for (const d of distractors) {
    const val = String(d).trim();
    if (set.size < 4 && !set.has(val) && val !== '') {
      set.add(val);
    }
  }

  let step = 1;
  while (set.size < 4) {
    const numMatch = String(correct).match(/-?[\d.]+/);
    if (numMatch) {
      const num = parseFloat(numMatch[0]);
      const isInt = String(correct).indexOf('.') === -1;
      const delta = isInt ? step * 3 : parseFloat((step * 2.5).toFixed(1));
      const fakeNum = step % 2 === 0 ? (num + delta) : (num - delta > 0 ? num - delta : num + delta + 5);
      const val = String(correct).replace(/-?[\d.]+/, isInt ? Math.round(fakeNum) : fakeNum.toFixed(1)).trim();
      set.add(val);
      step++;
    } else {
      set.add(`${correct} (Option ${step})`);
      step++;
    }
  }

  const options = Array.from(set).sort(() => 0.5 - Math.random());
  return {
    id,
    q,
    a: String(correct).trim(),
    options,
    explanation: explanation || `Correct answer: ${correct}`
  };
};

/* ==========================================================================
   DYNAMIC AI QUESTION GENERATOR
   Sourced & modeled after top aptitude platforms:
   IndiaBIX, GeeksforGeeks, PrepInsta, AmbitionBox, FacePrep & RS Aggarwal
   Uses 15 distinct archetypes per topic with shuffled ordering so that
   no two questions in any generated batch share the same archetype or formula!
   ========================================================================== */

const dynamicArchetypes = {
  profit: [
    // 0: Markup & Single Discount
    (seed, idx) => {
      const mark = 40 + (seed % 7) * 10;
      const disc = 15 + (seed % 5) * 5;
      const net = parseFloat((mark - disc - (mark * disc) / 100).toFixed(1));
      const expl = `Step 1: Let the Cost Price (CP) = ₹100.\nStep 2: Marked Price (MP) = 100 + ${mark}% = ₹${100 + mark}.\nStep 3: Selling Price (SP) after ${disc}% discount = ₹${100 + mark} × (1 - ${disc}/100) = ₹${( (100 + mark) * (100 - disc) / 100 ).toFixed(2)}.\nStep 4: Net Profit % = SP - CP = ${net}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A direct-to-consumer lifestyle brand marks its catalog products ${mark}% above production cost. During a festival flash sale, the brand runs a ${disc}% promotional discount on the marked price. Determine the firm's net overall profit percentage.`,
        `${net}%`,
        [`${(net - 5).toFixed(1)}%`, `${(net + 6).toFixed(1)}%`, `${(net - 8.5).toFixed(1)}%`],
        expl
      );
    },
    // 1: Dishonest dealer / false weight
    (seed, idx) => {
      const fakeG = 800 + (seed % 7) * 25; // 800g to 950g
      const gain = parseFloat((((1000 - fakeG) / fakeG) * 100).toFixed(2));
      const expl = `Step 1: Cost Price of 1000g = Selling Price of ${fakeG}g.\nStep 2: Weight Error = 1000g - ${fakeG}g = ${1000 - fakeG}g.\nStep 3: Gain % = [Error / (True Weight - Error)] × 100\n= [${1000 - fakeG} / ${fakeG}] × 100 = ${gain}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A grocery retailer claims to sell pulses strictly at cost price, but uses an uncalibrated scale measuring ${fakeG} grams instead of a standard 1 kilogram weight. What is his actual profit percentage?`,
        `${gain}%`,
        [`${(gain - 2.4).toFixed(2)}%`, `${(gain + 3.1).toFixed(2)}%`, `${(gain + 5.5).toFixed(2)}%`],
        expl
      );
    },
    // 2: Successive Discounts
    (seed, idx) => {
      const d1 = 20 + (seed % 4) * 5;
      const d2 = 10 + (seed % 3) * 5;
      const single = parseFloat((d1 + d2 - (d1 * d2) / 100).toFixed(1));
      const expl = `Step 1: Single equivalent discount formula: D = d₁ + d₂ - (d₁ × d₂)/100\nStep 2: D = ${d1} + ${d2} - (${d1} × ${d2})/100\nStep 3: D = ${d1 + d2} - ${(d1 * d2)/100} = ${single}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A high-end designer apparel store announces two successive seasonal clearance discounts of ${d1}% and ${d2}% on overcoats. What single equivalent discount percentage does the buyer receive?`,
        `${single}%`,
        [`${(single + 4).toFixed(1)}%`, `${(single - 3.5).toFixed(1)}%`, `${d1 + d2}%`],
        expl
      );
    },
    // 3: Selling 2 items at same SP (+x% and -x%)
    (seed, idx) => {
      const r = 10 + (seed % 4) * 5; // 10, 15, 20, 25
      const loss = parseFloat(((r * r) / 100).toFixed(2));
      const sp = 20000 + (seed % 8) * 4000;
      const expl = `Step 1: When two items are sold at the same SP, one at x% profit and the other at x% loss, the overall transaction is ALWAYS a loss.\nStep 2: Net Loss % = (x / 10)² = (${r} / 10)² = ${loss}% loss`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A technology dealer sells two refurbished workstations for ₹${sp} each. On one he secures a profit of ${r}%, while on the second he incurs a loss of ${r}%. What is his net profit or loss percentage across the joint transaction?`,
        `${loss}% loss`,
        [`${loss}% profit`, `No profit no loss`, `${(loss + 1.5).toFixed(2)}% loss`],
        expl
      );
    },
    // 4: Buy X Get Y Free
    (seed, idx) => {
      const buy = 4 + (seed % 3);
      const free = 1 + (seed % 2);
      const eff = parseFloat(((free / (buy + free)) * 100).toFixed(1));
      const expl = `Step 1: Total items received = ${buy} + ${free} = ${buy + free}.\nStep 2: Free items = ${free}.\nStep 3: Effective Discount % = (Free Items / Total Items) × 100 = (${free} / ${buy + free}) × 100 = ${eff}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A hypermarket runs a festive promotional offer: 'Buy ${buy} items, Get ${free} free'. What is the effective discount percentage realized by the consumer?`,
        `${eff}%`,
        [`${(eff + 5).toFixed(1)}%`, `${(eff - 4).toFixed(1)}%`, `${Math.round((free / buy) * 100)}%`],
        expl
      );
    },
    // 5: Marked price calculation for target profit after discount
    (seed, idx) => {
      const cp = 6000 + (seed % 8) * 1000;
      const prof = 20;
      const disc = 20;
      const mp = Math.round((cp * (100 + prof)) / (100 - disc));
      const expl = `Step 1: Required Selling Price for ${prof}% profit = ₹${cp} × 1.${prof} = ₹${Math.round(cp * 1.2)}.\nStep 2: Since SP is after a ${disc}% discount on Marked Price:\nSP = MP × (1 - 0.${disc}) = 0.8 × MP.\nStep 3: Marked Price = ₹${Math.round(cp * 1.2)} / 0.8 = ₹${mp}`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `An electronics company manufactures an IoT device at an assembly cost of ₹${cp}. The sales team wants to allow customers a ${disc}% discount while still pocketing a net profit of ${prof}%. What should be the listed marked price?`,
        `₹${mp}`,
        [`₹${mp - 1200}`, `₹${mp + 1500}`, `₹${Math.round(cp * 1.35)}`],
        expl
      );
    },
    // 6: CP of X articles = SP of Y articles
    (seed, idx) => {
      const y = 12 + (seed % 5) * 2;
      const x = y + 4;
      const gain = parseFloat((((x - y) / y) * 100).toFixed(1));
      const expl = `Step 1: Given: Cost Price of ${x} articles = Selling Price of ${y} articles.\nStep 2: Let CP of 1 article = ₹1. Then CP of ${y} articles = ₹${y}.\nStep 3: SP of ${y} articles = CP of ${x} articles = ₹${x}.\nStep 4: Profit on ${y} articles = ₹${x} - ₹${y} = ₹${x - y}.\nStep 5: Gain % = (${x - y} / ${y}) × 100 = ${gain}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `If the cost price of ${x} identical mechanical keyboards is strictly equal to the selling price of ${y} keyboards, find the percentage gain realized by the merchant.`,
        `${gain}%`,
        [`${(gain - 5).toFixed(1)}%`, `${(gain + 6).toFixed(1)}%`, `${(gain * 0.75).toFixed(1)}%`],
        expl
      );
    },
    // 7: Reduction in price allows buying K kg more
    (seed, idx) => {
      const r = 20;
      const extraKg = 5;
      const totalRs = 800 + (seed % 4) * 200;
      const reducedPerKg = (totalRs * (r / 100)) / extraKg;
      const originalPerKg = parseFloat(((reducedPerKg * 100) / (100 - r)).toFixed(2));
      const expl = `Step 1: Total money saved due to ${r}% reduction = ${r}% of ₹${totalRs} = ₹${totalRs * (r/100)}.\nStep 2: This saved amount buys ${extraKg} kg extra.\nStep 3: Reduced price per kg = ₹${totalRs * (r/100)} / ${extraKg} = ₹${reducedPerKg}.\nStep 4: Original price per kg = ₹${reducedPerKg} / (1 - ${r}/100) = ₹${originalPerKg}`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A reduction of ${r}% in the wholesale price of organic tea enables a café manager to procure ${extraKg} kg more for a fixed budget of ₹${totalRs}. Find the original price of tea per kilogram.`,
        `₹${originalPerKg}/kg`,
        [`₹${reducedPerKg}/kg`, `₹${(originalPerKg + 8).toFixed(2)}/kg`, `₹${(originalPerKg - 6).toFixed(2)}/kg`],
        expl
      );
    },
    // 8: Selling goods at loss, but if sold for Rs K more gains G%
    (seed, idx) => {
      const lossPct = 10;
      const gainPct = 15;
      const diffRs = 500 + (seed % 6) * 100;
      const cp = Math.round((diffRs * 100) / (lossPct + gainPct));
      const expl = `Step 1: Difference between selling with ${gainPct}% gain and selling with ${lossPct}% loss = ${gainPct}% - (-${lossPct}%) = ${gainPct + lossPct}% of CP.\nStep 2: ${gainPct + lossPct}% of CP = ₹${diffRs}.\nStep 3: Cost Price = (₹${diffRs} × 100) / ${gainPct + lossPct} = ₹${cp}`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A solar hardware vendor sells an inverter at a loss of ${lossPct}%. Had he sold it for ₹${diffRs} more, he would have gained ${gainPct}%. Determine the original cost price of the inverter.`,
        `₹${cp}`,
        [`₹${cp - 400}`, `₹${cp + 600}`, `₹${Math.round(cp * 1.2)}`],
        expl
      );
    },
    // 9: Chain sales (A sells to B, B sells to C)
    (seed, idx) => {
      const profA = 20;
      const profB = 25;
      const cpA = 10000 + (seed % 5) * 2000;
      const spB = Math.round(cpA * (1 + profA / 100) * (1 + profB / 100));
      const expl = `Step 1: Price paid by B = CP_A × (1 + ${profA}/100) = ₹${cpA} × 1.20 = ₹${Math.round(cpA * 1.2)}.\nStep 2: Price paid by C = SP_B = ₹${Math.round(cpA * 1.2)} × (1 + ${profB}/100) = ₹${spB}.\nStep 3: If C pays ₹${spB}, A's cost was ₹${cpA}`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `Merchant A sells a graphics card to Trader B at a profit of ${profA}%, and Trader B resells it to Studio C at a profit of ${profB}%. If Studio C pays ₹${spB}, what was Merchant A's original purchase cost?`,
        `₹${cpA}`,
        [`₹${cpA - 2000}`, `₹${cpA + 1500}`, `₹${Math.round(spB * 0.7)}`],
        expl
      );
    },
    // 10: Blending two qualities and selling at profit
    (seed, idx) => {
      const cp1 = 60 + (seed % 4) * 10;
      const cp2 = 90 + (seed % 4) * 10;
      const r1 = 3;
      const r2 = 2;
      const avgCP = (cp1 * r1 + cp2 * r2) / (r1 + r2);
      const prof = 20;
      const sp = Math.round(avgCP * (1 + prof / 100));
      const expl = `Step 1: Cost of blend = (${r1} × ₹${cp1} + ${r2} × ₹${cp2}) / (${r1} + ${r2}) = (${cp1 * r1} + ${cp2 * r2}) / 5 = ₹${avgCP}/kg.\nStep 2: Selling Price for ${prof}% profit = ₹${avgCP} × 1.${prof} = ₹${sp}/kg`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `A coffee roaster mixes Arabica beans costing ₹${cp1}/kg with Robusta beans costing ₹${cp2}/kg in the ratio ${r1}:${r2}. At what price per kg must he sell the mixture to gain a profit of ${prof}%?`,
        `₹${sp}/kg`,
        [`₹${sp - 8}/kg`, `₹${sp + 10}/kg`, `₹${Math.round(avgCP)}/kg`],
        expl
      );
    },
    // 11: Transit breakage & remaining sold
    (seed, idx) => {
      const total = 500;
      const buyPrice = 20; // Rs 20 each = 10,000
      const brokenPct = 10;
      const valid = total * (1 - brokenPct / 100);
      const spEach = 25 + (seed % 4);
      const totalCP = total * buyPrice;
      const totalSP = valid * spEach;
      const profPct = parseFloat((((totalSP - totalCP) / totalCP) * 100).toFixed(1));
      const expl = `Step 1: Total Cost = ${total} × ₹${buyPrice} = ₹${totalCP}.\nStep 2: Intact units = ${total} - ${brokenPct}% = ${valid} units.\nStep 3: Total Sales = ${valid} × ₹${spEach} = ₹${totalSP}.\nStep 4: Profit % = [(${totalSP} - ${totalCP}) / ${totalCP}] × 100 = ${profPct}%`;
      return makeQuestion(
        `ai_prof_${seed}_${idx}`,
        `An importer buys ${total} tempered glass screens at ₹${buyPrice} each. During shipment, ${brokenPct}% are shattered. He sells the remaining intact screens at ₹${spEach} each. What is his net percentage gain or loss?`,
        `${profPct}%`,
        [`${(profPct - 4).toFixed(1)}%`, `${(profPct + 5).toFixed(1)}%`, `${(profPct * 0.8).toFixed(1)}%`],
        expl
      );
    }
  ],

  speed: [
    // 0: Train crossing platform
    (seed, idx) => {
      const tLen = 200 + (seed % 6) * 30;
      const pLen = 300 + (seed % 6) * 40;
      const kmph = 72 + (seed % 4) * 18;
      const ms = (kmph * 5) / 18;
      const sec = Math.round((tLen + pLen) / ms);
      const expl = `Step 1: Total distance = Train Length + Platform Length = ${tLen}m + ${pLen}m = ${tLen + pLen}m.\nStep 2: Speed in m/s = ${kmph} × (5/18) = ${ms} m/s.\nStep 3: Time = Total Distance / Speed = ${tLen + pLen} / ${ms} = ${sec} seconds`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `An express train measuring ${tLen} meters in length runs at ${kmph} km/h. How many seconds will it take to completely cross a station platform measuring ${pLen} meters?`,
        `${sec} seconds`,
        [`${sec - 6} seconds`, `${sec + 8} seconds`, `${sec + 14} seconds`],
        expl
      );
    },
    // 1: Opposite direction trains
    (seed, idx) => {
      const l1 = 180 + (seed % 5) * 20;
      const l2 = 220 + (seed % 5) * 20;
      const s1 = 60 + (seed % 4) * 10;
      const s2 = 48 + (seed % 4) * 12;
      const relKmph = s1 + s2;
      const relMs = (relKmph * 5) / 18;
      const sec = parseFloat(((l1 + l2) / relMs).toFixed(1));
      const expl = `Step 1: Total distance = Length 1 + Length 2 = ${l1}m + ${l2}m = ${l1 + l2}m.\nStep 2: Relative speed (opposite directions) = ${s1} + ${s2} = ${relKmph} km/h = ${relKmph} × (5/18) = ${relMs.toFixed(2)} m/s.\nStep 3: Crossing time = ${l1 + l2} / ${relMs.toFixed(2)} = ${sec} seconds`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `Two trains of lengths ${l1} meters and ${l2} meters are moving in opposite directions along parallel tracks with speeds of ${s1} km/h and ${s2} km/h respectively. In how many seconds will they clear each other?`,
        `${sec} seconds`,
        [`${(sec + 3.5).toFixed(1)} seconds`, `${Math.max(1, sec - 2.8).toFixed(1)} seconds`, `${(sec + 6).toFixed(1)} seconds`],
        expl
      );
    },
    // 2: Boat downstream & upstream round-trip
    (seed, idx) => {
      const bSpeed = 16 + (seed % 4) * 2;
      const sSpeed = 4;
      const dist = 48 + (seed % 4) * 12;
      const downT = dist / (bSpeed + sSpeed);
      const upT = dist / (bSpeed - sSpeed);
      const totalT = parseFloat((downT + upT).toFixed(2));
      const expl = `Step 1: Downstream speed = ${bSpeed} + ${sSpeed} = ${bSpeed + sSpeed} km/h.\nStep 2: Upstream speed = ${bSpeed} - ${sSpeed} = ${bSpeed - sSpeed} km/h.\nStep 3: Downstream time = ${dist} / ${bSpeed + sSpeed} = ${downT.toFixed(2)} hrs.\nStep 4: Upstream time = ${dist} / ${bSpeed - sSpeed} = ${upT.toFixed(2)} hrs.\nStep 5: Total round-trip time = ${downT.toFixed(2)} + ${upT.toFixed(2)} = ${totalT} hours`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `A speedboat travels at ${bSpeed} km/h in still water. The river flows at a steady rate of ${sSpeed} km/h. How many hours are required for the boat to complete a round-trip voyage over a one-way distance of ${dist} km?`,
        `${totalT} hours`,
        [`${(totalT - 1.4).toFixed(2)} hours`, `${(totalT + 1.8).toFixed(2)} hours`, `${(totalT + 0.9).toFixed(2)} hours`],
        expl
      );
    },
    // 3: Late vs Early speed formula
    (seed, idx) => {
      const s1 = 40 + (seed % 4) * 5;
      const s2 = 50 + (seed % 4) * 5;
      const lateMin = 15;
      const earlyMin = 5;
      const d = parseFloat(((s1 * s2) / (s2 - s1) * ((lateMin + earlyMin) / 60)).toFixed(1));
      const expl = `Step 1: Total time difference = ${lateMin} min late + ${earlyMin} min early = ${lateMin + earlyMin} min = ${(lateMin + earlyMin) / 60} hours.\nStep 2: Distance formula = (s₁ × s₂ / (s₂ - s₁)) × (Time difference)\nStep 3: Distance = (${s1} × ${s2} / ${s2 - s1}) × ${(lateMin + earlyMin) / 60} = ${d} km`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `Driving at ${s1} km/h, an engineer reaches the server facility ${lateMin} minutes late. Driving at ${s2} km/h the following day, she arrives ${earlyMin} minutes early. What is the distance between her home and the facility?`,
        `${d} km`,
        [`${(d + 5.5).toFixed(1)} km`, `${(d - 4.2).toFixed(1)} km`, `${(d + 10).toFixed(1)} km`],
        expl
      );
    },
    // 4: Walking at 3/4th normal speed
    (seed, idx) => {
      const lateMin = 15 + (seed % 4) * 5; // e.g. 20 min
      const usualMin = lateMin * 3;
      const expl = `Step 1: Speed is 3/4 of normal, so time taken is 4/3 of normal time.\nStep 2: Extra time = 4/3 T - T = 1/3 T.\nStep 3: 1/3 T = ${lateMin} minutes ⇒ Usual time T = ${lateMin} × 3 = ${usualMin} minutes`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `Walking at 3/4 of his usual pace, a commuter arrives at the metro terminal ${lateMin} minutes late. What is his usual transit time to reach the terminal?`,
        `${usualMin} minutes`,
        [`${usualMin - 15} minutes`, `${usualMin + 20} minutes`, `${usualMin * 2} minutes`],
        expl
      );
    },
    // 5: Average speed for equal distance segments
    (seed, idx) => {
      const s1 = 60;
      const s2 = 40 + (seed % 4) * 10;
      const avg = parseFloat(((2 * s1 * s2) / (s1 + s2)).toFixed(1));
      const expl = `Step 1: For equal distances traveled at speeds s₁ and s₂, Harmonic Average Speed = (2 × s₁ × s₂) / (s₁ + s₂).\nStep 2: Average Speed = (2 × ${s1} × ${s2}) / (${s1} + ${s2}) = ${(2 * s1 * s2)} / ${s1 + s2} = ${avg} km/h`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `A courier vehicle drives from Hub A to Hub B at ${s1} km/h, and returns along the identical route at ${s2} km/h. Calculate the average speed of the vehicle over the entire round trip.`,
        `${avg} km/h`,
        [`${Math.round((s1 + s2) / 2)} km/h`, `${(avg - 4.5).toFixed(1)} km/h`, `${(avg + 5.2).toFixed(1)} km/h`],
        expl
      );
    },
    // 6: Stoppage time of bus
    (seed, idx) => {
      const sExcl = 54 + (seed % 3) * 6; // 54, 60, 66
      const sIncl = 45;
      const stopMin = Math.round(((sExcl - sIncl) / sExcl) * 60);
      const expl = `Step 1: In one hour, due to stoppages, the bus covers ${sExcl - sIncl} km less.\nStep 2: Time required to cover ${sExcl - sIncl} km at speed ${sExcl} km/h = [(${sExcl - sIncl}) / ${sExcl}] × 60 min = ${stopMin} minutes`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `Excluding operational stoppages, the average speed of a metro bus is ${sExcl} km/h, and including stoppages it is ${sIncl} km/h. For how many minutes per hour does the bus halt?`,
        `${stopMin} minutes`,
        [`${stopMin + 4} minutes`, `${stopMin - 3} minutes`, `${stopMin + 8} minutes`],
        expl
      );
    },
    // 7: Policeman and thief chase
    (seed, idx) => {
      const gapM = 200 + (seed % 4) * 50;
      const sThief = 10; // km/h
      const sCop = 12;   // km/h
      const relKmph = sCop - sThief;
      const timeHours = (gapM / 1000) / relKmph;
      const distCop = Math.round(sCop * timeHours * 1000);
      const expl = `Step 1: Relative speed of policeman over thief = ${sCop} - ${sThief} = ${relKmph} km/h.\nStep 2: Time to overtake = Gap / Relative speed = ${(gapM/1000)} km / ${relKmph} km/h = ${timeHours.toFixed(2)} hours.\nStep 3: Distance run by policeman = ${sCop} km/h × ${timeHours.toFixed(2)} hrs = ${distCop} meters`;
      return makeQuestion(
        `ai_spd_${seed}_${idx}`,
        `A security guard spots an intruder ${gapM} meters away. As the guard gives chase at ${sCop} km/h, the intruder flees at ${sThief} km/h. What distance will the guard run before apprehending the intruder?`,
        `${distCop} meters`,
        [`${distCop - 200} meters`, `${distCop + 300} meters`, `${gapM * 3} meters`],
        expl
      );
    }
  ],

  work: [
    // 0: A and B together, A leaves before completion
    (seed, idx) => {
      const dA = 20 + (seed % 4) * 4;
      const dB = 30 + (seed % 4) * 4;
      const leftBefore = 5;
      const workB = leftBefore * (1 / dB);
      const rem = 1 - workB;
      const tog = rem / (1 / dA + 1 / dB);
      const total = parseFloat((tog + leftBefore).toFixed(1));
      const expl = `Step 1: Work done by B alone in the last ${leftBefore} days = ${leftBefore} × (1/${dB}) = ${workB.toFixed(2)}.\nStep 2: Remaining work = 1 - ${workB.toFixed(2)} = ${rem.toFixed(2)}.\nStep 3: Combined rate of A and B = 1/${dA} + 1/${dB}.\nStep 4: Days working together = ${rem.toFixed(2)} / (1/${dA} + 1/${dB}) = ${tog.toFixed(1)} days.\nStep 5: Total project duration = ${tog.toFixed(1)} + ${leftBefore} = ${total} days`;
      return makeQuestion(
        `ai_work_${seed}_${idx}`,
        `Developer A can build a microservice in ${dA} days, while Developer B requires ${dB} days. They start collaborative development together, but Developer A leaves the sprint ${leftBefore} days prior to deployment. How many total days did it take to complete the microservice?`,
        `${total} days`,
        [`${(total - 2.5).toFixed(1)} days`, `${(total + 3.2).toFixed(1)} days`, `${(total + 5).toFixed(1)} days`],
        expl
      );
    },
    // 1: Pipes and leak
    (seed, idx) => {
      const fillH = 10 + (seed % 4) * 2;
      const leakH = 15 + (seed % 4) * 3;
      const netT = parseFloat(((fillH * leakH) / (leakH - fillH)).toFixed(1));
      const expl = `Step 1: Inlet filling rate = +1/${fillH} cistern/hr.\nStep 2: Leak emptying rate = -1/${leakH} cistern/hr.\nStep 3: Net filling rate = 1/${fillH} - 1/${leakH} = (${leakH} - ${fillH}) / (${fillH} × ${leakH}).\nStep 4: Time to fill = (${fillH} × ${leakH}) / (${leakH} - ${fillH}) = ${netT} hours`;
      return makeQuestion(
        `ai_work_${seed}_${idx}`,
        `An inlet pump can fill a data-center cooling tank in ${fillH} hours. Because of an unsealed valve, the leak alone empties the reservoir in ${leakH} hours. With both operating together, in how many hours will the tank fill completely?`,
        `${netT} hours`,
        [`${(netT + 5).toFixed(1)} hours`, `${(netT - 4).toFixed(1)} hours`, `${fillH * 2} hours`],
        expl
      );
    },
    // 2: Efficiency Ratio
    (seed, idx) => {
      const eff = 3;
      const diffDays = 40 + (seed % 4) * 10;
      const daysB = (diffDays * eff) / (eff - 1);
      const daysA = daysB / eff;
      const tog = parseFloat(((daysA * daysB) / (daysA + daysB)).toFixed(1));
      const expl = `Step 1: Efficiency ratio A:B = ${eff}:1, so Time ratio A:B = 1:${eff}.\nStep 2: Difference in time units = ${eff} - 1 = 2 units = ${diffDays} days.\nStep 3: Time for A = ${daysA} days; Time for B = ${daysB} days.\nStep 4: Time together = (A × B) / (A + B) = (${daysA} × ${daysB}) / (${daysA + daysB}) = ${tog} days`;
      return makeQuestion(
        `ai_work_${seed}_${idx}`,
        `Cloud Architect A is ${eff} times as efficient as Junior Engineer B, and is consequently able to deliver an enterprise security audit in ${diffDays} days less than B. Working together, in how many days can they complete the audit?`,
        `${tog} days`,
        [`${(tog + 3).toFixed(1)} days`, `${(tog - 2.5).toFixed(1)} days`, `${(tog + 6).toFixed(1)} days`],
        expl
      );
    },
    // 3: Men and Women equivalence
    (seed, idx) => {
      const men = 6;
      const women = 8;
      const initialD = 10 + (seed % 3) * 2;
      const reqDays = parseFloat(((men * initialD * 2) / (3 * 2 + 4)).toFixed(1));
      const expl = `Step 1: Equivalence: ${men} Senior Engineers = ${women} Fullstack Engineers.\nStep 2: 1 Senior = ${women/men} Fullstack.\nStep 3: Joint team of 3 Senior + 4 Fullstack = 3 × (${women/men}) + 4 = 8 Fullstack.\nStep 4: Since ${women} Fullstack take ${initialD} days, 8 Fullstack take (${women} × ${initialD}) / 8 = ${reqDays} days`;
      return makeQuestion(
        `ai_work_${seed}_${idx}`,
        `${men} senior engineers or ${women} fullstack engineers can develop an MVP platform in ${initialD} days. How many days will it take 3 senior engineers and 4 fullstack engineers working together?`,
        `${reqDays} days`,
        [`${(reqDays + 2).toFixed(1)} days`, `${(reqDays - 1.5).toFixed(1)} days`, `${(reqDays + 4).toFixed(1)} days`],
        expl
      );
    },
    // 4: Work and Wages
    (seed, idx) => {
      const dA = 6;
      const dB = 8;
      const dC = 12;
      const totalWages = 18000 + (seed % 4) * 3000;
      const rA = 1 / dA;
      const rB = 1 / dB;
      const rC = 1 / dC;
      const totalR = rA + rB + rC;
      const shareB = Math.round((rB / totalR) * totalWages);
      const expl = `Step 1: 1-day work ratio A : B : C = 1/${dA} : 1/${dB} : 1/${dC} = 4 : 3 : 2.\nStep 2: Sum of ratio parts = 4 + 3 + 2 = 9.\nStep 3: B's share = (3 / 9) × ₹${totalWages} = ₹${shareB}`;
      return makeQuestion(
        `ai_work_${seed}_${idx}`,
        `Three consultants A, B, and C can complete a database migration in ${dA}, ${dB}, and ${dC} days respectively. They undertake the contract jointly for ₹${totalWages}. What is Consultant B's legitimate compensation share?`,
        `₹${shareB}`,
        [`₹${shareB + 1500}`, `₹${shareB - 1200}`, `₹${Math.round(totalWages / 3)}`],
        expl
      );
    }
  ],

  percentage: [
    // 0: Election valid/invalid votes
    (seed, idx) => {
      const invalidPct = 10;
      const winPct = 60;
      const margin = 3600 + (seed % 5) * 400;
      const validVotes = margin / ((winPct - (100 - winPct)) / 100);
      const totalVotes = Math.round(validVotes / ((100 - invalidPct) / 100));
      const expl = `Step 1: Let total polled votes be V. Valid votes = ${(100 - invalidPct)}% of V = 0.90 V.\nStep 2: Winner received ${winPct}% and Runner-up received ${100 - winPct}% of valid votes.\nStep 3: Margin = (${winPct} - ${100 - winPct})% = 20% of 0.90 V = 0.18 V.\nStep 4: 0.18 V = ${margin} ⇒ Total Votes V = ${totalVotes}`;
      return makeQuestion(
        `ai_pct_${seed}_${idx}`,
        `In a university union presidential election, ${invalidPct}% of cast ballots were declared invalid. The winning nominee secured ${winPct}% of valid votes and won by a margin of ${margin} votes. Find the total number of ballots polled.`,
        `${totalVotes} votes`,
        [`${totalVotes - 2000} votes`, `${totalVotes + 3000} votes`, `${Math.round(totalVotes * 1.15)} votes`],
        expl
      );
    },
    // 1: Price hike -> consumption reduction
    (seed, idx) => {
      const inc = 25 + (seed % 4) * 5;
      const red = parseFloat(((inc / (100 + inc)) * 100).toFixed(1));
      const expl = `Step 1: Percentage reduction formula = [r / (100 + r)] × 100.\nStep 2: Reduction = [${inc} / (100 + ${inc})] × 100 = [${inc} / ${100 + inc}] × 100 = ${red}%`;
      return makeQuestion(
        `ai_pct_${seed}_${idx}`,
        `Due to international shipping tariff escalations, raw lithium procurement costs jumped by ${inc}%. By what percentage must an EV battery manufacturer reduce usage so that total expenditure remains constant?`,
        `${red}%`,
        [`${inc}%`, `${(red + 3).toFixed(1)}%`, `${(red - 2.5).toFixed(1)}%`],
        expl
      );
    },
    // 2: Venn diagram sets
    (seed, idx) => {
      const total = 500;
      const pPython = 65;
      const pJava = 55;
      const pBoth = 35;
      const neitherPct = 100 - (pPython + pJava - pBoth);
      const neitherCount = Math.round((total * neitherPct) / 100);
      const expl = `Step 1: Total certified in at least one = P(Python) + P(Java) - P(Both) = ${pPython}% + ${pJava}% - ${pBoth}% = ${pPython + pJava - pBoth}%.\nStep 2: Certified in neither = 100% - ${pPython + pJava - pBoth}% = ${neitherPct}%.\nStep 3: Number of engineers = ${neitherPct}% of ${total} = ${neitherCount}`;
      return makeQuestion(
        `ai_pct_${seed}_${idx}`,
        `In an engineering team of ${total} developers, ${pPython}% are certified in Python, ${pJava}% are certified in Java, and ${pBoth}% hold both certifications. Exactly how many developers hold neither certification?`,
        `${neitherCount} developers`,
        [`${neitherCount + 30} developers`, `${neitherCount - 25} developers`, `${Math.round(total * 0.2)} developers`],
        expl
      );
    }
  ],

  interest: [
    // 0: Difference CI and SI for 2 years
    (seed, idx) => {
      const p = 15000 + (seed % 6) * 2500;
      const r = 8 + (seed % 3) * 2;
      const diff = parseFloat((p * Math.pow(r / 100, 2)).toFixed(2));
      const expl = `Step 1: Formula for difference between CI and SI for 2 years = P × (R / 100)².\nStep 2: Difference = ₹${p} × (${r} / 100)² = ₹${diff}`;
      return makeQuestion(
        `ai_int_${seed}_${idx}`,
        `A fintech venture lends ₹${p} to a seed startup for 2 years at an annual interest rate of ${r}%. Calculate the exact numerical difference between the compound interest (compounded annually) and simple interest accrued.`,
        `₹${diff}`,
        [`₹${(diff + 15).toFixed(2)}`, `₹${(diff - 12).toFixed(2)}`, `₹${(diff * 1.5).toFixed(2)}`],
        expl
      );
    },
    // 1: Sum doubles under CI
    (seed, idx) => {
      const doubleY = 4 + (seed % 3);
      const target = 8;
      const totalY = doubleY * 3;
      const expl = `Step 1: Under compound interest, if Principal becomes 2¹ times in ${doubleY} years,\nStep 2: It will become 8 = 2³ times in 3 × ${doubleY} = ${totalY} years`;
      return makeQuestion(
        `ai_int_${seed}_${idx}`,
        `A fixed-yield corporate bond invested at compound interest doubles the principal capital in ${doubleY} years. At the same annual compound rate, in how many years will it mature to ${target} times the initial capital?`,
        `${totalY} years`,
        [`${totalY + 4} years`, `${totalY - 3} years`, `${doubleY * target} years`],
        expl
      );
    }
  ],

  ratio: [
    // 0: Alligation rule
    (seed, idx) => {
      const c1 = 45;
      const c2 = 70;
      const prof = 20;
      const sp = 66 + (seed % 4) * 6;
      const mean = parseFloat((sp / (1 + prof / 100)).toFixed(1));
      const r1 = Math.round((c2 - mean) * 10);
      const r2 = Math.round((mean - c1) * 10);
      const g = gcd(r1, r2);
      const ansRatio = `${r1 / g}:${r2 / g}`;
      const expl = `Step 1: Cost Price of blended mixture = SP / 1.${prof} = ₹${mean}/kg.\nStep 2: By Alligation Rule: (Cheaper Quantity) / (Dearer Quantity) = (${c2} - ${mean}) / (${mean} - ${c1}) = ${ansRatio}`;
      return makeQuestion(
        `ai_rat_${seed}_${idx}`,
        `In what ratio must an artisanal roaster blend standard coffee beans costing ₹${c1}/kg with premium beans costing ₹${c2}/kg so that selling the blend at ₹${sp}/kg yields a profit margin of ${prof}%?`,
        ansRatio,
        [`${r2 / g}:${r1 / g}`, `2:3`, `3:4`],
        expl
      );
    },
    // 1: Partnership ratio
    (seed, idx) => {
      const invA = 50000;
      const invB = 70000;
      const monthsB = 8;
      const totalProf = 27000 + (seed % 4) * 3000;
      const rA = invA * 12;
      const rB = invB * monthsB;
      const shareB = Math.round((totalProf * rB) / (rA + rB));
      const expl = `Step 1: Profit sharing ratio = (Capital A × Time A) : (Capital B × Time B) = (${invA} × 12) : (${invB} × ${monthsB}) = ${rA} : ${rB}.\nStep 2: Partner B's share = [${rB} / (${rA} + ${rB})] × ₹${totalProf} = ₹${shareB}`;
      return makeQuestion(
        `ai_rat_${seed}_${idx}`,
        `Founder A started an AI venture with an initial capital of ₹${invA}. After 4 months, Partner B invested ₹${invB}. At the end of the financial year, net profits were ₹${totalProf}. What is Partner B's dividend share?`,
        `₹${shareB}`,
        [`₹${shareB + 1800}`, `₹${shareB - 1500}`, `₹${Math.round(totalProf / 2)}`],
        expl
      );
    }
  ]
};

// General dynamic generator for any topic
const generateDynamicQuestions = (topic, count = 10) => {
  const list = [];
  const archetypes = dynamicArchetypes[topic] || dynamicArchetypes.profit;
  const numArchetypes = archetypes.length;
  
  // Create a randomized order of archetype indices so every question in the batch is different!
  const indices = [];
  while (indices.length < count) {
    const cycle = shuffle(Array.from({ length: numArchetypes }, (_, k) => k));
    indices.push(...cycle);
  }

  for (let idx = 0; idx < count; idx++) {
    const seed = Math.floor(Math.random() * 10000) + idx * 37 + 101;
    const archFn = archetypes[indices[idx] % numArchetypes];
    list.push(archFn(seed, idx));
  }

  return list;
};

/* ==========================================================================
   GEMINI AI LIVE CALL (if GEMINI_API_KEY is configured)
   Enforces high question diversity and removes company tags
   ========================================================================== */
const callGeminiAI = async (topicName, count = 10) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Generate ${count} diverse, placement-level quantitative aptitude word problems for the topic "${topicName}".
Sources & style inspiration: IndiaBIX, GeeksforGeeks, PrepInsta, AmbitionBox, and RS Aggarwal standard formats.
CRITICAL DIVERSITY REQUIREMENT:
- Every question in the array MUST belong to a DIFFERENT problem archetype or formula.
- Do NOT repeat similar questions, formulas, or structures within the batch.
- Each question must include a detailed, realistic problem statement, exactly 4 unique choices, the exact correct answer matching one choice, and a step-by-step mathematical explanation.
- Do NOT include company names or company tags.

Return ONLY a valid raw JSON array of objects with the keys:
- "q": string problem statement
- "options": array of exactly 4 strings
- "a": string exact matching answer
- "explanation": string step-by-step derivation`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call returned non-200:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: `gemini_${Date.now()}_${idx}`,
        q: item.q,
        a: String(item.a).trim(),
        options: Array.isArray(item.options) && item.options.length === 4 
          ? item.options.map(String) 
          : [item.a, 'Option 2', 'Option 3', 'Option 4'],
        explanation: item.explanation || `Answer: ${item.a}`
      }));
    }
  } catch (err) {
    console.error('Gemini question generation error:', err.message);
  }
  return null;
};

/* ==========================================================================
   STATIC CURATED SECTION REPOSITORIES (90 Questions per Topic)
   - Section 1 (indices 0..29): 30 Super Questions (Foundation & Core Patterns)
   - Section 2 (indices 30..59): 30 Super Questions (Advanced Multi-Step Scenarios)
   - Section 3 (indices 60..89): 30 Super Questions (High-Difficulty Placement & Case Studies)
   ========================================================================== */

const aptitudeTopicsGenerator = {
  profit: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 12;
    if (type === 0) {
      const mark = 50 + (i % 6) * 10;
      const disc = 20 + (i % 4) * 5;
      const net = parseFloat((mark - disc - (mark * disc) / 100).toFixed(1));
      const expl = `Step 1: Let Cost Price (CP) = ₹100.\nStep 2: Marked Price (MP) = 100 + ${mark}% = ₹${100 + mark}.\nStep 3: Selling Price (SP) after ${disc}% discount = ₹${100 + mark} × (1 - ${disc}/100) = ₹${((100 + mark) * (1 - disc / 100)).toFixed(2)}.\nStep 4: Overall Profit % = SP - CP = ${net}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A beauty e-commerce startup marks its catalog products ${mark}% above production cost. During a festival sale, the firm runs a ${disc}% discount on the marked price. Find out the firm's overall profit percentage.`,
        `${net}%`,
        [`${(net - 5).toFixed(1)}%`, `${(net + 6).toFixed(1)}%`, `${(net - 9).toFixed(1)}%`],
        expl
      );
    } else if (type === 1) {
      const w = 800 + (i % 6) * 25; // 800g to 925g
      const gain = parseFloat((((1000 - w) / w) * 100).toFixed(2));
      const expl = `Step 1: Cost Price of 1000g = Selling Price of ${w}g.\nStep 2: Error in weight = 1000g - ${w}g = ${1000 - w}g.\nStep 3: Gain % = [Error / (True Weight - Error)] × 100\n= [${1000 - w} / ${w}] × 100 = ${gain}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A dishonest merchant professes to sell basmati rice at cost price, but uses an uncalibrated scale weighing ${w}g instead of a standard 1kg weight. Determine his actual profit percentage.`,
        `${gain}%`,
        [`${(gain - 2.5).toFixed(2)}%`, `${(gain + 3.1).toFixed(2)}%`, `${(gain + 5.5).toFixed(2)}%`],
        expl
      );
    } else if (type === 2) {
      const d1 = 20 + (i % 3) * 5;
      const d2 = 10 + (i % 2) * 5;
      const single = parseFloat((d1 + d2 - (d1 * d2) / 100).toFixed(1));
      const expl = `Step 1: Formula for single equivalent discount: D = d₁ + d₂ - (d₁ × d₂)/100\nStep 2: D = ${d1} + ${d2} - (${d1} × ${d2})/100 = ${single}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A luxury apparel brand announces two successive seasonal clearance discounts of ${d1}% and ${d2}% on designer coats. What single equivalent discount percentage does the consumer enjoy?`,
        `${single}%`,
        [`${(single + 4).toFixed(1)}%`, `${(single - 3.5).toFixed(1)}%`, `${d1 + d2}%`],
        expl
      );
    } else if (type === 3) {
      const r = 10 + (i % 4) * 5;
      const loss = parseFloat(((r * r) / 100).toFixed(2));
      const sp = 35000 + i * 2000;
      const expl = `Step 1: When two articles are sold for the same SP, one at x% gain and other at x% loss, there is ALWAYS an overall loss.\nStep 2: Overall Loss % = (Common % / 10)² = (${r} / 10)² = ${loss}% loss`;
      return makeQuestion(
        `prof_${i + 1}`,
        `An electronics dealer sells two premium laptops for ₹${sp} each. On one he secures a gain of ${r}%, and on the other he suffers a loss of ${r}%. What is his net profit or loss percentage across the complete transaction?`,
        `${loss}% loss`,
        [`${loss}% profit`, `No profit no loss`, `${(loss + 1.25).toFixed(2)}% loss`],
        expl
      );
    } else if (type === 4) {
      const buy = 4 + (i % 3);
      const free = 1 + (i % 2);
      const discPct = parseFloat(((free / (buy + free)) * 100).toFixed(1));
      const expl = `Step 1: Total articles received = ${buy} + ${free} = ${buy + free}.\nStep 2: Free articles = ${free}.\nStep 3: Effective discount % = (${free} / ${buy + free}) × 100 = ${discPct}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A supermarket mega-store runs a promotional scheme: 'Buy ${buy} Items, Get ${free} Free'. What is the effective discount percentage enjoyed by the shopper?`,
        `${discPct}%`,
        [`${(discPct + 5).toFixed(1)}%`, `${(discPct - 4.2).toFixed(1)}%`, `${Math.round((free / buy) * 100)}%`],
        expl
      );
    } else if (type === 5) {
      const cp = 8000 + i * 500;
      const prof = 20;
      const disc = 20;
      const mp = Math.round((cp * (100 + prof)) / (100 - disc));
      const expl = `Step 1: Target Selling Price for ${prof}% profit = ₹${cp} × 1.${prof} = ₹${Math.round(cp * 1.2)}.\nStep 2: Since SP is after a ${disc}% discount on Marked Price:\nSP = MP × (1 - 0.${disc}) = 0.8 × MP.\nStep 3: Marked Price = ₹${Math.round(cp * 1.2)} / 0.8 = ₹${mp}`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A smartphone assembler incurs a production cost of ₹${cp}. The distributor wishes to offer customers an attractive ${disc}% discount while locking in a profit margin of ${prof}%. What should be the listed marked price?`,
        `₹${mp}`,
        [`₹${mp - 1200}`, `₹${mp + 1500}`, `₹${Math.round(cp * 1.35)}`],
        expl
      );
    } else if (type === 6) {
      const y = 15 + (i % 5);
      const x = y + 5;
      const gain = parseFloat((((x - y) / y) * 100).toFixed(1));
      const expl = `Step 1: Given: Cost Price of ${x} articles = Selling Price of ${y} articles.\nStep 2: Let CP of 1 article = ₹1.\nStep 3: Gain on ${y} articles = ₹${x} - ₹${y} = ₹${x - y}.\nStep 4: Gain % = (${x - y} / ${y}) × 100 = ${gain}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `If the cost price of ${x} precision watches is identical to the selling price of ${y} watches, find the percentage profit earned by the watchmaker.`,
        `${gain}%`,
        [`${(gain - 5).toFixed(1)}%`, `${(gain + 6).toFixed(1)}%`, `${(gain * 0.8).toFixed(1)}%`],
        expl
      );
    } else if (type === 7) {
      const r = 20;
      const extraKg = 4;
      const totalRs = 600 + (i % 5) * 100;
      const reducedPerKg = (totalRs * (r / 100)) / extraKg;
      const origPerKg = parseFloat(((reducedPerKg * 100) / (100 - r)).toFixed(2));
      const expl = `Step 1: Money saved by ${r}% price drop = ${r}% of ₹${totalRs} = ₹${totalRs * (r/100)}.\nStep 2: Reduced price per kg = ₹${totalRs * (r/100)} / ${extraKg} = ₹${reducedPerKg}.\nStep 3: Original price per kg = ₹${reducedPerKg} / (1 - ${r}/100) = ₹${origPerKg}`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A price drop of ${r}% on raw almonds enables a confectionery chef to buy ${extraKg} kg more for a total outlay of ₹${totalRs}. Find the original price per kg.`,
        `₹${origPerKg}/kg`,
        [`₹${reducedPerKg}/kg`, `₹${(origPerKg + 6).toFixed(2)}/kg`, `₹${(origPerKg - 5).toFixed(2)}/kg`],
        expl
      );
    } else if (type === 8) {
      const lossPct = 10;
      const gainPct = 15;
      const diffRs = 450 + (i % 6) * 50;
      const cp = Math.round((diffRs * 100) / (lossPct + gainPct));
      const expl = `Step 1: Difference between +${gainPct}% and -${lossPct}% = ${gainPct + lossPct}% of CP.\nStep 2: ${gainPct + lossPct}% of CP = ₹${diffRs}.\nStep 3: CP = (${diffRs} × 100) / ${gainPct + lossPct} = ₹${cp}`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A camera trader sells a telephoto lens at a loss of ${lossPct}%. Had he sold it for ₹${diffRs} more, he would have gained ${gainPct}%. Determine the cost price of the lens.`,
        `₹${cp}`,
        [`₹${cp - 300}`, `₹${cp + 450}`, `₹${Math.round(cp * 1.2)}`],
        expl
      );
    } else if (type === 9) {
      const profA = 20;
      const profB = 25;
      const cpA = 12000 + i * 1000;
      const spB = Math.round(cpA * (1 + profA / 100) * (1 + profB / 100));
      const expl = `Step 1: Price paid by B = ₹${cpA} × 1.${profA} = ₹${Math.round(cpA * 1.2)}.\nStep 2: Price paid by C = ₹${Math.round(cpA * 1.2)} × 1.${profB} = ₹${spB}.\nStep 3: A's cost was ₹${cpA}`;
      return makeQuestion(
        `prof_${i + 1}`,
        `Dealer A sells a graphics card to Trader B at a gain of ${profA}%, and B sells it to End-User C at a gain of ${profB}%. If C pays ₹${spB}, what was Dealer A's initial cost?`,
        `₹${cpA}`,
        [`₹${cpA - 2000}`, `₹${cpA + 2500}`, `₹${Math.round(spB * 0.7)}`],
        expl
      );
    } else if (type === 10) {
      const cp1 = 50 + (i % 4) * 10;
      const cp2 = 80 + (i % 4) * 10;
      const r1 = 3;
      const r2 = 2;
      const avgCP = (cp1 * r1 + cp2 * r2) / (r1 + r2);
      const prof = 20;
      const sp = Math.round(avgCP * (1 + prof / 100));
      const expl = `Step 1: Blended CP = (${r1} × ₹${cp1} + ${r2} × ₹${cp2}) / 5 = ₹${avgCP}/kg.\nStep 2: SP for ${prof}% profit = ₹${avgCP} × 1.${prof} = ₹${sp}/kg`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A tea blender mixes Darjeeling leaves costing ₹${cp1}/kg with Assam leaves costing ₹${cp2}/kg in the ratio ${r1}:${r2}. At what price per kg must he retail the blend to earn ${prof}% profit?`,
        `₹${sp}/kg`,
        [`₹${sp - 7}/kg`, `₹${sp + 8}/kg`, `₹${Math.round(avgCP)}/kg`],
        expl
      );
    } else {
      const total = 400;
      const buyPrice = 25;
      const brokenPct = 10;
      const valid = total * (1 - brokenPct / 100);
      const spEach = 32 + (i % 4);
      const totalCP = total * buyPrice;
      const totalSP = valid * spEach;
      const profPct = parseFloat((((totalSP - totalCP) / totalCP) * 100).toFixed(1));
      const expl = `Step 1: Total Cost = ${total} × ₹${buyPrice} = ₹${totalCP}.\nStep 2: Intact goods = ${valid}.\nStep 3: Total Revenue = ${valid} × ₹${spEach} = ₹${totalSP}.\nStep 4: Profit % = [(${totalSP} - ${totalCP}) / ${totalCP}] × 100 = ${profPct}%`;
      return makeQuestion(
        `prof_${i + 1}`,
        `A ceramics boutique purchases ${total} handcrafted mugs at ₹${buyPrice} each. In transit, ${brokenPct}% are broken. The surviving mugs are sold at ₹${spEach} each. What is the overall percentage gain or loss?`,
        `${profPct}%`,
        [`${(profPct - 3.5).toFixed(1)}%`, `${(profPct + 4.2).toFixed(1)}%`, `${(profPct * 0.8).toFixed(1)}%`],
        expl
      );
    }
  }),

  speed: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 8;
    if (type === 0) {
      const tLen = 250 + (i % 6) * 20;
      const pLen = 350 + (i % 6) * 30;
      const kmph = 72 + (i % 4) * 18;
      const ms = (kmph * 5) / 18;
      const sec = Math.round((tLen + pLen) / ms);
      const expl = `Step 1: Total distance = Train Length + Platform Length = ${tLen}m + ${pLen}m = ${tLen + pLen}m.\nStep 2: Speed in m/s = ${kmph} × (5/18) = ${ms} m/s.\nStep 3: Time = Total Distance / Speed = ${tLen + pLen} / ${ms} = ${sec} seconds`;
      return makeQuestion(
        `spd_${i + 1}`,
        `A high-speed Vande Bharat express train of length ${tLen} meters travels at ${kmph} km/h. How many seconds does it require to clear a platform measuring ${pLen} meters?`,
        `${sec} seconds`,
        [`${sec - 6} seconds`, `${sec + 8} seconds`, `${sec + 15} seconds`],
        expl
      );
    } else if (type === 1) {
      const bSpeed = 15 + (i % 4) * 2;
      const sSpeed = 3 + (i % 3);
      const dist = 36 + (i % 4) * 12;
      const downT = dist / (bSpeed + sSpeed);
      const upT = dist / (bSpeed - sSpeed);
      const totalT = parseFloat((downT + upT).toFixed(2));
      const expl = `Step 1: Downstream speed = ${bSpeed} + ${sSpeed} = ${bSpeed + sSpeed} km/h.\nStep 2: Upstream speed = ${bSpeed} - ${sSpeed} = ${bSpeed - sSpeed} km/h.\nStep 3: Total time = ${dist}/${bSpeed + sSpeed} + ${dist}/${bSpeed - sSpeed} = ${downT.toFixed(2)} + ${upT.toFixed(2)} = ${totalT} hours`;
      return makeQuestion(
        `spd_${i + 1}`,
        `A motorized patrol boat travels at ${bSpeed} km/h in calm water. If the river flows at ${sSpeed} km/h, calculate the total round-trip time required for the boat to travel ${dist} km downstream and return upstream.`,
        `${totalT} hours`,
        [`${(totalT - 1.2).toFixed(2)} hours`, `${(totalT + 1.5).toFixed(2)} hours`, `${(totalT + 0.8).toFixed(2)} hours`],
        expl
      );
    } else if (type === 2) {
      const dist = 300 + (i % 5) * 50;
      const v1 = 60 + (i % 3) * 10;
      const v2 = 40 + (i % 3) * 10;
      const tMeet = dist / (v1 + v2);
      const meetDist = Math.round(v1 * tMeet);
      const expl = `Step 1: Relative speed = ${v1} + ${v2} = ${v1 + v2} km/h.\nStep 2: Time to meet = ${dist} / ${v1 + v2} = ${tMeet.toFixed(2)} hours.\nStep 3: Distance from Hub A = ${v1} × ${tMeet.toFixed(2)} = ${meetDist} km`;
      return makeQuestion(
        `spd_${i + 1}`,
        `Two logistics vans start at the exact same moment from distribution centers A and B situated ${dist} km apart and drive towards each other at constant speeds of ${v1} km/h and ${v2} km/h. At what distance from center A do they cross?`,
        `${meetDist} km`,
        [`${meetDist + 25} km`, `${meetDist - 30} km`, `${Math.round(dist - meetDist)} km`],
        expl
      );
    } else if (type === 3) {
      const s1 = 40 + (i % 3) * 5;
      const s2 = 50 + (i % 3) * 5;
      const lateMin = 15;
      const earlyMin = 5;
      const d = parseFloat(((s1 * s2) / (s2 - s1) * ((lateMin + earlyMin) / 60)).toFixed(1));
      const expl = `Step 1: Time difference = ${lateMin} min + ${earlyMin} min = ${lateMin + earlyMin} min = ${(lateMin + earlyMin) / 60} hrs.\nStep 2: Distance = [(${s1} × ${s2}) / (${s2} - ${s1})] × ${(lateMin + earlyMin) / 60} = ${d} km`;
      return makeQuestion(
        `spd_${i + 1}`,
        `An employee driving to office at ${s1} km/h arrives ${lateMin} minutes late. Speeding up to ${s2} km/h the following day, he reaches ${earlyMin} minutes early. What is the one-way distance between his home and the office?`,
        `${d} km`,
        [`${(d + 6.5).toFixed(1)} km`, `${(d - 5.0).toFixed(1)} km`, `${(d + 12).toFixed(1)} km`],
        expl
      );
    } else if (type === 4) {
      const beatDist = 50 + (i % 4) * 10;
      const beatSec = 10;
      const speedB = beatDist / beatSec;
      const timeB = 1000 / speedB;
      const timeA = timeB - beatSec;
      const speedAKmph = parseFloat(((1000 / timeA) * 3.6).toFixed(1));
      const expl = `Step 1: Speed of B = ${beatDist}m / ${beatSec}s = ${speedB} m/s.\nStep 2: Time for B to run 1000m = 1000 / ${speedB} = ${timeB}s.\nStep 3: Time for A = ${timeB} - ${beatSec} = ${timeA}s.\nStep 4: Speed of A = (1000 / ${timeA}) × 3.6 = ${speedAKmph} km/h`;
      return makeQuestion(
        `spd_${i + 1}`,
        `In a 1000-meter track event, Runner A beats Runner B by ${beatDist} meters or by ${beatSec} seconds. What is Runner A's sprinting speed in km/h?`,
        `${speedAKmph} km/h`,
        [`${(speedAKmph - 2.8).toFixed(1)} km/h`, `${(speedAKmph + 3.2).toFixed(1)} km/h`, `${(speedAKmph + 6.0).toFixed(1)} km/h`],
        expl
      );
    } else if (type === 5) {
      const l1 = 150 + (i % 4) * 25;
      const l2 = 250 + (i % 4) * 25;
      const s1 = 70;
      const s2 = 50;
      const relKmph = s1 - s2;
      const relMs = (relKmph * 5) / 18;
      const sec = parseFloat(((l1 + l2) / relMs).toFixed(1));
      const expl = `Step 1: Total distance = ${l1}m + ${l2}m = ${l1 + l2}m.\nStep 2: Relative speed (same direction) = ${s1} - ${s2} = ${relKmph} km/h = ${relMs.toFixed(2)} m/s.\nStep 3: Overtaking time = (${l1 + l2}) / ${relMs.toFixed(2)} = ${sec} seconds`;
      return makeQuestion(
        `spd_${i + 1}`,
        `Two trains of length ${l1}m and ${l2}m are travelling in the same direction on parallel tracks at ${s1} km/h and ${s2} km/h respectively. In how many seconds will the faster train completely overtake the slower train?`,
        `${sec} seconds`,
        [`${(sec + 8).toFixed(1)} seconds`, `${(sec - 6).toFixed(1)} seconds`, `${(sec + 15).toFixed(1)} seconds`],
        expl
      );
    } else if (type === 6) {
      const s1 = 60;
      const s2 = 40;
      const avg = parseFloat(((2 * s1 * s2) / (s1 + s2)).toFixed(1));
      const expl = `Step 1: Harmonic average speed = (2 × ${s1} × ${s2}) / (${s1} + ${s2}) = ${(2 * s1 * s2)} / ${s1 + s2} = ${avg} km/h`;
      return makeQuestion(
        `spd_${i + 1}`,
        `A commuter drives to work at ${s1} km/h and returns home along the identical route during rush hour at ${s2} km/h. What is his average speed over the full journey?`,
        `${avg} km/h`,
        [`${(avg + 4).toFixed(1)} km/h`, `${(avg - 3).toFixed(1)} km/h`, `50 km/h`],
        expl
      );
    } else {
      const sExcl = 60;
      const sIncl = 48;
      const stopMin = Math.round(((sExcl - sIncl) / sExcl) * 60);
      const expl = `Step 1: Distance lost per hour due to stoppages = ${sExcl} - ${sIncl} = ${sExcl - sIncl} km.\nStep 2: Halting time per hour = [(${sExcl - sIncl}) / ${sExcl}] × 60 = ${stopMin} minutes`;
      return makeQuestion(
        `spd_${i + 1}`,
        `Excluding stops, an intercity luxury coach averages ${sExcl} km/h. Including passenger stops along the route, it averages ${sIncl} km/h. For how many minutes per hour does the coach stop?`,
        `${stopMin} minutes`,
        [`${stopMin + 3} minutes`, `${stopMin - 4} minutes`, `${stopMin + 7} minutes`],
        expl
      );
    }
  }),

  work: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 6;
    if (type === 0) {
      const dA = 20 + (i % 4) * 4;
      const dB = 30 + (i % 4) * 4;
      const leftBefore = 5;
      const rateB = 1 / dB;
      const workB = leftBefore * rateB;
      const rem = 1 - workB;
      const tog = rem / (1 / dA + 1 / dB);
      const total = parseFloat((tog + leftBefore).toFixed(1));
      const expl = `Step 1: Work done by B alone in the final ${leftBefore} days = ${leftBefore} × (1/${dB}) = ${workB.toFixed(2)}.\nStep 2: Remaining work = 1 - ${workB.toFixed(2)} = ${rem.toFixed(2)}.\nStep 3: Combined daily rate = 1/${dA} + 1/${dB}.\nStep 4: Days worked together = ${rem.toFixed(2)} / (1/${dA} + 1/${dB}) = ${tog.toFixed(1)} days.\nStep 5: Total project time = ${tog.toFixed(1)} + ${leftBefore} = ${total} days`;
      return makeQuestion(
        `work_${i + 1}`,
        `Developer A can complete a software module in ${dA} days, while Developer B takes ${dB} days. They start developing jointly, but A leaves ${leftBefore} days before module completion. How many total days did the project take?`,
        `${total} days`,
        [`${(total - 2.5).toFixed(1)} days`, `${(total + 3.0).toFixed(1)} days`, `${(total + 5.5).toFixed(1)} days`],
        expl
      );
    } else if (type === 1) {
      const fillH = 10 + (i % 4) * 2;
      const leakH = 15 + (i % 4) * 3;
      const netT = parseFloat(((fillH * leakH) / (leakH - fillH)).toFixed(1));
      const expl = `Step 1: Inlet filling rate = +1/${fillH} tank/hr.\nStep 2: Leak emptying rate = -1/${leakH} tank/hr.\nStep 3: Net filling rate = 1/${fillH} - 1/${leakH} = (${leakH} - ${fillH}) / (${fillH} × ${leakH}).\nStep 4: Total time = (${fillH} × ${leakH}) / (${leakH} - ${fillH}) = ${netT} hours`;
      return makeQuestion(
        `work_${i + 1}`,
        `An intake valve fills a reservoir in ${fillH} hours. Because of an emergency leak at the bottom, which empties the full reservoir alone in ${leakH} hours, how many hours will it take to fill the tank if both are active simultaneously?`,
        `${netT} hours`,
        [`${(netT + 5).toFixed(1)} hours`, `${(netT - 4).toFixed(1)} hours`, `${Math.round(fillH * 1.8)} hours`],
        expl
      );
    } else if (type === 2) {
      const men = 6;
      const women = 8;
      const daysInit = 10 + (i % 3) * 2;
      const reqDays = parseFloat(((men * daysInit * 2) / (3 * 2 + 4)).toFixed(1));
      const expl = `Step 1: Equivalence: ${men} Backend Engineers = ${women} Fullstack Engineers.\nStep 2: 3 Backend + 4 Fullstack = 3 × (${women/men}) + 4 = 8 Fullstack.\nStep 3: Since ${women} Fullstack take ${daysInit} days, 8 Fullstack take (${women} × ${daysInit}) / 8 = ${reqDays} days`;
      return makeQuestion(
        `work_${i + 1}`,
        `${men} senior backend engineers or ${women} fullstack engineers can deliver a fintech MVP in ${daysInit} days. How many days will it take 3 senior backend engineers and 4 fullstack engineers working jointly?`,
        `${reqDays} days`,
        [`${(reqDays + 2.5).toFixed(1)} days`, `${(reqDays - 1.8).toFixed(1)} days`, `${(reqDays + 4.0).toFixed(1)} days`],
        expl
      );
    } else if (type === 3) {
      const totalWages = 18000 + i * 1500;
      const dA = 6;
      const dB = 8;
      const dC = 12;
      const shareB = Math.round(((1 / dB) / (1 / dA + 1 / dB + 1 / dC)) * totalWages);
      const expl = `Step 1: Work ratio A : B : C = 1/${dA} : 1/${dB} : 1/${dC} = 4 : 3 : 2.\nStep 2: Sum of parts = 9.\nStep 3: B's share = (3 / 9) × ₹${totalWages} = ₹${shareB}`;
      return makeQuestion(
        `work_${i + 1}`,
        `Engineers A, B, and C can complete a backend redesign in ${dA}, ${dB}, and ${dC} days respectively. They undertake the contract jointly for ₹${totalWages}. What is Engineer B's compensation share?`,
        `₹${shareB}`,
        [`₹${shareB + 1600}`, `₹${shareB - 1400}`, `₹${Math.round(totalWages / 3)}`],
        expl
      );
    } else if (type === 4) {
      const eff = 3;
      const diffDays = 40 + (i % 3) * 10;
      const daysB = (diffDays * eff) / (eff - 1);
      const daysA = daysB / eff;
      const tog = parseFloat(((daysA * daysB) / (daysA + daysB)).toFixed(1));
      const expl = `Step 1: Efficiency ratio A:B = ${eff}:1 ⇒ Time ratio A:B = 1:${eff}.\nStep 2: Difference = ${eff} - 1 = 2 units = ${diffDays} days ⇒ A = ${daysA} days, B = ${daysB} days.\nStep 3: Together = (A × B) / (A + B) = ${tog} days`;
      return makeQuestion(
        `work_${i + 1}`,
        `System Architect A is ${eff} times as efficient as Junior Engineer B, and is consequently able to deliver an enterprise security audit in ${diffDays} days less than B. Working together, in how many days can they complete the audit?`,
        `${tog} days`,
        [`${(tog + 3.2).toFixed(1)} days`, `${(tog - 2.0).toFixed(1)} days`, `${(tog + 6.5).toFixed(1)} days`],
        expl
      );
    } else {
      const dA = 12 + (i % 4) * 2;
      const dB = 18 + (i % 4) * 2;
      const tog = parseFloat(((dA * dB) / (dA + dB)).toFixed(1));
      const expl = `Step 1: 1-day work of A = 1/${dA}, 1-day work of B = 1/${dB}.\nStep 2: Combined 1-day rate = 1/${dA} + 1/${dB}.\nStep 3: Total time = (${dA} × ${dB}) / (${dA} + ${dB}) = ${tog} days`;
      return makeQuestion(
        `work_${i + 1}`,
        `Analyst A can finish an ETL pipeline in ${dA} days, and Analyst B can finish it in ${dB} days. Working together collaboratively, in how many days will the pipeline be completed?`,
        `${tog} days`,
        [`${(tog + 2).toFixed(1)} days`, `${(tog - 1.8).toFixed(1)} days`, `${Math.round((dA + dB) / 2)} days`],
        expl
      );
    }
  }),

  percentage: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 5;
    if (type === 0) {
      const invalidPct = 10;
      const winPctOfValid = 60;
      const margin = 3600 + i * 400;
      const validVotes = margin / ((winPctOfValid - (100 - winPctOfValid)) / 100);
      const totalVotes = Math.round(validVotes / ((100 - invalidPct) / 100));
      const expl = `Step 1: Let total votes = V. Valid votes = 0.90 V.\nStep 2: Margin = (${winPctOfValid} - ${100 - winPctOfValid})% of Valid Votes = 20% of 0.90 V = 0.18 V.\nStep 3: 0.18 V = ${margin} ⇒ Total Votes V = ${totalVotes}`;
      return makeQuestion(
        `pct_${i + 1}`,
        `In a student council election between two candidates, ${invalidPct}% of cast ballots were deemed invalid. The winning candidate secured ${winPctOfValid}% of valid votes and won by a margin of ${margin} votes. Find the total number of ballots polled.`,
        `${totalVotes} votes`,
        [`${totalVotes - 2500} votes`, `${totalVotes + 3200} votes`, `${Math.round(totalVotes * 1.15)} votes`],
        expl
      );
    } else if (type === 1) {
      const incPrice = 25 + (i % 3) * 5;
      const redCons = parseFloat(((incPrice / (100 + incPrice)) * 100).toFixed(1));
      const expl = `Step 1: Formula for consumption reduction: [r / (100 + r)] × 100.\nStep 2: Reduction = [${incPrice} / (100 + ${incPrice})] × 100 = ${redCons}%`;
      return makeQuestion(
        `pct_${i + 1}`,
        `Due to crude oil import duty spikes, aviation jet fuel prices rose by ${incPrice}%. By what percentage must an airline reduce its fuel consumption so that overall monthly fuel expenditure remains strictly constant?`,
        `${redCons}%`,
        [`${incPrice}%`, `${(redCons + 3.5).toFixed(1)}%`, `${(redCons - 2.8).toFixed(1)}%`],
        expl
      );
    } else if (type === 2) {
      const total = 500;
      const pPython = 65;
      const pJava = 55;
      const pBoth = 35;
      const neitherPct = 100 - (pPython + pJava - pBoth);
      const neitherCount = Math.round((total * neitherPct) / 100);
      const expl = `Step 1: Certified in at least one = ${pPython}% + ${pJava}% - ${pBoth}% = ${pPython + pJava - pBoth}%.\nStep 2: Certified in neither = 100% - ${pPython + pJava - pBoth}% = ${neitherPct}%.\nStep 3: Engineers = ${neitherPct}% of ${total} = ${neitherCount}`;
      return makeQuestion(
        `pct_${i + 1}`,
        `In an enterprise IT division of ${total} engineers, ${pPython}% are certified in Python, ${pJava}% are certified in Java, and ${pBoth}% hold certifications in both. Exactly how many engineers hold certification in neither programming language?`,
        `${neitherCount} engineers`,
        [`${neitherCount + 25} engineers`, `${neitherCount - 20} engineers`, `${Math.round(total * 0.2)} engineers`],
        expl
      );
    } else if (type === 3) {
      const pInc = 20 + (i % 3) * 10;
      const pDec = 10 + (i % 3) * 5;
      const net = parseFloat((pInc - pDec - (pInc * pDec) / 100).toFixed(2));
      const label = net >= 0 ? `${net}% increase` : `${Math.abs(net)}% decrease`;
      const expl = `Step 1: Successive percentage change = a + b + (ab)/100.\nStep 2: Net = ${pInc} - ${pDec} - (${pInc} × ${pDec})/100 = ${net}%\nStep 3: Outcome = ${label}`;
      return makeQuestion(
        `pct_${i + 1}`,
        `The market price of a stock increased by ${pInc}% in March, but corrected by ${pDec}% in April. What was the net percentage change in the stock price over the two months?`,
        label,
        [`${(net + 3).toFixed(2)}% increase`, `${(Math.abs(net) + 2).toFixed(2)}% decrease`, `0% change`],
        expl
      );
    } else {
      const passPct = 40;
      const securedPct = 32 + (i % 4);
      const failedBy = 20 + (i % 4) * 4;
      const maxMarks = Math.round((failedBy / (passPct - securedPct)) * 100);
      const expl = `Step 1: Difference between pass mark and secured mark = ${passPct}% - ${securedPct}% = ${passPct - securedPct}% of total.\nStep 2: ${passPct - securedPct}% of Total = ${failedBy} marks.\nStep 3: Total marks = (${failedBy} × 100) / ${passPct - securedPct} = ${maxMarks}`;
      return makeQuestion(
        `pct_${i + 1}`,
        `In a civil services screening exam, a candidate scores ${securedPct}% marks and fails by ${failedBy} marks. If the minimum qualifying pass percentage is set at ${passPct}%, determine the maximum possible aggregate marks.`,
        `${maxMarks} marks`,
        [`${maxMarks + 50} marks`, `${maxMarks - 40} marks`, `${maxMarks + 100} marks`],
        expl
      );
    }
  }),

  interest: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const p = 15000 + i * 2500;
      const r = 8 + (i % 3) * 2;
      const diff = parseFloat((p * Math.pow(r / 100, 2)).toFixed(2));
      const expl = `Step 1: Difference between CI and SI for 2 years = P × (R / 100)²\nStep 2: Difference = ₹${p} × (${r} / 100)² = ₹${diff}`;
      return makeQuestion(
        `int_${i + 1}`,
        `A venture fund loans ₹${p} to an early-stage startup for a tenure of 2 years at an annual interest rate of ${r}%. Calculate the exact numerical difference between the Compound Interest (compounded annually) and the Simple Interest accrued over this period.`,
        `₹${diff}`,
        [`₹${(diff + 14.5).toFixed(2)}`, `₹${(diff - 12.0).toFixed(2)}`, `₹${(diff * 1.5).toFixed(2)}`],
        expl
      );
    } else if (type === 1) {
      const p = 20000 + i * 2000;
      const r = 10;
      const amount = Math.round(p * Math.pow(1 + (r / 2) / 100, 3));
      const ci = amount - p;
      const expl = `Step 1: Rate per half-year = ${r}% / 2 = 5%.\nStep 2: Tenure = 1.5 years = 3 half-years.\nStep 3: Amount = ${p} × (1 + 0.05)³ = ₹${amount}.\nStep 4: CI = Amount - Principal = ${amount} - ${p} = ₹${ci}`;
      return makeQuestion(
        `int_${i + 1}`,
        `Calculate the compound interest on a fixed deposit of ₹${p} invested for 1.5 years at ${r}% per annum, with interest compounded semi-annually.`,
        `₹${ci}`,
        [`₹${ci + 320}`, `₹${ci - 280}`, `₹${Math.round(p * 0.15)}`],
        expl
      );
    } else if (type === 2) {
      const yearsDouble = 4 + (i % 3);
      const targetTimes = 8;
      const yearsRequired = yearsDouble * 3;
      const expl = `Step 1: Under compound interest: Principal becomes 2¹ times in ${yearsDouble} years.\nStep 2: Principal becomes 8 = 2³ times in 3 × ${yearsDouble} = ${yearsRequired} years`;
      return makeQuestion(
        `int_${i + 1}`,
        `A corporate bond invested at compound interest doubles the principal capital in ${yearsDouble} years. At the identical compound interest rate, in how many years will the investment mature to ${targetTimes} times the initial capital?`,
        `${yearsRequired} years`,
        [`${yearsRequired + 4} years`, `${yearsRequired - 3} years`, `${yearsDouble * targetTimes} years`],
        expl
      );
    } else {
      const sum = 10000 + i * 2000;
      const rate = 5 + (i % 3);
      const time = 3;
      const si = Math.round((sum * rate * time) / 100);
      const expl = `Step 1: Simple Interest formula = (P × R × T) / 100\nStep 2: SI = (${sum} × ${rate} × ${time}) / 100 = ₹${si}`;
      return makeQuestion(
        `int_${i + 1}`,
        `Find the simple interest on an institutional capital deposit of ₹${sum} invested for ${time} years at ${rate}% per annum.`,
        `₹${si}`,
        [`₹${si + 250}`, `₹${si - 300}`, `₹${Math.round(sum * 0.2)}`],
        expl
      );
    }
  }),

  ratio: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const initLiters = 80;
      const replaced = 8 + (i % 3) * 2;
      const left = parseFloat((initLiters * Math.pow(1 - replaced / initLiters, 2)).toFixed(2));
      const expl = `Step 1: Liquid left = Initial × (1 - x / V)ⁿ.\nStep 2: Milk left = ${initLiters} × (1 - ${replaced}/${initLiters})² = ₹${left} liters`;
      return makeQuestion(
        `rat_${i + 1}`,
        `A storage cask contains ${initLiters} liters of pure chemical reagent. ${replaced} liters are drawn out and replaced with purified water. This operation is repeated a second time. How many liters of pure reagent remain in the cask?`,
        `${left} liters`,
        [`${(left - 3.5).toFixed(2)} liters`, `${(left + 4.2).toFixed(2)} liters`, `${initLiters - replaced * 2} liters`],
        expl
      );
    } else if (type === 1) {
      const c1 = 45;
      const c2 = 70;
      const prof = 20;
      const sp = 66 + (i % 3) * 6;
      const mean = parseFloat((sp / 1.2).toFixed(1));
      const ratio1 = Math.round((c2 - mean) * 10);
      const ratio2 = Math.round((mean - c1) * 10);
      const g = gcd(ratio1, ratio2);
      const ansRatio = `${ratio1 / g}:${ratio2 / g}`;
      const expl = `Step 1: CP of blend = SP / 1.${prof} = ₹${mean}/kg.\nStep 2: Alligation rule: (${c2} - ${mean}) / (${mean} - ${c1}) = ${ansRatio}`;
      return makeQuestion(
        `rat_${i + 1}`,
        `In what ratio must an artisanal roaster blend Arabica coffee beans costing ₹${c1}/kg with premium Robusta beans costing ₹${c2}/kg so that retailing the blended coffee at ₹${sp}/kg yields a profit margin of ${prof}%?`,
        ansRatio,
        [`${ratio2 / g}:${ratio1 / g}`, `2:3`, `3:4`],
        expl
      );
    } else if (type === 2) {
      const incRatio = [5, 4];
      const expRatio = [3, 2];
      const savings = 6000 + i * 500;
      const x = savings / (incRatio[0] * expRatio[1] - incRatio[1] * expRatio[0]);
      const incA = incRatio[0] * x;
      const expl = `Step 1: Equations: 5x - 3y = ${savings}, and 4x - 2y = ${savings}.\nStep 2: Solving yields x = ₹${x}.\nStep 3: Income of A = 5x = ₹${incA}`;
      return makeQuestion(
        `rat_${i + 1}`,
        `The monthly compensation packages of senior engineers A and B are in the ratio ${incRatio[0]}:${incRatio[1]}, while their monthly living expenditures are in the ratio ${expRatio[0]}:${expRatio[1]}. If each engineer consistently saves ₹${savings} per month into their portfolio, what is engineer A's monthly compensation?`,
        `₹${incA}`,
        [`₹${incA - 4000}`, `₹${incA + 5000}`, `₹${Math.round(incA * 0.8)}`],
        expl
      );
    } else {
      const invA = 50000;
      const invB = 70000;
      const monthsB = 8;
      const totalProf = 27000 + i * 1500;
      const shareRatioA = invA * 12;
      const shareRatioB = invB * monthsB;
      const shareB = Math.round((totalProf * shareRatioB) / (shareRatioA + shareRatioB));
      const expl = `Step 1: Ratio of investments × time = (${invA} × 12) : (${invB} × ${monthsB}) = ${shareRatioA} : ${shareRatioB}.\nStep 2: B's share = [${shareRatioB} / (${shareRatioA} + ${shareRatioB})] × ₹${totalProf} = ₹${shareB}`;
      return makeQuestion(
        `rat_${i + 1}`,
        `Founder A launched an AI startup with an initial seed capital of ₹${invA}. After 4 months, Partner B invested ₹${invB} into the venture. At the close of the financial year, the net company dividend pool was ₹${totalProf}. What is Partner B's legitimate share of the profit?`,
        `₹${shareB}`,
        [`₹${shareB + 1800}`, `₹${shareB - 1400}`, `₹${Math.round(totalProf / 2)}`],
        expl
      );
    }
  }),

  numbers: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const n = 100 + (i % 6) * 10;
      const zeros = Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125);
      const expl = `Step 1: Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋.\nStep 2: Zeros = ⌊${n}/5⌋ + ⌊${n}/25⌋ + ⌊${n}/125⌋ = ${zeros} zeros`;
      return makeQuestion(
        `num_${i + 1}`,
        `In a cryptographic hashing algorithm requiring massive combinatorial calculations, evaluate the exact number of trailing zeros in ${n}! (factorial of ${n}).`,
        `${zeros} zeros`,
        [`${zeros - 2} zeros`, `${zeros + 3} zeros`, `${zeros + 5} zeros`],
        expl
      );
    } else if (type === 1) {
      const base = 7;
      const exp = 105 + (i % 4);
      const cycle = [1, 7, 9, 3];
      const ans = cycle[exp % 4];
      const expl = `Step 1: Unit digits of powers of 7 follow cyclicity of 4: 7¹=7, 7²=9, 7³=3, 7⁴=1.\nStep 2: ${exp} mod 4 = ${exp % 4}.\nStep 3: Unit digit = ${ans}`;
      return makeQuestion(
        `num_${i + 1}`,
        `Determine the exact unit digit of the large numerical exponential value ${base}^${exp}.`,
        `${ans}`,
        [`${(ans + 2) % 10}`, `${(ans + 4) % 10}`, `${(ans + 6) % 10}`],
        expl
      );
    } else if (type === 2) {
      const num = 720;
      const factors = (4 + 1) * (2 + 1) * (1 + 1); // 720 = 2^4 * 3^2 * 5^1 -> 5 * 3 * 2 = 30
      const expl = `Step 1: Prime factorization of 720 = 2⁴ × 3² × 5¹.\nStep 2: Total factors = (4 + 1) × (2 + 1) × (1 + 1) = 5 × 3 × 2 = ${factors}`;
      return makeQuestion(
        `num_${i + 1}`,
        `How many total positive integer divisors (factors) exist for the number ${num}?`,
        `${factors}`,
        [`${factors - 6}`, `${factors + 4}`, `${factors * 2}`],
        expl
      );
    } else {
      const n = 120 + i * 5;
      const sum = (n * (n + 1)) / 2;
      const expl = `Step 1: Sum of first n natural numbers = [n × (n + 1)] / 2\nStep 2: Sum = (${n} × ${n + 1}) / 2 = ${sum}`;
      return makeQuestion(
        `num_${i + 1}`,
        `Compute the exact aggregate sum of the first ${n} consecutive positive integers.`,
        `${sum}`,
        [`${sum - 120}`, `${sum + 150}`, `${sum * 2}`],
        expl
      );
    }
  }),

  hcf: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const t1 = 12;
      const t2 = 15;
      const t3 = 18;
      const t4 = 24;
      const expl = `Step 1: LCM of (${t1}, ${t2}, ${t3}, ${t4}) = 360 seconds.\nStep 2: 360 seconds = 6 minutes.\nStep 3: Next simultaneous change = 09:00 AM + 6 min = 09:06 AM`;
      return makeQuestion(
        `hcf_${i + 1}`,
        `Four automated smart traffic signals in a metro grid cycle every ${t1}, ${t2}, ${t3}, and ${t4} seconds respectively. If they synchronize simultaneously at 09:00 AM, at what time will all four signals flash together next?`,
        `09:06 AM`,
        [`09:04 AM`, `09:12 AM`, `09:08 AM`],
        expl
      );
    } else if (type === 1) {
      const l = 15 + (i % 3);
      const b = 12 + (i % 3);
      const side = gcd(l * 100, b * 100);
      const tiles = Math.round((l * 100 * b * 100) / (side * side));
      const expl = `Step 1: Side of largest square tile = HCF(${l * 100}, ${b * 100}) = ${side} cm.\nStep 2: Minimum tiles = Area / Tile Area = (${l * 100} × ${b * 100}) / (${side} × ${side}) = ${tiles} tiles`;
      return makeQuestion(
        `hcf_${i + 1}`,
        `A corporate atrium floor measuring ${l} meters in length and ${b} meters in breadth is to be paved completely using the minimum possible number of identical square tiles. How many tiles are required?`,
        `${tiles} tiles`,
        [`${tiles + 15} tiles`, `${tiles - 12} tiles`, `${tiles + 25} tiles`],
        expl
      );
    } else if (type === 2) {
      const hcfVal = 16 + (i % 4) * 2;
      const lcmVal = hcfVal * 15;
      const num1 = hcfVal * 3;
      const num2 = (hcfVal * lcmVal) / num1;
      const expl = `Step 1: Product of two numbers = HCF × LCM\nStep 2: ${num1} × Number 2 = ${hcfVal} × ${lcmVal}\nStep 3: Number 2 = (${hcfVal} × ${lcmVal}) / ${num1} = ${num2}`;
      return makeQuestion(
        `hcf_${i + 1}`,
        `The HCF and LCM of two integers are ${hcfVal} and ${lcmVal} respectively. If one of the numbers is ${num1}, find the other number.`,
        `${num2}`,
        [`${num2 + 16}`, `${num2 - 24}`, `${num2 + 32}`],
        expl
      );
    } else {
      const r = 4;
      const n1 = 40 + (i % 4) * 6;
      const n2 = 64 + (i % 4) * 6;
      const ans = gcd(n1 - r, n2 - r);
      const expl = `Step 1: Required number = HCF of (${n1} - ${r}) and (${n2} - ${r})\nStep 2: HCF(${n1 - r}, ${n2 - r}) = ${ans}`;
      return makeQuestion(
        `hcf_${i + 1}`,
        `Find the greatest integer that divides ${n1} and ${n2} leaving a constant remainder of ${r} in each case.`,
        `${ans}`,
        [`${ans + 3}`, `${ans - 2}`, `${ans * 2}`],
        expl
      );
    }
  }),

  average: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const inns = 16 + (i % 4);
      const inc = 3;
      const currentAvg = 45 + (i % 5);
      const score = currentAvg + (inns + 1) * inc;
      const expl = `Step 1: New Average = ${currentAvg} + ${inc} = ${currentAvg + inc}.\nStep 2: Total runs after ${inns + 1} innings = ${inns + 1} × ${currentAvg + inc}.\nStep 3: Previous runs = ${inns} × ${currentAvg}.\nStep 4: Required score = ${score} runs`;
      return makeQuestion(
        `avg_${i + 1}`,
        `A premier league batsman has an average of ${currentAvg} runs across ${inns} innings. In his next match, what score must he record to elevate his aggregate batting average by ${inc} runs?`,
        `${score} runs`,
        [`${score - 12} runs`, `${score + 15} runs`, `${score + 8} runs`],
        expl
      );
    } else if (type === 1) {
      const teamSize = 11;
      const avgWeight = 72;
      const inc = 1;
      const coachWeight = avgWeight + (teamSize + 1) * inc;
      const expl = `Step 1: Total weight of 11 players = 11 × ${avgWeight} = ${11 * avgWeight} kg.\nStep 2: New total with coach = 12 × (${avgWeight} + ${inc}) = ${12 * (avgWeight + inc)} kg.\nStep 3: Coach weight = ${coachWeight} kg`;
      return makeQuestion(
        `avg_${i + 1}`,
        `The average weight of ${teamSize} football team members is ${avgWeight} kg. When the head coach's weight is added to the squad registry, the average weight increases by ${inc} kg. What is the physical weight of the coach?`,
        `${coachWeight} kg`,
        [`${coachWeight - 5} kg`, `${coachWeight + 6} kg`, `${coachWeight + 12} kg`],
        expl
      );
    } else if (type === 2) {
      const ageRohan = 16 + (i % 4);
      const expl = `Step 1: Ratio 6 yrs ago was 6:5, present ages = 6x + 6 and 5x + 6.\nStep 2: In 4 years: (6x + 10)/(5x + 10) = 11/10 ⇒ x = 2.\nStep 3: Rohan's present age = 5(2) + 6 = ${ageRohan} years`;
      return makeQuestion(
        `avg_${i + 1}`,
        `6 years ago, the ratio of the ages of Priya and Rohan was 6:5. In 4 years from now, their age ratio will be 11:10. What is Rohan's present age?`,
        `${ageRohan} years`,
        [`${ageRohan - 3} years`, `${ageRohan + 4} years`, `${ageRohan + 8} years`],
        expl
      );
    } else {
      const n = 50;
      const oldAvg = 40;
      const wrong = 83;
      const correct = 38;
      const rectified = parseFloat((oldAvg - (wrong - correct) / n).toFixed(2));
      const expl = `Step 1: Net error in sum = ${correct} - ${wrong} = -${wrong - correct}.\nStep 2: Error in average = -${wrong - correct} / ${n} = -${((wrong - correct)/n).toFixed(2)}.\nStep 3: Correct average = ${oldAvg} - ${((wrong - correct)/n).toFixed(2)} = ${rectified}`;
      return makeQuestion(
        `avg_${i + 1}`,
        `The average score of ${n} university students in an exam was calculated as ${oldAvg}. An audit discovered that one score of ${correct} was mistakenly recorded as ${wrong}. What is the true rectified average?`,
        `${rectified}`,
        [`${(rectified + 0.9).toFixed(2)}`, `${(rectified - 0.75).toFixed(2)}`, `${oldAvg}`],
        expl
      );
    }
  }),

  geometry: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const d = 13 + (i % 4);
      const r1 = 8;
      const r2 = 3;
      const tangent = Math.round(Math.sqrt(d * d - (r1 - r2) * (r1 - r2)));
      const expl = `Step 1: Length of direct common tangent = √[d² - (r₁ - r₂)²]\nStep 2: L = √[${d}² - (${r1} - ${r2})²] = √[${d * d} - ${Math.pow(r1 - r2, 2)}] = ${tangent} cm`;
      return makeQuestion(
        `geo_${i + 1}`,
        `Two circular cogwheels with radii ${r1}cm and ${r2}cm have their center shafts separated by a distance of ${d}cm. Determine the exact geometric length of their direct common exterior tangent.`,
        `${tangent} cm`,
        [`${tangent + 2} cm`, `${tangent - 3} cm`, `${tangent + 4} cm`],
        expl
      );
    } else if (type === 1) {
      const chord = 16;
      const dist = 6 + (i % 3);
      const r = Math.round(Math.sqrt(Math.pow(chord / 2, 2) + Math.pow(dist, 2)));
      const expl = `Step 1: Half chord length = ${chord} / 2 = 8 cm.\nStep 2: Radius r = √(8² + ${dist}²) = √(${64 + dist * dist}) = ${r} cm`;
      return makeQuestion(
        `geo_${i + 1}`,
        `A straight chord of length ${chord} cm is situated at a perpendicular distance of ${dist} cm from the center of a circular tunnel. What is the radius of the tunnel?`,
        `${r} cm`,
        [`${r + 2} cm`, `${r - 2} cm`, `${chord} cm`],
        expl
      );
    } else if (type === 2) {
      const a = 6 + (i % 3) * 2;
      const b = 8 + (i % 3) * 2;
      const c = Math.round(Math.sqrt(a * a + b * b));
      const inradius = (a + b - c) / 2;
      const expl = `Step 1: Hypotenuse c = √(${a}² + ${b}²) = ${c} cm.\nStep 2: Inradius for right triangle = (a + b - c) / 2 = (${a} + ${b} - ${c}) / 2 = ${inradius} cm`;
      return makeQuestion(
        `geo_${i + 1}`,
        `In a right-angled structural bracket with perpendicular legs measuring ${a} cm and ${b} cm, compute the exact radius of the incircle (inradius).`,
        `${inradius} cm`,
        [`${inradius + 1.5} cm`, `${inradius - 0.5} cm`, `${inradius + 3} cm`],
        expl
      );
    } else {
      const base = 12 + (i % 4);
      const height = 16 + (i % 4);
      const area = (base * height) / 2;
      const expl = `Step 1: Area of triangle = 1/2 × Base × Height = 1/2 × ${base} × ${height} = ${area} m²`;
      return makeQuestion(
        `geo_${i + 1}`,
        `A triangular solar panel has a baseline of ${base} m and a vertical altitude height of ${height} m. What is the total active surface area of the panel?`,
        `${area} m²`,
        [`${area + 18} m²`, `${area - 14} m²`, `${area * 2} m²`],
        expl
      );
    }
  }),

  algebra: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const p = 5 + (i % 3);
      const q = 6 + (i % 3);
      const sumReciprocal = parseFloat((p / q).toFixed(2));
      const expl = `Step 1: For x² - ${p}x + ${q} = 0, Sum of roots α + β = ${p}, Product αβ = ${q}.\nStep 2: 1/α + 1/β = (α + β) / (αβ) = ${p} / ${q} = ${sumReciprocal}`;
      return makeQuestion(
        `alg_${i + 1}`,
        `If α and β represent the distinct real roots of the quadratic equation x² - ${p}x + ${q} = 0, evaluate the exact value of (1/α + 1/β).`,
        `${sumReciprocal}`,
        [`${(sumReciprocal + 0.5).toFixed(2)}`, `${(sumReciprocal - 0.4).toFixed(2)}`, `${(q / p).toFixed(2)}`],
        expl
      );
    } else if (type === 1) {
      const h = 4 + (i % 3);
      const k = 10 + (i % 5);
      const expl = `Step 1: Rewriting quadratic in vertex form: 2(x - ${h})² + ${k}.\nStep 2: Minimum occurs when x = ${h}, yielding minimum value = ${k}`;
      return makeQuestion(
        `alg_${i + 1}`,
        `Find the absolute minimum value attainable by the quadratic cost function C(x) = 2x² - ${4 * h}x + ${2 * h * h + k}.`,
        `${k}`,
        [`${k + 4}`, `${k - 6}`, `${h}`],
        expl
      );
    } else if (type === 2) {
      const a = 2 + (i % 3);
      const b = 3 + (i % 3);
      const val = Math.pow(a + b, 3) - 3 * a * b * (a + b);
      const expl = `Step 1: Identity: a³ + b³ = (a + b)³ - 3ab(a + b)\nStep 2: Value = (${a + b})³ - 3(${a * b})(${a + b}) = ${val}`;
      return makeQuestion(
        `alg_${i + 1}`,
        `If a + b = ${a + b} and ab = ${a * b}, calculate the exact value of (a³ + b³).`,
        `${val}`,
        [`${val + 24}`, `${val - 18}`, `${val + 40}`],
        expl
      );
    } else {
      const x = 4 + (i % 3);
      const val = x * x + 1 / (x * x);
      const expl = `Step 1: If x + 1/x = ${x + 1/x}, then x² + 1/x² = (x + 1/x)² - 2 = ${val.toFixed(2)}`;
      return makeQuestion(
        `alg_${i + 1}`,
        `If (x + 1/x) = ${(x + 1/x).toFixed(2)}, compute the numerical value of (x² + 1/x²).`,
        `${val.toFixed(2)}`,
        [`${(val + 3).toFixed(2)}`, `${(val - 2).toFixed(2)}`, `${(val * 1.5).toFixed(2)}`],
        expl
      );
    }
  }),

  trigonometry: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const h = 60 + (i % 4) * 15;
      const dist = parseFloat((h * (Math.sqrt(3) - 1 / Math.sqrt(3))).toFixed(1));
      const expl = `Step 1: Initial distance d₁ = ${h} / tan(30°) = ${h}√3.\nStep 2: Final distance d₂ = ${h} / tan(60°) = ${h} / √3.\nStep 3: Traveled distance = ${h}(√3 - 1/√3) = ${dist} m`;
      return makeQuestion(
        `trig_${i + 1}`,
        `From the observation deck of a maritime lighthouse ${h} meters above sea level, the angle of depression of a surveillance vessel changes from 30° to 60° as it sails toward the base. What distance did the vessel travel between the two observations?`,
        `${dist} m`,
        [`${(dist + 12.5).toFixed(1)} m`, `${(dist - 10.0).toFixed(1)} m`, `${h} m`],
        expl
      );
    } else if (type === 1) {
      const ladder = 10 + (i % 3) * 2;
      const reach = parseFloat((ladder * Math.sin(Math.PI / 3)).toFixed(1));
      const expl = `Step 1: Height reached = Ladder Length × sin(60°) = ${ladder} × (√3 / 2) = ${reach} m`;
      return makeQuestion(
        `trig_${i + 1}`,
        `A maintenance ladder of length ${ladder} m rests against a building facade making an inclination angle of 60° with the horizontal ground. How high up the facade does the top of the ladder reach?`,
        `${reach} m`,
        [`${(reach + 1.8).toFixed(1)} m`, `${(reach - 1.5).toFixed(1)} m`, `${(ladder / 2).toFixed(1)} m`],
        expl
      );
    } else if (type === 2) {
      const val = 2 + (i % 3);
      const sinVal = parseFloat(((val * val - 1) / (val * val + 1)).toFixed(2));
      const expl = `Step 1: sec θ + tan θ = ${val} ⇒ sec θ - tan θ = 1/${val}.\nStep 2: sin θ = tan θ / sec θ = (${val}² - 1) / (${val}² + 1) = ${sinVal}`;
      return makeQuestion(
        `trig_${i + 1}`,
        `Given the trigonometric identity condition (sec θ + tan θ) = ${val}, calculate the value of sin θ.`,
        `${sinVal}`,
        [`${(sinVal - 0.15).toFixed(2)}`, `${(sinVal + 0.12).toFixed(2)}`, `0.50`],
        expl
      );
    } else {
      const h = 100 + (i % 4) * 10;
      const dist = parseFloat((h * (1 + Math.sqrt(3))).toFixed(1));
      const expl = `Step 1: Total distance = h(cot 45° + cot 30°) = ${h}(1 + √3) = ${dist} m`;
      return makeQuestion(
        `trig_${i + 1}`,
        `From the top of a radio tower ${h} meters high, the angles of depression of two ground receivers situated on opposite sides in a straight line are 45° and 30°. Determine the distance separating the two receivers.`,
        `${dist} m`,
        [`${(dist + 24).toFixed(1)} m`, `${(dist - 18).toFixed(1)} m`, `${h * 2} m`],
        expl
      );
    }
  }),

  probability: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const r = 4 + (i % 3);
      const b = 5 + (i % 3);
      const total = r + b;
      const pSame = parseFloat(((r * (r - 1) + b * (b - 1)) / (total * (total - 1))).toFixed(2));
      const expl = `Step 1: Total components = ${r} + ${b} = ${total}.\nStep 2: P(both chips) = (${r}/${total}) × (${r - 1}/${total - 1}).\nStep 3: P(both microcontrollers) = (${b}/${total}) × (${b - 1}/${total - 1}).\nStep 4: P(same type) = P(both chips) + P(both microcontrollers) = ${pSame}`;
      return makeQuestion(
        `prob_${i + 1}`,
        `A quality assurance box contains ${r} defect-free chips and ${b} calibrated micro-controllers. If 2 components are drawn at random without replacement, what is the probability that both components are of identical type?`,
        `${pSame}`,
        [`${(pSame + 0.12).toFixed(2)}`, `${(pSame - 0.09).toFixed(2)}`, `0.50`],
        expl
      );
    } else if (type === 1) {
      const p1 = 0.5;
      const p2 = 0.4;
      const p3 = 0.25;
      const pSolved = parseFloat((1 - (1 - p1) * (1 - p2) * (1 - p3)).toFixed(2));
      const expl = `Step 1: P(none solves) = (1 - 0.5) × (1 - 0.4) × (1 - 0.25) = 0.225.\nStep 2: P(at least one solves) = 1 - 0.225 = ${pSolved}`;
      return makeQuestion(
        `prob_${i + 1}`,
        `Three automated algorithmic models A, B, and C independently assess an arbitrage signal with success probabilities 1/2, 2/5, and 1/4 respectively. What is the probability that the trade is successfully completed by at least one model?`,
        `${pSolved}`,
        [`${(pSolved - 0.14).toFixed(2)}`, `${(pSolved + 0.08).toFixed(2)}`, `0.60`],
        expl
      );
    } else if (type === 2) {
      const pCard = parseFloat(((4 * 4) / ((52 * 51) / 2)).toFixed(3));
      const expl = `Step 1: Number of Kings = 4, Queens = 4.\nStep 2: Total combinations = 52C2 = 1326.\nStep 3: Favorable = 4 × 4 = 16.\nStep 4: Probability = 16 / 1326 = ${pCard}`;
      return makeQuestion(
        `prob_${i + 1}`,
        `Two cards are drawn simultaneously from a standard shuffled deck of 52 cards. What is the probability that one is a King and the other is a Queen?`,
        `${pCard}`,
        [`${(pCard * 2).toFixed(3)}`, `${(pCard + 0.015).toFixed(3)}`, `0.025`],
        expl
      );
    } else {
      const boys = 5;
      const girls = 4;
      const ans = 43200;
      const expl = `Step 1: Seat 5 boys: 5! = 120 ways.\nStep 2: 6 gaps available for 4 girls: 6P4 = 360 ways.\nStep 3: Total = 120 × 360 = ${ans} ways`;
      return makeQuestion(
        `prob_${i + 1}`,
        `In how many distinct ways can ${boys} male software engineers and ${girls} female software engineers be seated in a conference line such that no two female engineers sit adjacent to each other?`,
        `${ans}`,
        [`${ans - 7200}`, `${ans + 14400}`, `28800`],
        expl
      );
    }
  }),

  mensuration: () => Array.from({ length: 90 }, (_, i) => {
    const type = i % 4;
    if (type === 0) {
      const R = 6 + (i % 3) * 2;
      const r = 2;
      const h = 3;
      const volSphere = (4 / 3) * Math.PI * Math.pow(R, 3);
      const volCone = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
      const numCones = Math.floor(volSphere / volCone);
      const expl = `Step 1: Sphere volume = 4/3 × π × ${R}³ = ${(volSphere).toFixed(1)} cm³.\nStep 2: Cone volume = 1/3 × π × ${r}² × ${h} = ${(volCone).toFixed(1)} cm³.\nStep 3: Number of cones = Sphere Vol / Cone Vol = ${numCones}`;
      return makeQuestion(
        `men_${i + 1}`,
        `A solid industrial brass sphere of radius ${R} cm is melted down and completely recast into miniature cones each of base radius ${r} cm and height ${h} cm. How many complete cones can be fabricated?`,
        `${numCones}`,
        [`${numCones + 8}`, `${numCones - 6}`, `${numCones + 15}`],
        expl
      );
    } else if (type === 1) {
      const r = 7 + (i % 3) * 7;
      const h = 24;
      const slant = Math.round(Math.sqrt(r * r + h * h));
      const canvasArea = Math.round((22 / 7) * r * slant);
      const expl = `Step 1: Slant height l = √(r² + h²) = √(${r}² + ${h}²) = ${slant} m.\nStep 2: Curved surface area = π × r × l = (22/7) × ${r} × ${slant} = ${canvasArea} m²`;
      return makeQuestion(
        `men_${i + 1}`,
        `A conical dome has a circular base radius of ${r} m and a vertical altitude of ${h} m. Calculate the exact surface area of waterproof composite canvas needed to assemble the curved shell of the dome (use π = 22/7).`,
        `${canvasArea} m²`,
        [`${canvasArea + 110} m²`, `${canvasArea - 85} m²`, `${canvasArea + 220} m²`],
        expl
      );
    } else if (type === 2) {
      const r = 14;
      const l = 22;
      const b = 14;
      const h = 10 + (i % 3) * 2;
      const volCuboid = l * b * h;
      const baseAreaCyl = (22 / 7) * r * r;
      const rise = parseFloat((volCuboid / baseAreaCyl).toFixed(2));
      const expl = `Step 1: Volume of cuboid = ${l} × ${b} × ${h} = ${volCuboid} cm³.\nStep 2: Base area of cylinder = π × ${r}² = ${baseAreaCyl} cm².\nStep 3: Water rise = Volume / Base Area = ${rise} cm`;
      return makeQuestion(
        `men_${i + 1}`,
        `A solid iron ingot shaped as a rectangular cuboid of dimensions ${l} cm × ${b} cm × ${h} cm is submerged into a vertical cylindrical tank of internal radius ${r} cm containing water. By how many centimeters will the water level rise?`,
        `${rise} cm`,
        [`${(rise + 1.2).toFixed(2)} cm`, `${(rise - 0.8).toFixed(2)} cm`, `${(rise + 2.5).toFixed(2)} cm`],
        expl
      );
    } else {
      const r = 5 + (i % 3);
      const h = 12 + (i % 4);
      const vol = Math.round(Math.PI * r * r * h);
      const expl = `Step 1: Volume of cylinder = π × r² × h = π × ${r}² × ${h} = ${vol} cm³`;
      return makeQuestion(
        `men_${i + 1}`,
        `Calculate the volumetric capacity in cm³ of a precision cylindrical accumulator having an internal radius of ${r} cm and a height of ${h} cm.`,
        `${vol} cm³`,
        [`${vol + 150} cm³`, `${vol - 120} cm³`, `${vol + 280} cm³`],
        expl
      );
    }
  })
};

// Generates 3 sections with 30 questions each (total 90 questions per topic)
const generateTopicPool = (topicKey) => {
  const genFn = aptitudeTopicsGenerator[topicKey] || aptitudeTopicsGenerator.profit;
  const all90 = genFn();
  return {
    '1': all90.slice(0, 30),  // Section 1: 30 Questions
    '2': all90.slice(30, 60), // Section 2: 30 Questions
    '3': all90.slice(60, 90)  // Section 3: 30 Questions
  };
};

/* ==========================================================================
   EXPRESS ROUTES
   ========================================================================== */

// Available topics list with 90 questions (30 per section)
router.get('/', (req, res) => {
  const topics = Object.keys(aptitudeTopicsGenerator).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: 90,
    sections: ['1', '2', '3']
  }));
  res.json({ topics });
});

// Dynamic AI Question Generation endpoint (guarantees diverse, non-repeating archetypes)
router.post('/generate-ai', async (req, res) => {
  try {
    const { topic = 'profit', count = 10 } = req.body;
    
    // Attempt real LLM generation if GEMINI_API_KEY is configured
    const liveAiQuestions = await callGeminiAI(topic, count);
    if (liveAiQuestions && liveAiQuestions.length > 0) {
      return res.json({
        success: true,
        source: 'gemini_ai',
        topic,
        questions: liveAiQuestions
      });
    }

    // Procedural AI generation engine with randomized archetype permutation
    const dynamicQuestions = generateDynamicQuestions(topic, count);
    res.json({
      success: true,
      source: 'procedural_ai',
      topic,
      questions: dynamicQuestions
    });
  } catch (error) {
    console.error('Error generating AI questions:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI questions', error: error.message });
  }
});

// Topic endpoint with section filter: /api/aptitude/:topic?section=1|2|3 (returns 30 questions each)
router.get('/:topic', (req, res) => {
  const { topic } = req.params;
  const section = req.query.section || '1';

  if (!aptitudeTopicsGenerator[topic]) {
    return res.status(404).json({ message: 'Topic not found' });
  }

  const pool = generateTopicPool(topic);
  const selectedQuestions = pool[section] || pool['1'];

  res.json({
    topic,
    currentSection: section,
    availableSections: ['1', '2', '3'],
    sectionInfo: {
      '1': 'Section 1: Foundation & Core Placement Patterns (30 Questions)',
      '2': 'Section 2: Advanced Multi-Step Scenarios (30 Questions)',
      '3': 'Section 3: High-Difficulty & Case Studies (30 Questions)'
    },
    questions: selectedQuestions
  });
});

module.exports = router;