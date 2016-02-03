```javascript
// Non-standard and deprecated way

var o = {};
o.__defineGetter__("gimmeFive", function() { return 5; });
console.log(o.gimmeFive); // 5


// Standard-compliant ways

// Using the get operator
var o = { get gimmeFive() {return 5}};
console.log(o.gimmeFive); // 5
o.__lookupGetter__('gimmeFive');
//function gimmeFive() {return 5}

// Using Object.defineProperty
var o = {}
Object.defineProperty(o, 'gimmeFive', {
    get: function() {
        return 5;
    }
});
console.log(o.gimmeFive); // 5
```