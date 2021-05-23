function solution(A) {
    let result = [];
    class Obj {
        constructor(value) {
            this.val = value;
        }
        value() {
            return this.val;
        }
    }
    for (let i = 0; i < A.length; i++) {
        result.push(new Obj(A[i]))
    }
    return result;
}


function solution(S) {
    const arr = S.split('');
    const result = "NO";
    const regType1 = /([a-z])/;
    const regType2 = /([A-Z])/;
    arr.sort();
    const lowerArr = arr.filter(item => {
        if (item.match(regType1) !== null)
            return item;
    }) 
    const upperArr = arr.filter(item => {
        if (item.match(regType2) !== null)
            return item;
    }) 
    for (let i = upperArr.length; i > 0; i--) {
        const biggest = lowerArr.find(item => {
            if (item.toUpperCase() === upperArr[i]) {
                return upperArr[i];
            }
        }); 
        if (biggest !== undefined) {
            return biggest.toUpperCase();
        }
    }
    return result;
}