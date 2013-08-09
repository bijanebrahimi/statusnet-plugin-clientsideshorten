//wrap everything in a self-executing anonymous function to avoid conflicts
(function(){

    // smart(x) from Paul Irish
    // http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/

    (function($,sr){

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function (func, threshold, execAsap) {
            var timeout;

            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap)
                        func.apply(obj, args);
                        timeout = null;
                };

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }
        jQuery.fn[sr] = function(fn){  return fn ? this.bind('keypress', debounce(fn, 1000)) : this.trigger(sr); };

    })(jQuery,'smartkeypress');

    function longestWordInString(string)
    {
        var words = string.split(/\s/);
        var longestWord = 0;
        for(var i=0;i<words.length;i++)
            if(words[i].length > longestWord) longestWord = words[i].length;
        return longestWord;
    }

    function shorten(element)
    {
        // 
        var noticeText = $(element).val();
        var regex = /(((https?|ftps?|mms|rtsp|gopher|news|nntp|telnet|wais|file|prospero|webcal|irc)|(mailto|aim|tel|xmpp)):\/\/[^ ]+)/g
        var noticeTextURLs = noticeText.match(regex)
        if (!noticeTextURLs)
            return null
        for(var index=0; index<noticeTextURLs.length; index++){
            var noticeTextURL = noticeTextURLs[index]
            if(noticeText.length > maxNoticeLength || noticeTextURL > maxUrlLength) {
                shortenAjax = $.ajax({
                    // There should be a better way to get the SN base URL
                    url: $('address .url')[0].href+'/plugins/ClientSideShorten/shorten',
                    data: { text: noticeTextURL },
                    dataType: 'json',
                    success: function(data) {
                        var noticeDataTextNew = $(element).val()
                        var noticeDataTextNew = noticeDataTextNew.replace(data[0], data[1])
                        $(element).val(noticeDataTextNew).keyup()
                    }
                });
            }
        }
    }

    $(document).ready(function(){
        var noticeDataText = $('.notice_data-text');
        $(noticeDataText).smartkeypress(function(e){
            //if(typeof(shortenAjax) !== 'undefined') shortenAjax.abort();
            if(e.charCode == '32') {
                shorten(this);
            }
        });
        $(noticeDataText).bind('paste', function() {
            //if(typeof(shortenAjax) !== 'undefined') shortenAjax.abort();
            setTimeout(shorten(this),1);
        });
    });

})();
