const frequencyOptions = [
  { label: '10 fois / jour', perMonth: 220 },
  { label: '5 fois / jour', perMonth: 110 },
  { label: '2 fois / jour', perMonth: 44 },
  { label: '1 fois / jour', perMonth: 22 },
  { label: '3 fois / semaine', perMonth: 12 },
  { label: '1 fois / semaine', perMonth: 4 },
  { label: '2 fois / mois', perMonth: 2 },
  { label: '1 fois / mois', perMonth: 1 },
  { label: '1 fois / trimestre', perMonth: 1 / 3 },
  { label: '1 fois / an', perMonth: 1 / 12 },
];

const multiplierScale = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  20, 30, 40, 50, 60, 70, 80, 90, 100,
  200, 300, 400, 500,
];

const state = {
  multiplier: 1,
};

const fields = {
  people: document.getElementById('people'),
  peopleRange: document.getElementById('peopleRange'),
  frequencyRange: document.getElementById('frequencyRange'),
  frequencyLabel: document.getElementById('frequencyLabel'),
  frequencyMonthly: document.getElementById('frequencyMonthly'),
  taskMinutes: document.getElementById('taskMinutes'),
  taskMinutesRange: document.getElementById('taskMinutesRange'),
  salary: document.getElementById('salary'),
  salaryRange: document.getElementById('salaryRange'),
  multiplierScroller: document.getElementById('multiplierScroller'),
  multiplierLabel: document.getElementById('multiplierLabel'),
  multiplierHint: document.getElementById('multiplierHint'),
  currentHours: document.getElementById('currentHours'),
  currentCost: document.getElementById('currentCost'),
  currentAnnualCost: document.getElementById('currentAnnualCost'),
  savedHours: document.getElementById('savedHours'),
  savedCost: document.getElementById('savedCost'),
  savedAnnualCost: document.getElementById('savedAnnualCost'),
};

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

function bindNumberWithRange(numberInput, rangeInput) {
  const syncFromNumber = () => {
    const value = Math.max(
      Number(rangeInput.min),
      Math.min(Number(rangeInput.max), Number(numberInput.value) || 0),
    );
    numberInput.value = String(value);
    rangeInput.value = String(value);
    compute();
  };

  const syncFromRange = () => {
    numberInput.value = rangeInput.value;
    compute();
  };

  numberInput.addEventListener('input', syncFromNumber);
  rangeInput.addEventListener('input', syncFromRange);
}

function createMultiplierPills() {
  const fragment = document.createDocumentFragment();

  multiplierScale.forEach((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'multiplier-pill';
    button.dataset.multiplier = String(value);
    button.textContent = `x${value}`;
    button.addEventListener('click', () => {
      state.multiplier = value;
      updateMultiplierUI();
      compute();
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    fragment.appendChild(button);
  });

  fields.multiplierScroller.appendChild(fragment);
}

function updateMultiplierUI() {
  fields.multiplierLabel.value = `x${state.multiplier}`;
  fields.multiplierHint.textContent = `La tâche est réalisée ${state.multiplier} fois plus vite`;

  const pills = fields.multiplierScroller.querySelectorAll('.multiplier-pill');
  pills.forEach((pill) => {
    const isActive = Number(pill.dataset.multiplier) === state.multiplier;
    pill.classList.toggle('active', isActive);
  });
}

function compute() {
  const people = Number(fields.people.value) || 0;
  const minutes = Number(fields.taskMinutes.value) || 0;
  const salaryMonthly = Number(fields.salary.value) || 0;

  const frequency = frequencyOptions[Number(fields.frequencyRange.value)] ?? frequencyOptions[3];
  fields.frequencyLabel.value = frequency.label;
  fields.frequencyMonthly.textContent = `≈ ${numberFormatter.format(frequency.perMonth)} occurrences / mois`;

  const occurrencesPerMonth = frequency.perMonth;
  const taskHours = minutes / 60;

  const monthlyHoursCurrent = people * occurrencesPerMonth * taskHours;
  const hourlyCost = salaryMonthly / 151.67;
  const monthlyCostCurrent = monthlyHoursCurrent * hourlyCost;
  const annualCostCurrent = monthlyCostCurrent * 12;

  const monthlyHoursOptimized = monthlyHoursCurrent / state.multiplier;
  const monthlyHoursSaved = monthlyHoursCurrent - monthlyHoursOptimized;
  const monthlyCostSaved = monthlyHoursSaved * hourlyCost;
  const annualCostSaved = monthlyCostSaved * 12;

  fields.currentHours.textContent = `${numberFormatter.format(monthlyHoursCurrent)} h`;
  fields.currentCost.textContent = currencyFormatter.format(monthlyCostCurrent);
  fields.currentAnnualCost.textContent = currencyFormatter.format(annualCostCurrent);

  fields.savedHours.textContent = `${numberFormatter.format(monthlyHoursSaved)} h`;
  fields.savedCost.textContent = currencyFormatter.format(monthlyCostSaved);
  fields.savedAnnualCost.textContent = currencyFormatter.format(annualCostSaved);
}

bindNumberWithRange(fields.people, fields.peopleRange);
bindNumberWithRange(fields.taskMinutes, fields.taskMinutesRange);
bindNumberWithRange(fields.salary, fields.salaryRange);
fields.frequencyRange.addEventListener('input', compute);

createMultiplierPills();
updateMultiplierUI();
compute();
