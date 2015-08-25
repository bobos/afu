// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
        return true;
    }
    return false;
};

function pushArray(list, element) {
    var retCode = list.pushIfNotExist(element, function(e) { 
        return element === e;});
    return {ret: retCode, array: list};
}

exports.pushArray = pushArray;
