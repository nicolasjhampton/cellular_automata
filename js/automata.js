function AutomataFactory(firstYear, columns) {

    const rule0 = {
        "[1,1,1]": 0, "[1,1,0]": 0, "[1,0,1]": 0, "[1,0,0]": 0,
        "[0,1,1]": 0, "[0,1,0]": 0, "[0,0,1]": 0, "[0,0,0]": 0,
    };

    const order = [
        "[1,1,1]", "[1,1,0]", "[1,0,1]", "[1,0,0]",
        "[0,1,1]", "[0,1,0]", "[0,0,1]", "[0,0,0]",
    ];

    const state = {
        prevYear: firstYear,
        rule: rule0
    }

    // unused
    function clearRule() {
        state.rule = rule0;
    }

    // unused
    function getRule() {
        return order.map(key => state.rule[key])
    }

    // public
    function setRule(ruleArray) {
        const newRule = Object.assign({}, rule0);
        ruleArray.forEach((value, index) => newRule[order[index]] = value)
        state.rule = newRule;
    }

    // public
    function updateRule(ruleIndex, ruleState) {
        state.rule[order[ruleIndex]] = ruleState;
    }

    // public
    function setPrevYear(seedYear) {
        state.prevYear = seedYear;
    }

    // public
    function createNewYear() {
        const newYear = [];
        const prevYear = state.prevYear;
        debugger;
        let i = 0;
        let prev;
        let cur;
        let next;
        // Increment through each ON pixel in the last year
        while (i < prevYear.length) {

            ({ prev, cur, next } = parsePixel(i, prevYear));
            
            calcSpaces(newYear, cur, prev);
            
            i = calcPixels(newYear, prevYear, i);

        }

        ({ prev, cur, next } = parsePixel(i, prevYear));

        calcSpaces(newYear, cur, prev);

        state.prevYear = newYear;

        return newYear;
    }

    /** Private
     *  Covers:
     *  [1, 0, 0],
     *  [0, 0, 0],
     *  [1, 0, 1],
     *  [0, 0, 1]
     */
    function calcSpaces(year, curr, prev, accIndex = prev < curr ? prev : 0) {
        
        while(accIndex < curr) {
            const reachesAround = accIndex === 0 && prev === columns - 1;

            if( Math.abs(curr - prev) > 2 ) {
                
                if(accIndex - prev === 1 || reachesAround) {  // accIndex === prev

                    if(state.rule["[1,0,0]"] === 1) {
                        year.push({ coord: [accIndex] });
                    }

                } else {

                    if(state.rule["[0,0,0]"] === 1) {
                        while(curr - accIndex > 1) {
                            year.push({ coord: [accIndex] });
                            accIndex++;
                        }
                    }

                }
            } 
            
            if( curr - accIndex === 1 ) {
                
                if(curr - prev === 2 || reachesAround) {

                    if(state.rule["[1,0,1]"] === 1) {
                        year.push({ coord: [accIndex] });
                    }

                } else {

                    if(state.rule["[0,0,1]"] === 1) {
                        year.push({ coord: [accIndex] });
                    }

                }
            } 

            ++accIndex;

        }

        return year;
        
    }

    /** Private
     *  Covers:
     *  [1, 1, 1],
     *  [1, 1, 0],
     *  [0, 1, 1],
     *  [0, 1, 0]
     */
    function calcPixels(year, prevYear, index) {

        let { prev, cur, next } = parsePixel(index, prevYear);

        do {

            ({ prev, cur, next } = parsePixel(index, prevYear));
            
            const ruleToCheck = getRuleForPixel(prev, cur, next);
            
            if(state.rule[ruleToCheck] === 1) {
                year.push({ coord: [cur] });
            }

            ++index;

        } while (next - cur === 1);
        
        return index;

    }

    // Private
    function getRuleForPixel(prev, cur, next) {
        // the differences will tell us what pixels are to our sides
        const leftDiff = cur - prev;
        const rightDiff = next - cur;
        const left = leftDiff === 1 || (leftDiff === (prev * -1) && prev === columns - 1) ? 1 : 0;
        const right = rightDiff === 1 || (rightDiff === (cur * -1) && cur === columns - 1) ? 1 : 0;
        
        return JSON.stringify([left, 1, right]);
    }

    
    // Private
    function parsePixel(index, prevYear) {
        // Grab the previous, current, and next ON pixels
        // prevPixel and nextPixel may be undefined
        const prevPixel = prevYear[index - 1];
        const pixel = prevYear[index];
        const nextPixel = prevYear[index + 1];

        const firstInYear = prevYear[0].coord[0];
        const lastInYear = prevYear[prevYear.length - 1].coord[0];

        // Grab the coordinate from each pixel
        const prev = prevPixel ? prevPixel.coord[0] : lastInYear; // prevPixel (fill in w/ 0 if pixel is first)
        const cur = pixel ? pixel.coord[0] : firstInYear;
        const next = nextPixel ? nextPixel.coord[0] : firstInYear; // nextPixel or one after last

        return {
            prev,
            cur,
            next
        }
    }
    
    return Object.freeze({
        state,
        setRule,
        updateRule,
        setPrevYear,
        createNewYear,
    });
}



// // public
// function createNewYear() {
//     const newYear = [];
//     const prevYear = state.prevYear;

//     // Increment through each ON pixel in the last year
//     for (let i = 0; i < prevYear.length; ++i) {

//         const { prev, cur, next } = parsePixel(i, prevYear);
        
//         trampoline(calcSpaces, newYear, cur, prev);
        
//         i = trampoline(calcPixels, newYear, prevYear, i);

//     }

//     state.prevYear = newYear;

//     return newYear;
// }



// function trampoline(func, ...args) {
//     let result = func.apply(null, args);

//     while(typeof result === "function") {
//         result = result();
//     }

//     return result;
// }

// /** Private
//  *  Covers:
//  *  [1, 0, 0],
//  *  [0, 0, 0],
//  *  [1, 0, 1],
//  *  [0, 0, 1]
//  */
// function calcSpaces(year, curr, prev, accIndex = prev) {
    
//     if(accIndex >= curr) {
//         return year;
//     }

//     if ( curr - prev > 2 ) {

//         if(state.rule["[1,0,0]"] === 1 && accIndex === prev) {
//             year.push({ coord: [accIndex] });   
//         } else if (state.rule["[0,0,0]"] === 1) {
//             while(curr - accIndex > 1) {
//                 year.push({ coord: [accIndex] });
//                 accIndex++;
//             }
//         }

//     } 
    
//     if( curr - accIndex === 1 ) {
        
//         if(state.rule["[1,0,1]"] === 1 && curr - prev === 2) {
//             year.push({ coord: [accIndex] });
//         } else if(state.rule["[0,0,1]"] === 1) {
//             year.push({ coord: [accIndex] });
//         }
        
//     } 
    
//     return function() {
//         return calcSpaces(year, curr, prev, ++accIndex);
//     }
// }

// /** Private
//  *  Covers:
//  *  [1, 1, 1],
//  *  [1, 1, 0],
//  *  [0, 1, 1],
//  *  [0, 1, 0]
//  */
// function calcPixels(year, prevYear, index) {
    
//     const { prev, cur, next } = parsePixel(index, prevYear);
    
//     const ruleToCheck = getRuleForPixel(prev, cur, next);
    
//     if(state.rule[ruleToCheck] === 1) {
//         year.push({ coord: [cur] });
//     }
    
//     if(next - cur !== 1) {
//         return index;
//     }
    
    
//     return function() {
//         return calcPixels(year, prevYear, ++index);
//     }
// }


