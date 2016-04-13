/*!
 * jquery.inlineedit.js v1.0.0
 * @date 2016-04-13
 * @author Franki<franki.yu@starlight-sms.com>
 * @feedback <https://github.com/MooseFrankenstein/inlineedit/issues>
 * Licensed under the MIT license
 */
(function($) {
    // 开启严格模式
    'use strict';
    // 创建一个默认设置对象
    var config = {
        delay: {
            show: 50,
            hide: 75
        }
    };
    // 通过字面量创造一个对象，存储我们需要的共有方法
    var methods = {};
    // 在字面量对象中定义每个单独的方法
    methods.init = function() {
        // 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
        $('.inline-edit').each(function() {
            // 为每个独立的元素创建一个jQuery对象
            var $this = $(this),
                defaults = {
                    delay: {
                        show: 50,
                        hide: 75
                    }
                },
                settings = $.extend(defaults, config),
                timeout,
                input = $this.children('.form-control'),
                save = $this.children('.save'),
                edit = $this.children('.edit'),
                dropdown = $this.children('.drop-toggle'),
                cancel = $this.children('.cancel');
            if (!('ontouchstart' in document.documentElement)) {
                $this.click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
            $this.mouseenter(function() {
                timeout = setTimeout(function() {
                    if (!$this.hasClass('focus')) {
                        $this.addClass('hover');
                    }
                }, settings.delay.show);
            });
            $this.mouseleave(function() {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    $this.removeClass('hover');
                }, settings.delay.hide);
            });
            // 事件绑定
            input.bind('click', function() {
                methods.focus.apply(input, $this);
            });
            edit.bind('click', function() {
                methods.focus.apply(input, $this);
            });
            save.bind('click', function() {
                methods.save.apply($this);
            });
            cancel.bind('click', function() {
                methods.cancel.apply(input, $this);
            });
            dropdown.bind('click', function() {
                methods.dropdown.apply($this);
            });
        });
    };
    // 输入框点击方法
    methods.focus = function(wrapper) {
        $(this).focus();
        $(this).data("value", $(this).val());
        var wrapper = $(wrapper),
            isAuto = wrapper.data('open'),
            isSelect = wrapper.hasClass('select'),
            oldValue = $(this).val();
        wrapper.removeClass('hover');
        // 设置为默认自动打开下拉框的选择器
        if (isAuto && isSelect) {
            wrapper.addClass('focus open');
            methods.select.apply(wrapper);
            // 设置为默认不自动打开的选择器
        } else if (!isAuto && isSelect) {
            wrapper.addClass('focus');
            methods.select.apply(wrapper);
        } else {
            // 一般的输入框
            wrapper.addClass('focus');
        }
    };
    // 保存方法
    methods.save = function(wrapper) {
        var wrapper = $(this);
        methods.saving.apply(wrapper);
        setTimeout(function() {
            wrapper.removeClass('focus loading saving open');
        }, 1000);
    };
    // 回滚方法
    methods.cancel = function(wrapper) {
        var wrapper = $(wrapper),
            oldValue = $(this).data('value');
        $(this).val(oldValue);
        wrapper.removeClass('focus open');
    };
    // 下拉框取值方法
    methods.select = function() {
        var wrapper = $(this),
            dropdown = wrapper.find('.dropdown>li>a'),
            input = wrapper.children('.form-control');
        dropdown.bind('click', function() {
            var txt = $(this).text();
            input.val(txt);
            wrapper.removeClass('open');
        });
    };
    // 下拉框方法
    methods.dropdown = function() {
        var wrapper = $(this);
        methods.loading.apply(wrapper);
        setTimeout(function() {
            wrapper.removeClass('loading').addClass('open');
        }, 1000);
    };
    // 加载数据方法
    methods.loading = function() {
        $(this).addClass('loading');
    };
    // 保存数据方法
    methods.saving = function() {
        $(this).addClass('loading saving');
    };
    // 向jQuery中被保护的“fn”命名空间中添加插件代码，用“inlineedit”作为插件的函数名称
    $.fn.inlineedit = function(method) {
        // 检验方法是否存在
        if (methods[method]) {
            // 方法是作为参数传入的，把它从参数列表中删除，因为调用方法时并不需要它
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            // 如果方法不存在，检验对象是否为一个对象（JSON对象）或者method方法没有被传入
        } else if (typeof method === 'object' || !method) {
            // 如果我们传入的是一个对象参数，或者根本没有参数，init方法会被调用，用apply方法来调用我们的方法并传入参数
            return methods.init.apply(this, arguments);
            // 如果方法不存在或者参数没传入，则报出错误。需要调用的方法没有被正确调用
        } else {
            $.error('Method ' + method + ' does not exist on $.error');
        }
    };
})(jQuery);
// 局部作用域中使用$来引用jQuery
