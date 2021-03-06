if (!arguments[0]) {
  print('to build a chapter:');
  print('jsc builder/builder.js -- chapter "`cat src/book.html`" "`cat src/book.css`" 1 "`cat src/1.html`" > chapter1.html');
  print('or for the TOC:');
  print('jsc builder/builder.js -- toc     "`cat src/book.html`" "`cat src/book.css`"   "`head -1 src/1.html src/2.html`" > index.html');
  quit();
}

var template = arguments[1],
    css = arguments[2];

if (arguments[0] === 'chapter') {

  var chapnum = "Chapter" + arguments[3],
      chap = arguments[4],
      lines = chap.split("\n"),
      title = lines.shift().replace('<h1>', '').replace('</h1>', '');

  chap = lines.join("\n");

  load('builder/cssmin.js');

} else { // T-O-C, TOC
  var headings = arguments[3].split("\n\n"),
      chapnum = 'TOC',
      title = "Table of Contents",
      chap = '',
      num, head;

  chap = '<ul class="toc">';
  headings.forEach(function(h) {
    h = h.split("\n");
    num = h[0].match(/\d/);
    head = h[1].replace(/<h1>|<\/h1>/g, '');
    chap += '<li><a href="chapter' + num + '.html">Chapter ' + num + ': ' + head + '</a></li>';
  });
  chap += '</ul>';

}

print(getTemplate(
  template,
  css,
  chapnum,
  title,
  chap
));

function getTemplate(t, css, num, title, content) {
  load('builder/cssmin.js');
  return t.
    replace(
      /<link rel="stylesheet" href="book.css">/, 
      "<style>" + YAHOO.compressor.cssmin(css) + "</style>"
    ).
    replace(
      /==GIMMENUMBER==/g,
      num
    ).
    replace(
      /==GIMMETITLE==/g,
      title
    ).
    replace(
      /==GIMMECHAPTER==/,
      content.replace(/<img src="..\/images/g, '<img src="images')
    );
}