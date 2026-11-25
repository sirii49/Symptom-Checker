const rules = require('../data/rules.json');
const groups = require('../data/symptoms.json');

const KNOWN = Object.values(groups).flat();
const RED_FLAGS = ['chest pain', 'shortness of breath', 'confusion'];
const LEVELS = ['self-care', 'see-doctor', 'emergency'];
const MESSAGES = {
  'self-care': 'Your symptoms look mild. Self-care at home is usually enough.',
  'see-doctor': 'It would be sensible to consult a doctor soon.',
  emergency: 'Some of your symptoms can be serious. Seek emergency medical care immediately.',
};

// Everyday wording -> symptom names used in the rules
const SYNONYMS = {
  'stomach ache': 'abdominal pain', 'stomach pain': 'abdominal pain', 'tummy ache': 'abdominal pain', 'belly pain': 'abdominal pain', 'stomach cramps': 'abdominal pain',
  'throwing up': 'vomiting', vomit: 'vomiting', puking: 'vomiting',
  'loose motion': 'diarrhea', 'loose motions': 'diarrhea', diarrhoea: 'diarrhea', 'loose stools': 'diarrhea',
  temperature: 'fever', feverish: 'fever', 'very high fever': 'high fever', 'high temperature': 'high fever',
  cold: 'runny nose', 'blocked nose': 'runny nose', 'stuffy nose': 'runny nose', 'running nose': 'runny nose',
  breathless: 'shortness of breath', breathlessness: 'shortness of breath', 'difficulty breathing': 'shortness of breath', 'trouble breathing': 'shortness of breath', 'cant breathe': 'shortness of breath',
  tired: 'fatigue', tiredness: 'fatigue', weakness: 'fatigue', weak: 'fatigue', exhausted: 'fatigue',
  'sore body': 'body ache', 'muscle pain': 'body ache', 'body pain': 'body ache', 'joint pain': 'body ache',
  'throat pain': 'sore throat', 'scratchy throat': 'sore throat',
  'head ache': 'headache', 'head pain': 'headache',
  giddy: 'dizziness', dizzy: 'dizziness', lightheaded: 'dizziness',
  'skin rash': 'rash', rashes: 'rash', itching: 'rash',
  'chest tightness': 'chest pain', 'chest discomfort': 'chest pain',
  'feeling sick': 'nausea', nauseous: 'nausea',
  shivering: 'chills', chill: 'chills',
  sneeze: 'sneezing', 'watery eyes': 'itchy eyes', 'eye itching': 'itchy eyes',
  confused: 'confusion', disoriented: 'confusion', 'cant smell': 'loss of smell',
};

// Candidate phrases for partial matching ("severe chest pain" contains "chest pain"), longest first
const PHRASES = [
  ...KNOWN.map((k) => [k, k]),
  ...Object.entries(SYNONYMS).filter(([k]) => k.length >= 6),
].sort((a, b) => b[0].length - a[0].length);

function normalize(input) {
  const term = String(input).toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim();
  if (!term) return null;
  if (KNOWN.includes(term)) return term;
  if (SYNONYMS[term]) return SYNONYMS[term];
  const hit = PHRASES.find(([phrase]) => phrase.length >= 4 && term.includes(phrase));
  return hit ? hit[1] : null;
}

function runEngine({ symptoms, ageGroup, severity, duration }) {
  const recognized = [];
  const unrecognized = [];
  symptoms.forEach((s) => {
    const n = normalize(s);
    if (n) { if (!recognized.includes(n)) recognized.push(n); }
    else if (String(s).trim()) unrecognized.push(String(s).trim());
  });

  const selected = [...recognized];
  if (selected.includes('high fever') && !selected.includes('fever')) selected.push('fever');

  // 1. Score each rule: matched symptoms / total symptoms in the rule
  const conditions = rules
    .map((r) => {
      const matched = r.symptoms.filter((s) => selected.includes(s));
      return { name: r.name, score: Math.round((matched.length / r.symptoms.length) * 100), advice: r.advice, urgency: r.urgency };
    })
    .filter((c) => c.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 2. Urgency: red flags override everything
  let level = 0;
  const redFlag =
    selected.some((s) => RED_FLAGS.includes(s)) ||
    (selected.includes('high fever') && severity === 'severe');

  if (redFlag) {
    level = 2;
  } else {
    if (conditions[0] && conditions[0].urgency === 'medium') level = 1;
    if (severity === 'severe' || selected.includes('high fever')) level = Math.max(level, 1);
    if (duration === '1 week+') level = Math.max(level, 1);
    if ((ageGroup === 'child' || ageGroup === 'senior') && selected.length >= 3) level = Math.max(level, 1);
    if (recognized.length === 0) level = 1;
  }

  const message =
    recognized.length === 0
      ? "We couldn't match your symptoms to our list. If you feel unwell or they continue, please consult a doctor."
      : MESSAGES[LEVELS[level]];

  return {
    symptoms: recognized,
    unrecognized,
    urgency: LEVELS[level],
    message,
    conditions: conditions.map(({ name, score, advice }) => ({ name, score, advice })),
  };
}

module.exports = runEngine;
