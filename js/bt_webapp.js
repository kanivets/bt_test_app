var WebApp = {

  contentStorage: {},

  storeArticle: function(id) {
    var articleHTML = '';

    //proxy variant
    var bt_article_xml_url = 'http://test.ukrview.net/test_node.php?id=' + id;    

    //no proxy with phoegap
    //var bt_article_xml_url = 'http://www.bt.dk/mecommobile/node/' + id + '?output_type=xml';

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
        articleHTML = '<h1>'+ article.title +'</h1>';
        articleHTML += '<img src="'+ article.img +'" alt="" >';
        articleHTML += '<div class="text">'+ article.content +'</div>';
        WebApp.contentStorage[id] = articleHTML;
      }});
  },

  start: function() {
    setTimeout(function() { window.scrollTo(0, 1) }, 100);

    //get bt latest news xml
    $.ajax({
      type: "GET",
      url: bt_latest_news_xml_url,
      dataType: "xml",
      success: function(xml) {
        //removing of related articles
        $(xml).find('related').remove();
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
            last_article_block += "<a href='#article_" + article.id + "' rel='" + article.id + "' ontouchstart='$(this).addClass(\"active\");' ontouchend='$(this).removeClass(\"active\");' ontouchmove='$(this).removeClass(\"active\");'>";
            last_article_block += "<img src='" + article.img + "' alt=''/>";
            last_article_block += article.title;
            last_article_block += "<span>" + article.date + "</span>";
            last_article_block += "</a>";
            last_article_block += "</article>";
            last_article_block += "</li>";
            $('#main section ul').append(last_article_block);
            WebApp.storeArticle(article.id);
          }
        });
        //end building news list
        $(".loader").hide();
        $("nav").hide();

        $("nav a").click(function() {
          if ($(this).attr('class') == 'back') {
            $("#article, nav, #auth").hide();
            $("#main").show().addClass("enter-left");
            return false;
          }

          if ($(this).attr('class') == 'auth') {
            $("#article").hide();
            $("#auth").show().addClass("enter-left");
            return false;
          }
        });

        $('#main section ul').show();

        $("#main article a").click(function() {

          //get article
          var id = $(this).attr('rel');

          // =========================
          // load stored article
          // =========================
          $('#article section article').html(WebApp.contentStorage[id]);
          $("#main").hide();
          //setTimeout(function() { window.scrollTo(0, 1) }, 100);
          $("#article").show().addClass("enter-right");
          //$('.iphone #scroller').css('-webkit-transform','translate3d(0px, 0px, 0px)');

          $('#footer').show();
          

          // =========================
          // load article from url
          // =========================
          //var bt_article_xml_url = 'http://test.ukrview.net/test_node.php?id=' + id;
          //$.ajax({
          //  type: "GET",
          //	url: bt_article_xml_url,
          //	dataType: "xml",
          //	success: function(xml) {
          //       var article = {};
          //        article.date = $(xml).find('pubDate');
          //        article.date = $(article.date[0]).text();
          //        article.content = $(xml).find('content').text();
          //        article.img = $(xml).find('enclosure').attr('url');
          //        article.title = $(xml).find('item').find('title');
          //        article.title = $(article.title[0]).text();
          //        $("#article h1").html(article.title);
          //        $("#article img").attr('src', article.img);
          //        $("#article .text").html(article.content);
          //        //$("#article header").html(article.date);
          //        $("#main").hide();
          //        setTimeout(function() { window.scrollTo(0, 1) }, 100);
          //        $("#article").show().addClass("enter-right");
          //        $('#scroller').css('-webkit-transform','translate3d(0px, 0px, 0px)');
          //  }});
          //end get article


      	  return false;
    	  });
  	}
  });
  //end get bt latest news xml
	$("#article, #auth").hide();

  },

  auth_start: function() {
    $('.auth_profile').html('Not authentificated.');
    $('iframe#myId').load(function() {
        $('.auth_profile').html('Authentification processed!');
        $('.auth_profile').load('http://www.bt.dk/profile #my-profile', function() {
          var clean_profile = $('.auth_profile .plus-profile').html();
          $('.auth_profile').html(clean_profile);
        });
    });
  }
}

$(document).ready(function() {
    WebApp.start();
    loaded();
    WebApp.auth_start();
});

function setHeight() {
	var headerH = document.getElementById('header').offsetHeight;
	var	footerH = document.getElementById('footer').offsetHeight;
	var	wrapperH = window.innerHeight - headerH - footerH;
	document.getElementById('wrapper').style.height = wrapperH + 'px';
}

function loaded() {

  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf("android") > -1;
  var isiPhone = ua.indexOf("iphone") > -1;
  if(isAndroid) {
    //android part
    //alert('this is android');
    $('body').addClass('android');
  } else if (isiPhone) {
  //} else {
    //iPhone part here we will load iScroll and start it !!!NOT TESTED need to test on iPhone!!!!
    //alert('this is iPhone');

    setHeight();
    // Check screen size on orientation change
    window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', setHeight, false);
    //document.addEventListener('DOMContentLoaded', loaded);

    $('body').addClass('iphone');
    $.getScript('js/iscroll.js', function(){
      document.addEventListener('touchmove', function(e){ e.preventDefault(); });
      myScroll = new iScroll('scroller', {desktopCompatibility:true});
    });
  }
}