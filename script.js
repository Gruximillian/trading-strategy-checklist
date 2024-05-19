window.addEventListener('load', async () => {
  const strategyDocument = await fetch('./strategies.json')
    .then(response => response.json()).then(json => json);

  const traderSelect = document.getElementById('trader-selection');
  const strategySelect = document.getElementById('strategy-selection');

  let strategies;

  const createOption = (value) => {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = value;
    return option;
  };

  const populateSelectField = (values, parent) => {
    values.forEach(value => parent.appendChild(createOption(value)));
  };

  const resetStrategySelect = () => {
    strategySelect.innerHTML = null;
    const placeholder = document.createElement('option');
    placeholder.value = 'none';
    placeholder.innerText = 'Choose a strategy';
    strategySelect.appendChild(placeholder);
  };

  const traderNames = strategyDocument.map(trader => trader.traderName);
  populateSelectField(traderNames, traderSelect);

  const updateTrader = (e) => {
    const traderName = e.target.value;
    resetStrategySelect();

    if (traderName === 'none') {
      return;
    }

    strategies = strategyDocument.filter(trader => trader.traderName === traderName)?.[0]?.strategies;
    const strategyNames = strategies.map(strategy => strategy.strategyName);
    populateSelectField(strategyNames, strategySelect);
  };

  const updateStrategy = (strategyName, strategies) => {
    if (strategyName === 'none') {
      // TODO: Handle this with clearing the strategy selection and page display
      return;
    }

    const selectedStrategy = strategies.filter((strategy) => strategy.strategyName === strategyName);
    console.log(selectedStrategy[0]);
  };

  traderSelect.addEventListener('change', updateTrader);
  strategySelect.addEventListener('change', (e) => {
    updateStrategy(e.target.value, strategies);
  });
});
