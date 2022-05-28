$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtcateList()
        // 获取文章分类列表
    function initArtcateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定单击事件
    var addArtIndex = null
    $('#addClass').on('click', function() {
            addArtIndex = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            });
        })
        // 通过代理给确定添加绑定submit事件
    $('body').on('submit', '#art_add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('添加分类失败')
                    }
                    layer.msg('添加分类成功')
                    initArtcateList()
                        // 根据索引关闭对应的弹出层
                    layer.close(addArtIndex)
                }
            })
        })
        // 通过代理的方式给编辑按钮添加点击事件
    var editArtIndex = null
    $('tbody').on('click', '#edit_class', function(e) {
            e.preventDefault()
            editArtIndex = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            });
            var edit_id = $(this).attr('edit_id')
            $.ajax({
                method: 'get',
                url: '/my/article/cates/' + edit_id,
                success: function(res) {
                    // 利用layui的form.val快速填充表格
                    form.val('art_edit', res.data)
                }
            })
        })
        //通过代理方式给编辑的按钮绑定submit事件
    $('body').on('submit', '#art_edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('分类修改失败！')
                    }
                    layer.msg('分类修改成功')
                    initArtcateList()
                    layer.close(editArtIndex)
                }
            })
        })
        //通过代理方式给删除的按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function(e) {
        e.preventDefault()
        var id = $(this).attr('delete_id')
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtcateList()
                }
            })
        });

    })
})