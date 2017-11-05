'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function compareEvents(mainEvent, compareEvent) {
    const subEventsLength = mainEvent.split('.').length;
    let compareSubEvents = compareEvent.split('.');
    compareSubEvents = compareSubEvents.slice(0, subEventsLength);

    return mainEvent === compareSubEvents.join('.');
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
                const isEventsSame = compareEvents(event, subscription.event);

                return !isContextEqual || !isEventsSame;
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
                    const isEventsEqual = subscription.event === subEvents.join('.');
                    const options = subscription.options;

                    if (isEventsEqual && --options.times >= 0) {
                        subscription.func();
                    } else if (isEventsEqual && ++subscription.counter >= options.frequency) {
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
            const option = times < 1 ? undefined : { times };

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
            const option = frequency < 1 ? undefined : { frequency };

            return this.on(event, context, handler, option);
        }
    };
}
