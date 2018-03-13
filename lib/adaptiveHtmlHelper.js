import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';

function toHTML(json) {
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${json} is not valid Adaptive Card JSON.`);
    }
}

export default {
    toHTML
};