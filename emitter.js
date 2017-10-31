'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function compareEvents(mainEvents, subEvents) {
    let mainEvent = mainEvents.join('.');
    let subEvent = subEvents.slice(0, mainEvents.length).join('.');

    return mainEvent === subEvent;
}

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
         * @param {Object} option
         * @returns {Object}
         */
        on: function (event, context, handler, option = { frequency: 1 }) {
            subscriptions.push({
                events: event.split('.'),
                func: handler.bind(context),
                context,
                counter: option.frequency,
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
            subscriptions = subscriptions.filter(subscription => {
                let isContextEqual = subscription.context === context;
                let isEventsEqual = compareEvents(events, subscription.events);

                return !isContextEqual || !isEventsEqual;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let events = event.split('.');
            subscriptions
                .sort((first, second) => second.events.length - first.events.length)
                .forEach(subscription => {
                    let isSameEvents = compareEvents(subscription.events, events);
                    let option = subscription.option;
                    if (isSameEvents && option.times-- > 0) {
                        subscription.func();
                    } else if (isSameEvents && ++subscription.counter >= option.frequency) {
                        subscription.counter = 0;
                        subscription.func();
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
            let option = times < 1 ? undefined : { times };

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
            let option = frequency < 1 ? undefined : { frequency };

            return this.on(event, context, handler, option);
        }
    };
}
