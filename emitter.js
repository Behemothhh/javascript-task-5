'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

const ORDER = {
    extra: 0,
    on: 1
};

function compareEvents(mainEvents, subEvents, type) {
    let mainEvent = mainEvents.join('.');
    let subEvent;
    if (type === 'full') {
        subEvent = subEvents.join('.');
    } else {
        subEvent = subEvents.slice(0, mainEvents.length).join('.');
    }

    return mainEvent === subEvent;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = [[], []];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} option
         * @returns {Object}
         */
        on: function (event, context, handler, option = { frequency: 1, method: 'on' }) {
            subscriptions[ORDER[option.method]].push({
                events: event.split('.'),
                func: handler.bind(context),
                context,
                counter: 0,
                option
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let events = event.split('.');
            subscriptions = subscriptions.map(method => {
                return method.filter(subscription => {
                    let isContextEqual = subscription.context === context;
                    let isEventsEqual = compareEvents(events, subscription.events);

                    return !isContextEqual || !isEventsEqual;
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            subscriptions.forEach(method => {
                let events = event.split('.');
                while (events.length) {
                    method.forEach(subscription => {
                        let isSame = compareEvents(subscription.events, events, 'full');
                        let option = subscription.option;
                        if (isSame && option.times-- > 0) {
                            subscription.func();
                        } else if (isSame && ++subscription.counter === option.frequency) {
                            subscription.counter = 0;
                            subscription.func();
                        }
                    });
                    events.pop();
                }
            });

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
            let option = times < 1 ? undefined : { times, method: 'extra' };

            return this.on(event, context, handler, option);
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
            let option = frequency < 1 ? undefined : { frequency, method: 'extra' };

            return this.on(event, context, handler, option);
        }
    };
}
