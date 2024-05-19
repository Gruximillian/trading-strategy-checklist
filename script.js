window.addEventListener('load', async () => {
  const strategyDocument = await fetch('./strategies.json')
    .then(response => response.json()).then(json => json);

  const isUppercase = a => a === a.toUpperCase();

  const camelCaseToWords = (string) => {
    const letters = string.split('');
    let output = '';

    letters.forEach(letter => {
      output = isUppercase(letter) ? `${output} ${letter.toLowerCase()}` : `${output}${letter}`;
    });

    return output.trim();
  };

  const toggleCheckbox = e => {
    if (e.target.tagName === 'LABEL') {
      e.target.classList.toggle('checked');
    }
  };

  const createOption = (value) => {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = value;
    return option;
  };

  const populateSelectField = (values, parent) => {
    values.forEach(value => parent.appendChild(createOption(value)));
  };

  const renderChecklistEntry = (entry, sectionName) => {
    const entryContainer = document.createElement('label');
    const checkbox = document.createElement('input');
    const label = document.createElement('span');

    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', sectionName);
    checkbox.setAttribute('value', entry);
    label.innerText = entry;

    entryContainer.appendChild(checkbox);
    entryContainer.appendChild(label);

    return entryContainer;
  }

  const renderSelectedStrategyForm = (strategy, parent) => {
    const sections = Object.entries(strategy.strategyChecklist);

    sections.forEach(section => {
      const [sectionName, sectionChecklist] = section;
      const container = document.createElement('fieldset');
      const legend = document.createElement('legend');

      container.classList.add('form-section');
      legend.innerText = camelCaseToWords(sectionName);

      container.appendChild(legend);
      sectionChecklist.forEach(entry => container.appendChild(renderChecklistEntry(entry, sectionName)));
      parent.appendChild(container);
    });
  };

  const traderSelect = document.getElementById('trader-selection');
  const strategySelect = document.getElementById('strategy-selection');
  const strategyHeader = document.getElementById('selected-strategy-name');
  const tradeChecklistForm = document.getElementById('trade-checklist');

  let strategies;

  const resetStrategySelect = () => {
    strategySelect.innerHTML = null;
    const placeholder = document.createElement('option');
    placeholder.value = 'none';
    placeholder.innerText = 'Choose a strategy';
    strategySelect.appendChild(placeholder);
  };

  const resetStrategyForm = () => {
    tradeChecklistForm.innerHTML = null;
    strategyHeader.innerText = null;
  };

  const traderNames = strategyDocument.map(trader => trader.traderName);
  populateSelectField(traderNames, traderSelect);

  const updateTrader = (e) => {
    const traderName = e.target.value;
    resetStrategySelect();
    resetStrategyForm();

    if (traderName === 'none') {
      return;
    }

    strategies = strategyDocument.filter(trader => trader.traderName === traderName)?.[0]?.strategies;
    const strategyNames = strategies.map(strategy => strategy.strategyName);
    populateSelectField(strategyNames, strategySelect);
  };

  const updateStrategy = (strategyName, strategies) => {
    resetStrategyForm();

    if (strategyName === 'none') {
      return;
    }

    strategyHeader.innerText = strategyName;

    const selectedStrategy = strategies.filter((strategy) => strategy.strategyName === strategyName)[0];
    renderSelectedStrategyForm(selectedStrategy, tradeChecklistForm);
  };

  traderSelect.addEventListener('change', updateTrader);
  strategySelect.addEventListener('change', e => updateStrategy(e.target.value, strategies));
  tradeChecklistForm.addEventListener('click', toggleCheckbox);
});
