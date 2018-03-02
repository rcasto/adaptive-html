import AdaptiveHtml from '../../../index';

// AdaptiveHtml.transform('testing');
// AdaptiveHtml.transform('<div>Hello Div</div>');
// AdaptiveHtml.transform('Hello there <em>emphasis</em> and <strong>Strong</strong> text!');
// AdaptiveHtml.transform('<h1>This is a level 1 header</h1><p>Now we are back to our <strong>regular size</strong></p><p>Blah <em>blah</em> blah</p>');
// AdaptiveHtml.transform('<p><strong>This</strong> is a <em>simple</em> sentence</p>');
// AdaptiveHtml.transform('<p><a href="https://google.com">Link</a> to some site called <strong>Google</strong></p>');
// AdaptiveHtml.transform('<p><img alt="This is the image alt text" src="https://cdn.pixabay.com/photo/2017/01/18/08/25/social-1989152_1280.jpg" style="height:334px; width:500px" /></p><p>That was something</p>');
AdaptiveHtml.transform('<ul><li>This is a simple list item</li><li><strong>This one</strong> is more <em>unique</em></li><li><em><img alt="This is a photo" src="https://cdn.pixabay.com/photo/2015/01/09/11/11/office-594132_1280.jpg" style="height:133px; width:200px" /></em></li><li><em>Another item just for good measure</em></li></ul>');