$(function() {

    // 点击去登录的链接
    $('#link_log').on('click', function() {
        $('.log_box1').show()
        $('.reg_box1').hide()
        $('.loginAndRegBox').css('height', '270px')
    })

    // 点击去注册的链接
    $('#link_reg').on('click', function() {
        $('.log_box1').hide()
        $('.reg_box1').show()
        $('.loginAndRegBox').css('height', '340px')
    })


    //自定义校验规则
    // 获取layui.form对象
    var form = layui.form
    var layer = layui.layer
        // 自定义一个pwd的校验规则
    form.verify({ pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"] })
        // 自定义一个repass的校验规则
    form.verify({
            repass: function(value) {
                // 属性选择器获取子元素
                var pass = $('.reg_box1 [name=password]').val()
                if (pass !== value) {
                    return '两次密码输入不一致'
                }
            }
        })
        // 监听注册按钮的submit事件
    $('#reg_form').on('submit', function(e) {
            // 阻止表单默认的提交行为
            e.preventDefault()
                // 发起post请求 
            var data = { username: $('#reg_form [name = username]').val(), password: $('#reg_form [name = password]').val() }
            $.post(
                "/api/reguser",
                data,
                function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg('注册成功')
                        // 手动调用去登录事件
                    $('#link_log').click()
                }
            )
        })
        //监听登录按钮的submit事件
    $('#log_form').submit(function(e) {
        // 阻止表单的默认行为
        e.preventDefault()
            // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                    // 登录成功的许可权限保存到本地存储中
                localStorage.setItem('token', res.token)
                    // 跳转到index页面
                location.href = '/index.html'
            }
        })
    })

})