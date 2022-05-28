$(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化富文本编辑器
    initEditor()
        //初始化文章类别
    initCate()
        //获取文章类别
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // 使用模板引擎渲染select下拉框
                var cateStr = template('tpl_cate', res)
                $('[name=cate_id]').html(cateStr)
                    // 调用form.render重新渲染表单
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面按钮绑定个点击事件,模拟文件选择框的点击事件
    $('#chooseImage').on('click', function() {
            $('#cover_file').click()
        })
        // 为文件选择框添加change事件
    $('#cover_file').on('change', function(e) {
            // 得到选择的文件数组列表
            var files = e.target.files
                //判断文件数组列表是否为空
            if (files.length === 0) {
                return
            }
            //根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(files[0])
                //先销毁旧的裁剪区域，再重新设置图片路径 ，之后再创建新的裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        // 定义发布状态
    var art_state = '已发布'

    //给存为草稿按钮绑定一个change事件，修改art_state的值
    $('#btn_save2').on('click', function() {
            art_state = '草稿'
        })
        // 给form表单绑定一个sumbit事件
    $('#form_submit').on('submit', function(e) {
            // 1.阻止表单默认行为
            e.preventDefault()
                //2.获取表单内容，转换为FormData对象
            var fd = new FormData($(this)[0])
                // 3.追加发布状态到formData对象
            fd.append('state', art_state)
                // 4.将封面裁剪过的图片，输出为一个文件
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    //5.把文件追加到FormData对象中
                    fd.append('cover_img', blob)
                        //6.发送ajax请求
                    publishArticle(fd)
                })

        })
        //发布文章的ajax请求
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            /* 注意：如果向服务器提交的是formData格式的数据，
            必须添加以下的两个配置项 */
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})