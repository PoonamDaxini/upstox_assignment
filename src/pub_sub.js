/*!
* Pub/Sub implementation
* http://addyosmani.com/
* Licensed under the GPL
* http://jsfiddle.net/LxPrq/
*/



var PubSubManager = new (function() {
    var topics = {};
    var subUid = -1;
  
    this.publish = function(topic, message) {
        if (!topics[topic]) {
            return false;
        }


       var subscribers = topics[topic];
       var len = subscribers ? subscribers.length : 0;

       while (len--) {
           subscribers[len].send(JSON.stringify({
               message: message
           }))
         
       }

        return true;
    };
  
    this.subscribe = function(topic, wsSubscriber) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        topics[topic].push(wsSubscriber);
        return true;
    };
  
    this.unsubscribe = function(topic, wsSubscriber) {
      var subscribers = topics[topic];
      if(!!subscribers === false) return;
  
      var subscriberId = subscribers.indexOf(wsSubscriber);
      subscribers.splice(subscriberId);
    };
  });

 


 module.exports = PubSubManager;
