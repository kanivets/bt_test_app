var WebApp = {
  start: function() {
      
    setTimeout(function() { window.scrollTo(0, 1) }, 100);
    
    //get bt latest news xml
    $.ajax({
      type: "GET",
      url: bt_latest_news_xml_url,
      dataType: "xml",
      success: function(xml) {
        //building news list
        $(xml).find('item').each(function(){
          var article = {};
          article.title = $(this).find('title').text();
          article.date = $(this).find('pubDate').text();
          article.img = $(this).find('enclosure').attr('url');
          article.id = parseInt($(this).find('guid').text());
          if (article.img) {
            var last_article_block = "<li>";
            last_article_block += "<article>";
            last_article_block += "<a href='#article_" + article.id + "' rel='" + article.id + "'>";
            last_article_block += "<img src='" + article.img + "' alt=''/>";
            last_article_block += article.title;
            last_article_block += "<span>" + article.date + "</span>";
            last_article_block += "</a>";
            last_article_block += "</article>";
            last_article_block += "</li>";
            $('#main section ul').append(last_article_block);
          }
        });
        //end building news list
        $(".loader").hide();
        
        $("nav a").click(function() {
          if ($(this).attr('class') == 'back') {
            $("#article").hide();
            $("#main").show().addClass("enter-left");
            return false;
          }
          else if ($(this).attr('class') == 'prev')
          {
            //will be
          }
          else if ($(this).attr('class') == 'next')
          {
            //will be
          }
          else
          {
            $("nav a").removeClass('current');
            $(this).addClass('current');
          }
        });

        $('#main section ul').show();
        
        $("#main article a").click(function() {
          //get article
          var id = $(this).attr('rel');
          var bt_article_xml_url = 'http://test.ukrview.net/test_node.php?id=' + id;
          $.ajax({
            type: "GET",
          	url: bt_article_xml_url,
          	dataType: "xml",
          	success: function(xml) {
                  var article = {};
                  article.date = $(xml).find('pubDate');
                  article.date = $(article.date[0]).text();
                  article.content = $(xml).find('content').text();
                  article.img = $(xml).find('enclosure').attr('url');
                  article.title = $(xml).find('item').find('title');
                  article.title = $(article.title[0]).text();
                  $("#article h1").html(article.title);
                  $("#article img").attr('src', article.img);
                  $("#article .text").html(article.content);
                  $("#article header").html(article.date);
                  $("#main").hide();
                  setTimeout(function() { window.scrollTo(0, 1) }, 100);
                  $("#article").show().addClass("enter-right");
          	}});
          //end get article


      	  return false;
    	  });
  	}
  });
  //end get bt latest news xml
	$("#article").hide();

  }
}

window.onload = WebApp.start();