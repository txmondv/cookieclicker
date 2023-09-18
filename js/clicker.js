$(document).ready(function () {
    const pageItems = [
        {
            // Aktueller Cookiekontostand
            localStorageName: 'score', 
            initialValueInLocalStorage: 0,
            HTMLitemName: 'aaron'
        },
        {
            // Alle Cookies zusammengerechnet
            localStorageName: 'totalCookies', 
            initialValueInLocalStorage: 0,
            HTMLitemName: 'totalCookies'
        },
        {
            // Wert, der beim Klicken hinzugefügt wird
            localStorageName: 'upgradeVal', 
            initialValueInLocalStorage: 1,
            HTMLitemName: 'upgradeVal'
        },
        {
            // Preis für das erste Upgrade
            localStorageName: 'upgrade1Price', 
            initialValueInLocalStorage: 50,
            upgradePriceIncrease: 150,
            clickValueIncrease: 1,
            HTMLitemName: 'price-buy-1'
        },
        {
            localStorageName: 'upgrade2Price', 
            initialValueInLocalStorage: 500,
            upgradePriceIncrease: 500,
            clickValueIncrease: 5,
            HTMLitemName: 'price-buy-2'
        },
        {
            localStorageName: 'upgrade3Price', 
            initialValueInLocalStorage: 2500,
            upgradePriceIncrease: 1500,
            clickValueIncrease: 30,
            HTMLitemName: 'price-buy-3'
        },
        {
            localStorageName: 'minerVal1', 
            initialValueInLocalStorage: 0,
            miner: true,
            minerMultiplier: 1,
            HTMLitemName: 'minerVal1'
        },
        {
            localStorageName: 'minerVal2', 
            initialValueInLocalStorage: 0,
            miner: true,
            minerMultiplier: 10,
            HTMLitemName: 'minerVal2'
        },
        {
            localStorageName: 'minerVal3', 
            initialValueInLocalStorage: 0,
            miner: true,
            minerMultiplier: 50,
            HTMLitemName: 'minerVal3'
        },
        {
            localStorageName: 'upgradeMiner1', 
            initialValueInLocalStorage: 100,
            upgradePriceIncrease: 50,
            maxLvl: 100,
            HTMLitemName: 'price-buy-miner1'
        },
        {
            localStorageName: 'upgradeMiner2', 
            initialValueInLocalStorage: 1500,
            upgradePriceIncrease: 1000,
            maxLvl: 100,
            HTMLitemName: 'price-buy-miner2'
        },
        {
            localStorageName: 'upgradeMiner3', 
            initialValueInLocalStorage: 15000,
            upgradePriceIncrease: 10000,
            maxLvl: 100,
            HTMLitemName: 'price-buy-miner3'
        }
    ]

    initializeLocalStorage();
    updateTextValues();

    function getPageItemByLocalStorageName(nameInLocalStorage) {
        return pageItems.find(element => element.localStorageName === nameInLocalStorage);
    }

    function initializeLocalStorage() {
        pageItems.forEach((element) => {
            if (localStorage.getItem(element.localStorageName) === null) {
                localStorage.setItem(element.localStorageName, element.initialValueInLocalStorage);
            }
        });
    }

    function updateTextValues() {
        pageItems.forEach((element) => {
            $(`#${element.HTMLitemName}`).text(Number(localStorage.getItem(element.localStorageName)));
        });
    }

    function resetPricesAndValues() {
        pageItems.forEach((element) => {
            localStorage.removeItem(element.localStorageName);
        });

        initializeLocalStorage();
        updateTextValues();
    }

    function updateScore(score) {
        pageItems.slice(0, 2).forEach((element) => {
            const currentValue = Number(localStorage.getItem(element.localStorageName));
            localStorage.setItem(element.localStorageName, currentValue + score);
        });
    }

    $("#count-erhoehen").click(() => {
        const updateValue = Number(localStorage.getItem('upgradeVal'));
        updateScore(updateValue);
        updateTextValues();
    });

    $("#cheat50000").click(() => {
        updateScore(50000);
        updateTextValues();
    });

    $("#count-reset").click(() => {
        resetPricesAndValues();
    });

    function buyButtonClickHandling(buttonID) {
        const upgradeItem = getPageItemByLocalStorageName(`upgrade${buttonID}Price`);
        const score = Number(localStorage.getItem(pageItems[0].localStorageName));
        
        if (score < upgradeItem.upgradePriceIncrease) {
            return;
        }

        localStorage.setItem(pageItems[0].localStorageName, score - upgradeItem.upgradePriceIncrease);
        localStorage.setItem(upgradeItem.localStorageName, upgradeItem.upgradePriceIncrease + Number(localStorage.getItem(upgradeItem.localStorageName)));
        localStorage.setItem('upgradeVal', Number(localStorage.getItem('upgradeVal')) + upgradeItem.clickValueIncrease);

        updateTextValues();
    }

    $("#buy-1, #buy-2, #buy-3").click((event) => {
        const buttonID = event.target.id.split('-')[1];
        buyButtonClickHandling(buttonID);
    });

    function buyMinerClickHandling(minerID) {
        const minerUpgradeItem = getPageItemByLocalStorageName(`upgradeMiner${minerID}`);
        const minerItem = getPageItemByLocalStorageName(`minerVal${minerID}`);
        const score = Number(localStorage.getItem(pageItems[0].localStorageName));

        if (score < minerUpgradeItem.upgradePriceIncrease || minerItem.initialValueInLocalStorage >= minerUpgradeItem.maxLvl) {
            return;
        }

        localStorage.setItem(pageItems[0].localStorageName, score - minerUpgradeItem.upgradePriceIncrease);
        localStorage.setItem(minerUpgradeItem.localStorageName, minerUpgradeItem.upgradePriceIncrease + Number(localStorage.getItem(minerUpgradeItem.localStorageName)));
        localStorage.setItem(minerItem.localStorageName, minerItem.initialValueInLocalStorage + 1);

        updateTextValues();
    }

    $("#buy-miner1, #buy-miner2, #buy-miner3").click((event) => {
        const minerID = event.target.id.split('-')[2];
        buyMinerClickHandling(minerID);
    });

    function minerWork() {
        pageItems.forEach((element) => {
            if (element.miner) {
                updateScore(Number(localStorage.getItem(element.localStorageName)) * element.minerMultiplier);
            }
        });

        updateTextValues();
        setTimeout(minerWork, 1000);
    }

    minerWork();
});
