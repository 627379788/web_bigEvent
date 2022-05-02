/* 封装一个js
执行jquery ajax操作时会先调用ajaxPrefilter这个函数，拼接url地址 */
$(function() {
    $.ajaxPrefilter(function(options) {
        options.url = 'http://www.liulongbin.top:3007' + options.url
    })
})