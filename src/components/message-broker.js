function MessageBroker() {
    const topics = {};

    function newOrExistingTopic(topic) {
        return  topics[topic] || [];
    }

    function listen(topic, handler) {
        topics[topic] = [ ...newOrExistingTopic(topic), handler ];
    }

    function produce(topic, message) {
        newOrExistingTopic(topic).map(handler => handler(message));
    }

    return {
        listen,
        produce,
    };
}

export default MessageBroker;
