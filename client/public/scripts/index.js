import AdaptiveHtml from '../../../index';

// AdaptiveHtml.transform('testing');
// AdaptiveHtml.transform('<div>Hello Div</div>');
// AdaptiveHtml.transform('There is some <strong>text</strong> with a <a href="https://google.com">Link</a> in <em>it</em>');
// AdaptiveHtml.transform('Hello there <em>emphasis</em> and <strong>Strong</strong> text!');
// AdaptiveHtml.transform('<h1>This is a level 1 header</h1><p>Now we are back to our <strong>regular size</strong></p><p>Blah <em>blah</em> blah</p>');
// AdaptiveHtml.transform('<p><strong>This</strong> is a <em>simple</em> sentence</p>');
// AdaptiveHtml.transform('<p><a href="https://google.com">Link</a> to some site called <strong>Google</strong></p>');
// AdaptiveHtml.transform('<p><img alt="This is the image alt text" src="https://cdn.pixabay.com/photo/2017/01/18/08/25/social-1989152_1280.jpg" style="height:334px; width:500px" /></p><p>That was something</p>');
// AdaptiveHtml.transform('<ul><li>This is a simple list item</li><li><strong>This one</strong> is more <em>unique</em></li><li><img alt="This is a photo" src="https://cdn.pixabay.com/photo/2015/01/09/11/11/office-594132_1280.jpg" style="height:133px; width:200px" /></li><li><em>Another item just for good measure</em></li></ul>');
// AdaptiveHtml.transform('<p>hello<br />there <em>this</em> is a line with<br />breaks in it</p>');
// AdaptiveHtml.transform('<ol><li>This is an ordered list<ol><li>This is a nested ordered list</li></ol></li><li>This <em>one</em> <strong>get&#39;s fancy</strong><br />There is now another line</li></ol>');
// AdaptiveHtml.transform('<h1>This is a heading</h1><p>That was some <strong>really</strong> <em>important</em> stuff</p>');
// AdaptiveHtml.transform(`
//     <ul>
//         <li>list item 1
//             <ul>
//                 <li>
//                     nested list item
//                     <img src="https://images.unsplash.com/photo-1459909633680-206dc5c67abb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7e9283d9297a7140d6ec620a8a7d2e84&auto=format&fit=crop&w=1051&q=80" />
//                     more text afterwards
//                 </li>
//             </ul>
//         </li>
//         <li>list item 2</li>
//     </ul>
// `);
// AdaptiveHtml.transform(`
//     <p>
//         <em>
//             <img alt="" src="https://images.unsplash.com/photo-1507670092296-5c5c6a2b5cc3?ixlib=rb-0.3.5&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;s=3413b9e6d95d354330f7954e85f89019&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80" />
//         </em>
//     </p>
// `);

// AdaptiveHtml.transform(`
//     <h1>This is the main header</h1>
//     <div>
//         <h2>This is a heading</h2>
//         <img alt="" src="https://images.unsplash.com/photo-1507670092296-5c5c6a2b5cc3?ixlib=rb-0.3.5&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;s=3413b9e6d95d354330f7954e85f89019&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80" />
//         <p>This is a paragraph</p>
//         <ol>
//             <li>List item 1</li>
//             <li>List <em>item</em> 2</li>
//             <li>
//                 <span>List item 3</span>
//                 <ul>
//                     <li>Nested list<br />item 1</li>
//                     <li>Nested list item with <a href="https://google.com/">Link</a></li>
//                 </ul>
//             </li>
//         </ol>
//     </div>
// `);

AdaptiveHtml.transform(`
    <ul>
        <li>This is a list item<br />with a break in it</li>
        <li>This is just a normal list item</li>
    </ul>
`);