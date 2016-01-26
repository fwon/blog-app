/**
 *  Simple Pub/Sub module
 **/

'use strict';


function Message () {
    this._evtObjs = {};
}
Message.prototype.on = function (evtType, handler) {
    if (!this._evtObjs[evtType]) {
        this._evtObjs[evtType] = [];
    }
    this._evtObjs[evtType].push({
        handler: handler
    })
}
Message.prototype.off = function (evtType, handler) {
    var types;
    if (evtType) {
        types = [evtType];
    } else {
        types = Object.keys(this._evtObjs);
    }
    types.forEach(function (evtType) {
        var handlers = this._evtObjs[evtType] || [],
            newHandlers = [];
        handlers.forEach(function (evtObj) {
            if (evtObj.handler !== handler) {
                newHandlers.push(evtObj)
            }
        });
        this._evtObjs[evtType] = newHandlers;
    }.bind(this));

    return this;
}
Message.prototype.emit = function (evtType, data) {
    var handlers = this._evtObjs[evtType] || [];
    handlers.forEach(function (item) {
        item.handler && item.handler(data);
    });
}

/**
 *  Global Message Central
 **/
var msg = new Message();
Message.on = function () {
    msg.on.apply(msg, arguments);
}
Message.off = function () {
    msg.off.apply(msg, arguments);
}
Message.emit = function () {
    msg.emit.apply(msg, arguments);
}


export default Message;
