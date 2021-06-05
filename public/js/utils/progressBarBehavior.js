const calculateLevelDetails = (totalExp, expToLevelUp = 30) => {
    let level = 1;
    let currentExp = totalExp;
    let expRequiredToLevelUp = expToLevelUp;

    while (currentExp >= expRequiredToLevelUp) {
        currentExp -= expRequiredToLevelUp;
        expRequiredToLevelUp += expToLevelUp;
        level += 1;
    }

    return {
        level,
        currentExp,
        expRequiredToLevelUp,
    };
};

const CalculateProgressBarPercents = (totalExp) => {
    const { currentExp, expRequiredToLevelUp } = calculateLevelDetails(totalExp);
    let filledBarPercent = (currentExp / expRequiredToLevelUp) * 100;
    if (filledBarPercent === 100) {
        filledBarPercent = 0;
    }
    const emptyBarPercent = 100 - filledBarPercent;
    return {
        filledBarPercent,
        emptyBarPercent,
    };
};

// console.log(calculateLevelDetails(190));

export {calculateLevelDetails, CalculateProgressBarPercents}
