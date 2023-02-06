'use strict';

(function Sarge(){
    console.log('hey');

    let text,ut;

    const checkEvery = 60 * 1 * 1000;
    let meanYellInterval;
    let lastYell;
    let startTime;
    let yellCount;
    let lastCheck;
    let isActive = false;
    let cdf;


    const toggle = () => {
        if (isActive) 
            setInactive()
        else 
            setActive();
    }

    const setActive = () => {
        if (isActive) return;
        console.log('sarge is now active');
        isActive = true;
    }

    const setInactive = () => {
        if (!isActive) return;
        console.log('sarge is now inactive');
        isActive = false;
    }


    const init = () => {
        document.getElementById('onoff').onclick = toggle;
    }


    const wakeUp = () => {
        
        text = "If you're not being productive right now, do 20 pushups";
        ut = new SpeechSynthesisUtterance(text);
    
        meanYellInterval = 15 * 60; // yell every 20 seconds, on average
        lastYell = Date.now(); 
        startTime = Date.now();
        yellCount = 0;
        lastCheck = Date.now();
        isActive = false;
        cdf = constantCDF;
        console.log('Sarge is UP. Wake up maggots!')
    }

    const yell = () => {
        speechSynthesis.speak(ut);
        lastYell = Date.now();
        yellCount += 1;
        console.log(yellCount + ' yells in ' + (Date.now()-startTime)/1000 + ' seconds');
    }

    function constantCDF(x, mean, checkInterval){
        // every check leads to yell with same probability
        return checkInterval/mean; 
    }


    function normCDF(x, mean) {
        // CDF of normal distribution
        // https://stackoverflow.com/a/59217784
        const std = mean/3; // lol

        x = (x - mean) / std
        let t = 1 / (1 + .2315419 * Math.abs(x))
        let d =.3989423 * Math.exp( -x * x / 2)
        let prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
        if( x > 0 ) prob = 1 - prob
        return prob
      }


    const maybeYell = () => {
        if (!isActive) {console.log('sarge is asleep :>> '); return;}

        const dateNow = Date.now();
        const x = (dateNow - lastYell)/1000;
        const checkInterval = (dateNow - lastCheck)/1000;
        lastCheck = dateNow;

        const thr = cdf(x, meanYellInterval, checkInterval);
        const res = Math.random();
        console.log("sarge will decide now:", x, thr, res);

        if (res < thr) 
            yell()
        else 
            console.log('.');
    }


    setInterval(maybeYell, checkEvery);
    init();
    wakeUp();

    console.log("Sarge is done initializing");
})();