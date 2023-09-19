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
        }, 
        {
            localStorageName: 'boosterValue', 
            initialValueInLocalStorage: 1
        }, 
        {
            localStorageName: 'booster1', 
            // SCHEDULE TIME
            initialValueInLocalStorage: 60,
            boosterByTime: true,
            boosterIdentity: 1,
            HTMLBoosterLink: 'boosterItem1',
            HTMLCounter: 'counterBoosterX3',
            boosterMultiplicator: 3
        }, 
        {
            localStorageName: 'booster2', 
            // SCHEDULE TIME
            initialValueInLocalStorage: 300,
            boosterByTime: true,
            boosterIdentity: 2,
            HTMLBoosterLink: 'boosterItem2',
            HTMLCounter: 'counterBoosterX5',
            boosterMultiplicator: 5
        }, 
        {
            localStorageName: 'booster3', 
            // 1 = NO BOOST | 0 = BOOST
            initialValueInLocalStorage: 1,
            boosterIdentity: 3,
            boosterByTime: false,
            chance: 7500,
            HTMLBoosterLink: 'boosterItem3',
            HTMLCounter: 'counterBoosterX10',
            boosterMultiplicator: 10
        }
    ]

    initializeLocalStorage();
    updateTextValues();
    localStorage.setItem('boosterValue', 1);

    function getPageItemByLocalStorageName(nameInLocalStorage) {
        return pageItems.find(element => element.localStorageName === nameInLocalStorage);
    }

    function getPageItemByHTMLBoosterLink(htmlName) {
        return pageItems.find(element => element.HTMLBoosterLink === htmlName);
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
            let textToSet = Number(localStorage.getItem(element.localStorageName));

            if(element.localStorageName.localeCompare('upgradeVal') == 0) {
                textToSet = Number(localStorage.getItem(element.localStorageName)) * Number(localStorage.getItem(getPageItemByLocalStorageName('boosterValue').localStorageName));
            }            

            $(`#${element.HTMLitemName}`).text(textToSet);
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
        score = score * Number(localStorage.getItem(getPageItemByLocalStorageName('boosterValue').localStorageName));

        pageItems.slice(0, 2).forEach((element) => {
            const currentValue = Number(localStorage.getItem(element.localStorageName));
            localStorage.setItem(element.localStorageName, currentValue + score);
        });
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    $("#count-erhoehen").click(() => {
        let booster3 = getPageItemByLocalStorageName('booster3');
        let compareNumber = getRandomInt(booster3.chance);
        const updateValue = Number(localStorage.getItem('upgradeVal'));

        if(2 > compareNumber && Number(localStorage.getItem(booster3.localStorageName)) != 0) {
            localStorage.setItem(booster3.localStorageName, 0);
            toastBootstrap.show();
        }

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
        let price = localStorage.getItem(upgradeItem.localStorageName);
        const score = Number(localStorage.getItem(pageItems[0].localStorageName));
        
        if (score < price) {
            return;
        }

        localStorage.setItem(pageItems[0].localStorageName, score - price);
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
        let price = localStorage.getItem(minerUpgradeItem.localStorageName);
        const score = Number(localStorage.getItem(pageItems[0].localStorageName));

        if (score < price || Number(localStorage.getItem(minerItem.localStorageName)) >= minerUpgradeItem.maxLvl) {
            return;
        }

        localStorage.setItem(pageItems[0].localStorageName, score - price);
        localStorage.setItem(minerUpgradeItem.localStorageName, minerUpgradeItem.upgradePriceIncrease + Number(localStorage.getItem(minerUpgradeItem.localStorageName)));
        localStorage.setItem(minerItem.localStorageName, Number(localStorage.getItem(minerItem.localStorageName)) + 1);

        updateTextValues();
    }

    $("#buy-miner1, #buy-miner2, #buy-miner3").click((event) => {
        const minerID = event.target.id.slice(-1);
        buyMinerClickHandling(minerID);
    });
    
    function minerWork() {
        pageItems.forEach((element) => {
            if (element.miner) {
                updateScore(Number(localStorage.getItem(element.localStorageName)) * element.minerMultiplier);
            }
        });

        updateTextValues();
    }

    function countBoosterTimerDown() {
        pageItems.forEach((element) => {
            if (element.boosterIdentity != null) {

                let htmlItem = document.getElementById(element.HTMLBoosterLink);
                let htmlCounter = document.getElementById(element.HTMLCounter);

                let boosterCount = Number(localStorage.getItem(element.localStorageName));
                
                if(localStorage.getItem(element.localStorageName).localeCompare(0) == 0) {
                    htmlItem.classList.add('active');
                    htmlCounter.hidden = true;
                    return;
                } else {
                    htmlCounter.hidden = false;
                    htmlItem.classList.remove('active');
                }

                if(element.boosterIdentity == 3) {
                    htmlCounter.hidden = true;
                    return;
                }

                if(localStorage.getItem(element.localStorageName) > element.initialValueInLocalStorage) {
                    htmlCounter.hidden = true;
                }

                htmlCounter.textContent = boosterCount;

                localStorage.setItem(element.localStorageName, boosterCount - 1);
            }
        });
    }

    $("#boosterItem1, #boosterItem2, #boosterItem3").click((event) => {
        if(!event.target.classList.contains('active')) {
            return;
        }

        // set class running when running booster
        let boosterInPageItems = getPageItemByLocalStorageName('boosterValue');
        let itemInPageItems = getPageItemByHTMLBoosterLink(event.target.id);

        localStorage.setItem(boosterInPageItems.localStorageName, Number(localStorage.getItem(boosterInPageItems.localStorageName)) + Number(itemInPageItems.boosterMultiplicator) - 1);

        event.target.classList.remove('active');
        event.target.classList.add('running');

        localStorage.setItem(itemInPageItems.localStorageName, Number(itemInPageItems.initialValueInLocalStorage) + 5);

        setTimeout(() => {
            event.target.classList.remove('active');
            localStorage.setItem(boosterInPageItems.localStorageName, Number(localStorage.getItem(boosterInPageItems.localStorageName)) - itemInPageItems.boosterMultiplicator + 1)
            event.target.classList.remove('running');
        }, 5000);
    });

    function scheduleInMilliseconds() {
        minerWork();
        countBoosterTimerDown();

        setTimeout(scheduleInMilliseconds, 1000);
    }

    scheduleInMilliseconds();

    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
});