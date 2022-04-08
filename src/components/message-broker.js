function MessageBroker() {
    const topics = {};

    function newOrExistingTopic(topic) {
        return  topics[topic] || [];
    }

    function listen(topic, handler) {
        topics[topic] = [ ...newOrExistingTopic(topic), handler ];
    }

    function produce(topic, message) {
        newOrExistingTopic(topic).forEach(handler => setTimeout(() => handler(message), 0));
    }

    return {
        listen,
        produce,
    };
}

export default MessageBroker;
