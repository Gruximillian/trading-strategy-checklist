window.addEventListener('load', async () => {
  const strategyDocument = await fetch('./strategies.json')
    .then(response => response.json()).then(json => json);

  const traderSelect = document.getElementById('trader-selection');
  const strategySelect = document.getElementById('strategy-selection');

  let traders = [];
  let strategies = [];

  const createOption = (value) => {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = value;
    return option;
  };

  const populateSelectField = (values, parent) => {
    values.forEach(value => parent.appendChild(createOption(value)));
  };
  traderSelect.addEventListener('change', updateTrader);

  traders = strategyDocument.map(trader => trader.traderName);
  populateSelectField(traders, traderSelect);

  function updateTrader(e) {
    const traderName = e.target.value;

    if (traderName === 'none') {
      // TODO: Handle this with clearing the strategy selection and page display
      return;
    }

    const strategies = strategyDocument.filter(trader => trader.traderName === traderName)?.[0]?.strategies;
    const strategyNames = strategies.map(strategy => strategy.strategyName);
    populateSelectField(strategyNames, strategySelect);
    strategySelect.addEventListener('change', updateStrategy);

    // TODO: Decouple from updateTrader if possible
    function updateStrategy(e) {
      const strategyName = e.target.value;

      if (strategyName === 'none') {
        // TODO: Handle this with clearing the strategy selection and page display
        return;
      }

      const selectedStrategy = strategies.filter((strategy) => strategy.strategyName === strategyName);
      console.log(selectedStrategy[0]);
    }
  }
});
