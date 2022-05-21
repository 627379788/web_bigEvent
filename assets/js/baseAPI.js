/* 封装一个js
执行jquery ajax操作时会先调用ajaxPrefilter这个函数，拼接url地址 */
$(function() {
    $.ajaxPrefilter(function(options) {
        options.url = 'http://www.liulongbin.top:3007' + options.url
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        // 发起请求一定会执行complete函数 阻止没有权限的直接跳转
        options.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
                // 1.强制删除token
                localStorage.removeItem('token')
                    // 2.跳转回登录页面
                location.href = '/login.html'
            }
        }
    })
})