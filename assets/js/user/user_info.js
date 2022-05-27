$(function() {
    var form = layui.form
    var layer = layui.layer
        // 自定义layui的名称验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6 || value.length < 1) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    initUserInfo()
        // 获取用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo/',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置按钮的单击事件
    $('#btnReset').on('click', function(e) {
        // 1.阻止默认行为
        e.preventDefault()
            // 2.调用获取用户基本信息方法
        initUserInfo()
    })

    //表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            // 通过serialize序列化方法获取表单的url字符串
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                console.log($(this).serialize());
                // 修改成功,重新渲染父页面index的用户名称和头像
                window.parent.getUserInfor()
            }
        })
    })
})