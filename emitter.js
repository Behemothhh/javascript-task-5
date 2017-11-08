'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

const subscriptionPrototype = {
    isEventsEqual(events) {
        return this.event === events.join('.');
    },
    isEventsSimilar(mainEvent) {
        const subEventsLength = mainEvent.split('.').length;
        const comparingSubEvents = this.event
            .split('.')
            .slice(0, subEventsLength)
            .join('.');

        return mainEvent === comparingSubEvents;
    },
    extraCheck() {
        if (this.options.times) {
            this.options.times--;

            return this.options.times >= 0;
        }
        if (this.options.frequency) {
            this.counter++;

            return this.counter >= this.options.frequency;
        }

        return false;
    }
};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} options
         * @returns {Object}
         */
        on: function (event, context, handler, options = { frequency: 1 }) {
            subscriptions.push({
                event,
                func: handler.bind(context),
                context,
                counter: options.frequency,
                options
            });
            Object.setPrototypeOf(subscriptions[subscriptions.length - 1], subscriptionPrototype);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            subscriptions = subscriptions.filter(subscription => {
                const isContextEqual = subscription.context === context;

                return !isContextEqual || !subscription.isEventsSimilar(event);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let subEvents = event.split('.');

            while (subEvents.length) {
                subscriptions.forEach(subscription => {
                    if (subscription.isEventsEqual(subEvents) && subscription.extraCheck()) {
                        subscription.counter = 0;
                        subscription.func();
                    }
                });
                subEvents.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            const options = times < 1 ? undefined : { times };

            return this.on(event, context, handler, options);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            const options = frequency < 1 ? undefined : { frequency };

            return this.on(event, context, handler, options);
        }
    };
}
