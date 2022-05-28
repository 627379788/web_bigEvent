$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义一个查询的参数对象，将来请求数据的时候
        // 需要将请求对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }
    initTable()
    initCate()
        //定义美化事件的构造器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data)
            var years = dt.getFullYear()
            var month = padZero(dt.getMonth() + 1)
            var day = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return years + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义一个补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 获取文章列表的函数
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面数据
                var tableStr = template('list_table', res)
                $('tbody').html(tableStr)
                    //调用renderPage方法，渲染分页
                renderPage(res.total)
            }
        })
    }
    // 获取文章类别的函数
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
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
    //为筛选按钮绑定submit事件
    $('#choose_form').on('submit', function(e) {
            // 1.阻止表单默认行为
            e.preventDefault()
                //2.修改q对象对应的id和发布状态
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
            q.cate_id = cate_id
            q.state = state
                // 3.调用获取文章列表函数，重新渲染列表区域
            console.log(q.state)
            initTable()
        })
        //定义跳转页函数
    function renderPage(total) {
        // 调用laypage.render函数来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            limits: [2, 3, 5, 10, 20],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 当点击页面执行，jump回调函数 
            // 触发jump函数的方式有两种
            //1.点击页码的时候会触发jump回调
            //2.调用laypage.render的时候会触发jump回调
            //3.切换条目也会触发jump回调
            jump: function(obj, first) {
                // 获取当前的页码值，并赋值给q.pagenum
                q.pagenum = obj.curr
                    //把最新的条目数赋值给q.pagesize
                q.pagesize = obj.limit

                //可以通过first的值判断是哪种方式触发的jump
                //如果第一种first的值为undefind,第二种first值为true
                if (!first) {
                    // 重新渲染列表区域
                    initTable()
                }

            }

        })
    }
    //通过代理方式为删除按钮绑定一个点击事件
    $('tbody').on('click', '.delete_Art', function(e) {
        //获取删除按钮的个数
        var len = $('.delete_Art').length
            // 获取自定义的id属性
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function(index) {
            e.preventDefault()
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功!')
                        //判断删除按钮长度len长度是否为1，如果为1则页面值-1
                    if (len === 1) {
                        // 判断页码值是否为1，为1则不变，否则页码值-1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    //重新渲染table区域
                    initTable()
                }
            })
            layer.close(index);
        });


    })
})