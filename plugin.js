/*
 * BBCode Plugin v1.0 for CKEditor - http://www.site-top.com/
 * Copyright (c) 2010, PitBult.
 * - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 */

CKEDITOR.plugins.add('bbcode',
{
  requires: ['htmlwriter'],
  init: function(editor) {
    editor.dataProcessor = new CKEDITOR.htmlDataProcessor(editor);
  }
});

CKEDITOR.htmlDataProcessor.prototype = {
  toHtml: function(data, fixForBody) {
    // Convert < and > to their HTML entities.
    data = data.replace(/</g, '&lt;');
    data = data.replace(/>/g, '&gt;');

    // Convert line breaks to <br>.
    data = data.replace(/(?:\r\n|\n|\r)/g, '<br>');

    // [url]
    data = data.replace(/\[url\](.+?)\[\/url]/gi, '<a href="$1">$1</a>');
    data = data.replace(/\[url\=([^\]]+)](.+?)\[\/url]/gi, '<a href="$1">$2</a>');

    // [b]
    data = data.replace(/\[b\](.*?)\[\/b]/gi, '<b>$1</b>');

    // [i]
    data = data.replace(/\[i\](.*?)\[\/i]/gi, '<i>$1</i>');

    // [u]
    data = data.replace(/\[u\](.*?)\[\/u]/gi, '<u>$1</u>');

    // [h3]
    data = data.replace(/\[h3\](.*?)\[\/h3](?:<br ?\/?>|\n)?/gi, '<h3>$1</h3>');

    // [img]
    data = data.replace(/\[img\](.*?)\[\/img\]/gi,'<img src="$1" />');
    data = data.replace(/\[img class=([\w-]+)\](.*?)\[\/img\]/gi,'<img class="$1" src="$2" />');

    // [quote]
    data = data.replace(/\[quote\]/gi, '<blockquote>');
    data = data.replace(/\[\/quote]/gi, '</blockquote>');

    // [poster]
    data = data.replace(/\[poster\](.+?)\[\/poster]/gi, '<div class="text-poster">$1</div>');

    // [code]
    data = data.replace(/\[code\]/gi,'<code>');
    data = data.replace(/\[\/code\]/gi,'</code>');

    // [size]
    data = data.replace(/\[size=(\d+)\](.*?)\[\/size\]/gi,'<span style="font-size: $1px">$2</span>');

    // [color]
    data = data.replace(/\[color=(.*?)\](.*?)\[\/color\]/gi,'<span style="color: $1">$2</span>');

    // smileys
    for (var i = 0; i < this.editor.config.smiley_images.length; i++) {
      var smiley = this.editor.config.smiley_images[i].replace('.gif', '');
      if (data.indexOf(smiley) != -1) {
        data = data.split(smiley).join('<img src="'+ this.editor.config.smiley_path + this.editor.config.smiley_images[i] + '" class="smiley" />');
      }
    }

    return data;
  },
  toDataFormat : function(html, fixForBody ) {
    if (html == '<br>' || html == '<p><br></p>') {
      return "";
    }
    // Convert <br> to line breaks.
    html = html.replace(/<br><\/p>/gi,"\n");
    html = html.replace(/<br(?=[ \/>]).*?>/gi, '\r\n');
    html = html.replace(/<p>/gi,"");
    html = html.replace(/<\/p>/gi,"\n");
    html = html.replace(/&nbsp;/gi," ");

    // [url]
    html = html.replace(/<a .*?href=(["'])(.+?)\1.*?>(.+?)<\/a>/gi, '[url=$2]$3[/url]');

    // [b]
    html = html.replace(/<(?:b|strong)>/gi, '[b]');
    html = html.replace(/<\/(?:b|strong)>/gi, '[/b]');

    // [i]
    html = html.replace(/<(?:i|em)>/gi, '[i]');
    html = html.replace(/<\/(?:i|em)>/gi, '[/i]');

    // [u]
    html = html.replace(/<u>/gi, '[u]');
    html = html.replace(/<\/u>/gi, '[/u]');

    // [h3]
    html = html.replace(/<h3>/gi, '[h3]');
    html = html.replace(/<\/h3>/gi, '[/h3]\n');

    // smileys
    html = html.replace(/<img .*?src=(["']).+?(:.+?:?|(\W)_\3).gif\1.*?>/gi, '$2');

    // [img]
    html = html.replace(/<img .*?class=(["'])([\w-]+)\1.*?src=(["'])(.+?)\3.*?>/gi, '[img class=$2]$4[/img]');
    html = html.replace(/<img .*?src=(["'])(.+?)\1.*?>/gi, '[img]$2[/img]');

    // [quote]
    html = html.replace(/<blockquote>/gi, '[quote]');
    html = html.replace(/\n*<\/blockquote>/gi, '[/quote]');

    // [poster]
    html = html.replace(/<div class="text-poster">([\s\S]+?)<\/div>/gi, '[poster]$1[/poster]');

    // [code]
    html = html.replace(/<code>/gi, '[code]');
    html = html.replace(/<\/code>/gi, '[/code]');

    // [color]
    html = html.replace(/<span style="color: ?(.*?);?">(.*?)<\/span>/gi,"[color=$1]$2[/color]");

    // [size]
    html = html.replace(/<span style="font-size: ?(\d+)px;?">(.*?)<\/span>/gi,"[size=$1]$2[/size]");

    // Remove remaining tags.
    html = html.replace(/<[^>]+>/g, '');

    // Restore < and >
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');

    // Restore (and )
    html = html.replace(/%28/g, '(');
    html = html.replace(/%29/g, ')');

    // Restore %20
    html = html.replace(/%20/g, ' ');

    return html;
  }
};
