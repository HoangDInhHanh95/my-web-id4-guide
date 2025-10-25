// tao function forEach2();
Array.prototype.forEach2 = function(callBack, thisValue) {
    const lengths = this.length
    for (let i = 0; i < lengths; i++) {
        if (i in this) {
            callBack.call(thisValue, this[i], i, this);
        }
    }
}

const colors = ['red', 'green', 'blue'];


colors.forEach2(function(centvale, index, arr) {
    console.log(centvale, index, arr);
    console.log(this);
}, thisValue);


// thisValue