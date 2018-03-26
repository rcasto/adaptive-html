import AdaptiveHtml from '../dist/adaptive-html.iife';
import test from 'ava';

test('can transform in browser to json', t => {
    var json = AdaptiveHtml.toJSON('blah');
});

// https://github.com/avajs/ava/blob/master/docs/recipes/browser-testing.md