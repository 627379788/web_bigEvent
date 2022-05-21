$(function() {
    getUserInfor()
        //退出事件
    var layer = layui.layer
    $('.icon-tuichu').on('click', function() {
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' },
            function(index) {
                // 1.删除takon
                localStorage.removeItem('token')
                    // 2.跳转到登录界面
                location.href = '/login.html'
                layer.close(index);
            });
    })
})

// 获取用户基本信息
function getUserInfor() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // 判断是否调用成功
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //   渲染用户的基本信息
            renderAvatar(res.data)
        },


    })
}
// 渲染头像的用户信息
function renderAvatar(user) {
    // 1.获取name属性值
    var name = user.nickname || user.username
        // 2.渲染html页面
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3.判断是否有属性
    if (user.user_pic != null) {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }

}