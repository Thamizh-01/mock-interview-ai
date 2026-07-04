const express = require('express');
const router = express.Router();

const companies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture', 'Cognizant', 'IBM', 'Tech Mahindra', 'Oracle', 'Microsoft', 'Amazon', 'Google', 'Meta'];

const generateCompanies = () => companies.sort(() => 0.5 - Math.random()).slice(0, 3);

const aptitudeTopics = {
  numbers: Array.from({ length: 30 }, (_, i) => ({
    id: `num${i+1}`,
    q: `Number Systems question ${i+1}: What is the units digit of 7^${100+i}?`,
    a: 'Units digit cycles: 7, 9, 3, 1. 100+i mod 4 gives answer.',
    companies: generateCompanies()
  })),
  hcf: Array.from({ length: 30 }, (_, i) => ({
    id: `hcf${i+1}`,
    q: `HCF/LCM question ${i+1}: Find HCF of ${12*(i+1)} and ${18*(i+1)}.`,
    a: `HCF = ${6*(i+1)}`,
    companies: generateCompanies()
  })),
  speed: Array.from({ length: 30 }, (_, i) => ({
    id: `spd${i+1}`,
    q: `Time-Speed question ${i+1}: A car travels ${100+50*i}km in ${2+i} hours. What is average speed?`,
    a: `${Math.round((100+50*i)/(2+i))} km/h`,
    companies: generateCompanies()
  })),
  work: Array.from({ length: 30 }, (_, i) => ({
    id: `work${i+1}`,
    q: `Work-Time question ${i+1}: A can do work in ${6+i*2} days, B in ${8+i*2} days. How long together?`,
    a: `${(6+i*2)*(8+i*2)/(14+4*i)} days`,
    companies: generateCompanies()
  })),
  ratio: Array.from({ length: 30 }, (_, i) => ({
    id: `rat${i+1}`,
    q: `Ratio question ${i+1}: Divide ${600+100*i} in ratio ${3+i}:${4+i}. First part?`,
    a: `${(600+100*i)*(3+i)/(7+2*i)}`,
    companies: generateCompanies()
  })),
  percentage: Array.from({ length: 30 }, (_, i) => ({
    id: `pct${i+1}`,
    q: `Percentage question ${i+1}: ${20+i*2}% of ${200+100*i} is?`,
    a: `${(20+2*i)*(200+100*i)/100}`,
    companies: generateCompanies()
  })),
  profit: Array.from({ length: 30 }, (_, i) => ({
    id: `prof${i+1}`,
    q: `Profit/Loss question ${i+1}: CP ₹${100+50*i}, SP ₹${120+50*i}. Profit%?`,
    a: `${((20+5*i)/(100+50*i))*100}%`,
    companies: generateCompanies()
  })),
  interest: Array.from({ length: 30 }, (_, i) => ({
    id: `int${i+1}`,
    q: `Interest question ${i+1}: Principal ₹${1000+500*i} at ${10+i}% for ${2+i} years. SI?`,
    a: `₹${(1000+500*i)*(10+i)*(2+i)/100}`,
    companies: generateCompanies()
  })),
  average: Array.from({ length: 30 }, (_, i) => ({
    id: `avg${i+1}`,
    q: `Average question ${i+1}: Average of {${5+i}, ${10+i}, ${15+i}, ${20+i}, ${25+i}}?`,
    a: `${15+i}`,
    companies: generateCompanies()
  })),
  geometry: Array.from({ length: 30 }, (_, i) => ({
    id: `geo${i+1}`,
    q: `Geometry question ${i+1}: Area of triangle with base ${10+2*i}cm and height ${8+2*i}cm?`,
    a: `${(10+2*i)*(8+2*i)/2} cm²`,
    companies: generateCompanies()
  })),
  algebra: Array.from({ length: 30 }, (_, i) => ({
    id: `alg${i+1}`,
    q: `Algebra question ${i+1}: If x+y=${10+i} and x-y=${2+i}, find x and y.`,
    a: `x=${11+1.5*i}, y=${9-0.5*i}`,
    companies: generateCompanies()
  })),
  trigonometry: Array.from({ length: 30 }, (_, i) => ({
    id: `trig${i+1}`,
    q: `Trigonometry question ${i+1}: If sin θ = ${3+i}/5, find cos θ and tan θ.`,
    a: `cos θ=${4+i}/5, tan θ=${(3+i)/(4+i)}`,
    companies: generateCompanies()
  })),
  probability: Array.from({ length: 30 }, (_, i) => ({
    id: `prob${i+1}`,
    q: `Probability question ${i+1}: Probability of getting ${i} heads in 3 coin flips?`,
    a: `${Math.pow(2, 3-i)/8}`,
    companies: generateCompanies()
  })),
  mensuration: Array.from({ length: 30 }, (_, i) => ({
    id: `men${i+1}`,
    q: `Mensuration question ${i+1}: Volume of cylinder with r=${i+1} and h=${5+i}?`,
    a: `${Math.PI*Math.pow(i+1,2)*(5+i)}`,
    companies: generateCompanies()
  }))
};

router.get('/', (req, res) => {
  const topics = Object.keys(aptitudeTopics).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: aptitudeTopics[key].length
  }));
  res.json({ topics });
});

router.get('/:topic', (req, res) => {
  const { topic } = req.params;
  if (!aptitudeTopics[topic]) {
    return res.status(404).json({ message: 'Topic not found' });
  }
  res.json({ topic, questions: aptitudeTopics[topic] });
});

module.exports = router;